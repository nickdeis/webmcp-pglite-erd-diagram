import { describe, expect, it } from 'vitest'
import { formatDdlError, toDdlError } from './ddlError'

const DDL = 'create table a (id int);\ncreate table b (id int,);\n'

describe('toDdlError', () => {
  it('maps a 1-based character position to its line', () => {
    const position = DDL.indexOf('b (id') + 1
    expect(toDdlError(DDL, { message: 'boom', position: String(position) })).toEqual({
      message: 'boom',
      line: 2,
    })
  })

  it('has no line when Postgres gives no position', () => {
    expect(toDdlError(DDL, new Error('nope'))).toEqual({ message: 'nope', line: null })
  })
})

describe('formatDdlError', () => {
  it('prefixes the line when known', () => {
    expect(formatDdlError({ message: 'boom', line: 2 })).toBe('Line 2: boom')
    expect(formatDdlError({ message: 'boom', line: null })).toBe('boom')
  })
})
