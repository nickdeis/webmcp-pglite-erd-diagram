import { describe, expect, it } from 'vitest'
import { FIXTURE_DDL } from '../db/fixture'
import { FIXTURE_OBJECTS_DDL } from '../db/fixtureObjects'
import { createDb, schemaFromDdl } from '../db/pglite'
import { layoutSchema } from './elk'
import { tableSize } from './sizing'

describe('layout', () => {
  it('sizes tables by rows, indexes and comments', async () => {
    const schema = await schemaFromDdl(await createDb(), FIXTURE_DDL)
    const [memberships, posts, users] = schema.tables
    expect(tableSize(posts!).height).toBeGreaterThan(tableSize(memberships!).height)
    expect(tableSize(users!).width).toBeGreaterThanOrEqual(220)
  }, 60_000)

  it('puts referenced tables left of referencing ones', async () => {
    const schema = await schemaFromDdl(await createDb(), FIXTURE_DDL)
    const pos = await layoutSchema(schema)
    expect(Object.keys(pos).sort()).toEqual(['public.memberships', 'public.posts', 'public.users'])
    expect(pos['public.posts']!.x).toBeGreaterThan(pos['public.users']!.x)
  }, 60_000)

  it('places views right of what they read, and includes every node', async () => {
    const schema = await schemaFromDdl(await createDb(), FIXTURE_OBJECTS_DDL)
    const pos = await layoutSchema(schema)
    expect(Object.keys(pos)).toHaveLength(schema.tables.length)
    expect(pos['public.active_users']!.x).toBeGreaterThan(pos['public.users']!.x)
    expect(pos['public.chained']!.x).toBeGreaterThan(pos['public.active_users']!.x)
  }, 60_000)
})
