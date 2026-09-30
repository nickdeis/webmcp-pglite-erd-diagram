import { beforeAll, describe, expect, it } from 'vitest'
import { FIXTURE_DDL } from './fixture'
import { createDb, schemaFromDdl } from './pglite'
import type { Schema, Table } from './types'

let schema: Schema
const table = (name: string) => schema.tables.find((t) => t.name === name) as Table
const index = (t: string, name: string) => table(t).indexes.find((i) => i.name === name)!

beforeAll(async () => {
  const db = await createDb()
  schema = await schemaFromDdl(db, FIXTURE_DDL)
}, 60_000)

describe('introspect', () => {
  it('finds user tables only', () => {
    expect(schema.tables.map((t) => t.name)).toEqual(['memberships', 'posts', 'users'])
  })

  it('reads comments, keys and types', () => {
    const users = table('users')
    expect(users.comment).toBe('Application users')
    expect(users.columns.find((c) => c.name === 'email')?.comment).toBe('Login address')
    expect(users.columns.find((c) => c.name === 'id')?.isPrimaryKey).toBe(true)
    expect(users.columns.find((c) => c.name === 'name')?.type).toBe('character varying(80)')
    expect(users.columns.find((c) => c.name === 'tags')?.typeCategory).toBe('A')
    expect(users.columns.find((c) => c.name === 'mood')?.typeCategory).toBe('E')
    expect(table('posts').columns[0]?.identity).toBe(true)
  })

  it('reads foreign keys', () => {
    expect(table('posts').foreignKeys[0]).toMatchObject({
      columns: ['author_id'],
      refTable: 'users',
      refColumns: ['id'],
      onDelete: 'c',
    })
  })

  it('classifies index kinds', () => {
    expect(index('posts', 'posts_body_fts').kind).toBe('fts')
    expect(index('users', 'users_bio_fts').kind).toBe('fts')
    expect(index('users', 'users_name_trgm').kind).toBe('trigram')
    expect(index('posts', 'posts_embedding_hnsw').kind).toBe('vector')
    expect(index('posts', 'posts_author_title').kind).toBe('btree')
    expect(index('users', 'users_email_key').unique).toBe(true)
  })

  it('attributes indexes to their columns, including expressions', () => {
    expect(index('posts', 'posts_body_fts').columns).toEqual(['body'])
    expect(index('posts', 'posts_author_title').columns).toEqual(['author_id', 'title'])
    expect(index('users', 'users_email_key').columns).toEqual(['email'])
    expect(index('posts', 'posts_author_title').comment).toBe('Author feed')
  })

  it('leaves the database clean after a run', async () => {
    const db = await createDb()
    await schemaFromDdl(db, 'create table t (id int)')
    expect((await schemaFromDdl(db, 'select 1')).tables).toEqual([])
  })
})
