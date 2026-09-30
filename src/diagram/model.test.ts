import { describe, expect, it } from 'vitest'
import { makeColumn, makeSchema, makeTable } from '../db/builders'
import { buildEdges } from './edges'
import { nodeHandleId } from './handles'
import { buildNodes } from './model'

const users = makeTable({ name: 'users', columns: [makeColumn('id')] })
const view = makeTable({ kind: 'view', name: 'active_users', columns: [makeColumn('id')] })

const schema = makeSchema([users, view], {
  dependencies: [{ source: 'public.users', target: 'public.active_users' }],
})

describe('buildNodes', () => {
  it('draws tables and views as table nodes keyed by their identity', () => {
    const nodes = buildNodes(schema, { 'public.users': { x: 5, y: 6 } })
    expect(nodes.map((n) => [n.id, n.type])).toEqual([
      ['public.users', 'table'],
      ['public.active_users', 'table'],
    ])
    expect(nodes[0]!.position).toEqual({ x: 5, y: 6 })
    expect(nodes.every((n) => n.width! > 0 && n.height! > 0)).toBe(true)
  })
})

describe('buildEdges', () => {
  const at = {
    'public.users': { x: 0, y: 0 },
    'public.active_users': { x: 400, y: 0 },
  }

  it('draws dashed dependency edges in the reader colour, from source right to reader left', () => {
    const edges = buildEdges(schema, at)
    const toView = edges.find((e) => e.target === 'public.active_users')!
    expect(toView).toMatchObject({
      source: 'public.users',
      sourceHandle: nodeHandleId('source', 'right'),
      targetHandle: nodeHandleId('target', 'left'),
    })
    expect(toView.style).toMatchObject({ stroke: 'var(--neon-green)', strokeDasharray: '6 4' })
  })

  it('flips the sides when the reader sits left of its source', () => {
    const flipped = buildEdges(schema, { ...at, 'public.active_users': { x: -400, y: 0 } })
    const toView = flipped.find((e) => e.target === 'public.active_users')!
    expect(toView.sourceHandle).toBe(nodeHandleId('source', 'left'))
    expect(toView.targetHandle).toBe(nodeHandleId('target', 'right'))
  })

  it('draws foreign keys between column rows in the FK colour', () => {
    const orders = makeTable({
      name: 'orders',
      columns: [makeColumn('user_id')],
      foreignKeys: [
        {
          name: 'fk',
          columns: ['user_id'],
          refSchema: 'public',
          refTable: 'users',
          refColumns: ['id'],
          onUpdate: 'a',
          onDelete: 'a',
        },
      ],
    })
    const [edge] = buildEdges(makeSchema([users, orders]), {})
    expect(edge).toMatchObject({
      source: 'public.orders',
      target: 'public.users',
      sourceHandle: 'user_id:source:left',
      targetHandle: 'id:target:right',
    })
    expect(edge!.style).toMatchObject({ stroke: 'var(--neon-cyan)' })
  })

  it('loops a self-referencing FK out of the right side of its own node', () => {
    const tree = makeTable({
      name: 'categories',
      columns: [makeColumn('id'), makeColumn('parent_id')],
      foreignKeys: [
        {
          name: 'fk_parent',
          columns: ['parent_id'],
          refSchema: 'public',
          refTable: 'categories',
          refColumns: ['id'],
          onUpdate: 'a',
          onDelete: 'a',
        },
      ],
    })
    const [edge] = buildEdges(makeSchema([tree]), {})
    expect(edge).toMatchObject({
      source: 'public.categories',
      target: 'public.categories',
      sourceHandle: 'parent_id:source:right',
      targetHandle: 'id:target:right',
      pathOptions: { offset: 36 },
    })
  })
})
