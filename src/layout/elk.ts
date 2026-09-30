import ELK from 'elkjs/lib/elk.bundled.js'
import type { Schema } from '../db/types'
import { functionKey, tableKey, type Point } from './keys'
import { functionSize, tableSize } from './sizing'

const LAYOUT_OPTIONS = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.spacing.nodeNode': '50',
  'elk.layered.spacing.nodeNodeBetweenLayers': '110',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
}

const elk = new ELK()

/**
 * Lay nodes out left-to-right: referenced tables and dependency sources sit left of the tables, views and
 * functions that point at / read them. Returns top-left positions by node key.
 */
export async function layoutSchema(schema: Schema): Promise<Record<string, Point>> {
  const graph = {
    id: 'root',
    layoutOptions: LAYOUT_OPTIONS,
    children: [
      ...schema.tables.map((t) => ({ id: tableKey(t), ...tableSize(t) })),
      ...schema.functions.map((f) => ({ id: functionKey(f), ...functionSize(f) })),
    ],
    edges: layoutEdges(schema),
  }
  const laid = await elk.layout(graph)
  return Object.fromEntries((laid.children ?? []).map((c) => [c.id, { x: c.x ?? 0, y: c.y ?? 0 }]))
}

interface LayoutEdge {
  id: string
  sources: [string]
  targets: [string]
}

/** FK and dependency edges between drawn nodes; self-references would only confuse the layering. */
function layoutEdges(schema: Schema): LayoutEdge[] {
  const keys = new Set([...schema.tables.map(tableKey), ...schema.functions.map(functionKey)])
  const foreignKeys = schema.tables.flatMap((t) =>
    t.foreignKeys.map((fk) => ({
      id: `${tableKey(t)}:${fk.name}`,
      sources: [`${fk.refSchema}.${fk.refTable}`] as [string],
      targets: [tableKey(t)] as [string],
    })),
  )
  const dependencies = schema.dependencies.map((d) => ({
    id: `dep:${d.source}>${d.target}`,
    sources: [d.source] as [string],
    targets: [d.target] as [string],
  }))
  return [...foreignKeys, ...dependencies].filter(
    (e) => keys.has(e.sources[0]) && keys.has(e.targets[0]) && e.sources[0] !== e.targets[0],
  )
}
