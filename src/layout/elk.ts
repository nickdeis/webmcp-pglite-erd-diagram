import ELK from 'elkjs/lib/elk.bundled.js'
import type { Schema, Table } from '../db/types'
import { tableSize } from './sizing'

export interface Point {
  x: number
  y: number
}

export const tableKey = (t: Pick<Table, 'schema' | 'name'>) => `${t.schema}.${t.name}`

const LAYOUT_OPTIONS = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.spacing.nodeNode': '50',
  'elk.layered.spacing.nodeNodeBetweenLayers': '110',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
}

const elk = new ELK()

/** Lay tables out left-to-right, following foreign keys. Returns top-left positions by table key. */
export async function layoutSchema(schema: Schema): Promise<Record<string, Point>> {
  const keys = new Set(schema.tables.map(tableKey))
  const graph = {
    id: 'root',
    layoutOptions: LAYOUT_OPTIONS,
    children: schema.tables.map((t) => ({ id: tableKey(t), ...tableSize(t) })),
    edges: schema.tables.flatMap((t) =>
      t.foreignKeys
        .map((fk) => ({
          id: `${tableKey(t)}:${fk.name}`,
          // Referenced (parent) tables sit left of the tables that point at them.
          sources: [`${fk.refSchema}.${fk.refTable}`],
          targets: [tableKey(t)],
        }))
        .filter((e) => keys.has(e.sources[0]!) && e.sources[0] !== e.targets[0]),
    ),
  }
  const laid = await elk.layout(graph)
  return Object.fromEntries((laid.children ?? []).map((c) => [c.id, { x: c.x ?? 0, y: c.y ?? 0 }]))
}
