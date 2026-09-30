import { beforeAll, describe, expect, it } from 'vitest'
import { FIXTURE_OBJECTS_DDL } from './fixtureObjects'
import { runDdl } from './instance'
import type { Schema, Table } from './types'

let schema: Schema
const table = (name: string) => schema.tables.find((t) => t.name === name) as Table

beforeAll(async () => {
  schema = await runDdl(FIXTURE_OBJECTS_DDL)
}, 60_000)

describe('relation kinds', () => {
  it('lists tables and views but nests partitions', () => {
    expect(schema.tables.map((t) => t.name)).toEqual([
      'active_users',
      'chained',
      'events',
      'post_authors',
      'post_counts',
      'posts',
      'recent_events',
      'users',
    ])
  })

  it('classifies each relation', () => {
    const kinds = Object.fromEntries(schema.tables.map((t) => [t.name, t.kind]))
    expect(kinds).toMatchObject({
      users: 'table',
      events: 'partitioned_table',
      active_users: 'view',
      post_counts: 'materialized_view',
    })
  })

  it('reads view columns, comment and defining query', () => {
    const view = table('active_users')
    expect(view.columns.map((c) => c.name)).toEqual(['id', 'email'])
    expect(view.comment).toBe('Users with a name')
    expect(view.definition).toMatch(/select/i)
    expect(table('users').definition).toBeNull()
  })

  it('keeps indexes on materialized views', () => {
    expect(table('post_counts').indexes.map((i) => i.name)).toEqual(['post_counts_author'])
  })
})

describe('partitions', () => {
  it('nests partitions and sub-partitions under the parent with their bounds', () => {
    const events = table('events')
    expect(events.partitionKey).toBe('RANGE (happened_at)')
    expect(events.partitions.map((p) => [p.name, p.depth])).toEqual([
      ['events_2024', 0],
      ['events_2025', 0],
      ['events_2025_eu', 1],
      ['events_default', 0],
    ])
    expect(events.partitions[0]!.bound).toMatch(/^FOR VALUES FROM/)
    expect(events.partitions[1]!.partitionKey).toBe('LIST (region)')
    expect(events.partitions[2]!.bound).toBe("FOR VALUES IN ('eu')")
    expect(events.partitions[3]!.bound).toBe('DEFAULT')
  })
})

describe('dependencies', () => {
  const has = (source: string, target: string) =>
    schema.dependencies.some((d) => d.source === source && d.target === target)

  it('links views to the tables and views they read', () => {
    expect(has('public.users', 'public.active_users')).toBe(true)
    expect(has('public.posts', 'public.post_authors')).toBe(true)
    expect(has('public.users', 'public.post_authors')).toBe(true)
    expect(has('public.active_users', 'public.chained')).toBe(true)
    expect(has('public.posts', 'public.post_counts')).toBe(true)
  })

  it('resolves a read partition to its drawn parent', () => {
    expect(has('public.events', 'public.recent_events')).toBe(true)
  })

  it('has no self edges or duplicates', () => {
    const ids = schema.dependencies.map((d) => `${d.source}>${d.target}`)
    expect(new Set(ids).size).toBe(ids.length)
    expect(schema.dependencies.every((d) => d.source !== d.target)).toBe(true)
  })
})
