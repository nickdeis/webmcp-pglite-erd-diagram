import { describe, expect, it } from 'vitest'
import { FIXTURE_DDL } from '../db/fixture'
import { runDdlOrExplain } from '../db/instance'
import { formatSql } from '../editor/format'
import { createTools } from './tools'

function setup(initial = FIXTURE_DDL) {
  const state = { ddl: initial, applied: [] as string[] }
  const tools = createTools({
    getDdl: () => state.ddl,
    applyDdl: (ddl) => {
      state.ddl = ddl
      state.applied.push(ddl)
    },
    format: formatSql,
    run: runDdlOrExplain,
  })
  const call = (name: string, input?: unknown) => tools.find((t) => t.name === name)!.execute(input)
  return { state, tools, call }
}

const BAD_DDL = 'create table a (id int);\ncreate table b (id int,, );'

describe('tool list', () => {
  it('exposes the five tools, read-only except write_sql', () => {
    const { tools } = setup()
    expect(tools.map((t) => t.name)).toEqual([
      'read_sql',
      'format_sql',
      'validate_sql',
      'write_sql',
      'read_schema',
    ])
    const writable = tools.filter((t) => !t.annotations?.readOnlyHint).map((t) => t.name)
    expect(writable).toEqual(['write_sql'])
  })

  it('tells the LLM the script is complete and run from an empty database', () => {
    const { tools } = setup()
    expect(tools.find((t) => t.name === 'write_sql')!.description).toMatch(
      /COMPLETE.*empty database/,
    )
  })
})

describe('read and format', () => {
  it('read_sql returns the editor content, valid or not', async () => {
    expect(await setup(BAD_DDL).call('read_sql')).toBe(BAD_DDL)
  })

  it('format_sql returns formatted SQL without touching the editor', async () => {
    const { call, state } = setup('x')
    expect(await call('format_sql', { sql: 'CREATE TABLE t (id int);' })).toBe(
      'create table t (id int);\n',
    )
    expect(state.ddl).toBe('x')
  })
})

describe('validate_sql', () => {
  it('confirms valid DDL', async () => {
    expect(await setup().call('validate_sql', { sql: 'create table t (id int);' })).toBe(
      'DDL is valid.',
    )
  })

  it('throws the Postgres message with a line number', async () => {
    await expect(setup().call('validate_sql', { sql: BAD_DDL })).rejects.toThrow(/^Line 2: /)
  })

  it('rejects input without sql', async () => {
    await expect(setup().call('validate_sql', {})).rejects.toThrow(TypeError)
  })
})

describe('write_sql', () => {
  it('validates, formats and replaces the editor content', async () => {
    const { call, state } = setup('old')
    const result = await call('write_sql', { sql: 'CREATE TABLE t (id int primary key);' })
    expect(state.applied).toEqual(['create table t (id int primary key);\n'])
    expect(state.ddl).toBe('create table t (id int primary key);\n')
    expect(result).toBe('Wrote 2 lines to the editor.')
  })

  it('changes nothing and points into the submitted text when the DDL is invalid', async () => {
    const { call, state } = setup('old')
    await expect(call('write_sql', { sql: BAD_DDL })).rejects.toThrow(/^Line 2: /)
    expect(state.applied).toEqual([])
    expect(state.ddl).toBe('old')
  })
})

describe('read_schema', () => {
  it('reflects the current editor content immediately after a write', async () => {
    const { call } = setup()
    expect((await call('read_schema')) as { tables: unknown[] }).toMatchObject({
      tables: expect.any(Array),
    })
    await call('write_sql', { sql: 'create table only_one (id int);' })
    const schema = (await call('read_schema')) as { tables: { name: string }[] }
    expect(schema.tables.map((t) => t.name)).toEqual(['only_one'])
  })

  it('throws when the current DDL is invalid', async () => {
    await expect(setup(BAD_DDL).call('read_schema')).rejects.toThrow(/Line 2/)
  })
})
