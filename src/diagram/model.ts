import { MarkerType, type Edge, type Node } from '@xyflow/react'
import type { Index, Schema, Table } from '../db/types'
import { tableKey, type Point } from '../layout/elk'
import { tableSize, type Size } from '../layout/sizing'

export interface TableNodeData extends Record<string, unknown> {
  table: Table
}

export type TableNode = Node<TableNodeData, 'table'>

/** Handle ids: one source and one target handle per column and side. */
export const handleId = (column: string, role: 'source' | 'target', side: 'left' | 'right') =>
  `${column}:${role}:${side}`

export function buildNodes(schema: Schema, positions: Record<string, Point>): TableNode[] {
  return schema.tables.map((table) => {
    const key = tableKey(table)
    return {
      id: key,
      type: 'table',
      position: positions[key] ?? { x: 0, y: 0 },
      data: { table },
      ...sizeProps(tableSize(table)),
    }
  })
}

const sizeProps = ({ width, height }: Size) => ({
  width,
  height,
  initialWidth: width,
  initialHeight: height,
})

/** One edge per FK: from the referencing column row to the referenced column row. */
export function buildEdges(schema: Schema, positions: Record<string, Point>): Edge[] {
  const keys = new Set(schema.tables.map(tableKey))
  return schema.tables.flatMap((table) =>
    table.foreignKeys
      .filter((fk) => keys.has(`${fk.refSchema}.${fk.refTable}`))
      .map((fk) => {
        const target = `${fk.refSchema}.${fk.refTable}`
        const refLeft = (positions[target]?.x ?? 0) <= (positions[tableKey(table)]?.x ?? 0)
        const [srcSide, tgtSide] = refLeft
          ? (['left', 'right'] as const)
          : (['right', 'left'] as const)
        return {
          id: `${tableKey(table)}:${fk.name}`,
          source: tableKey(table),
          target,
          sourceHandle: handleId(fk.columns[0]!, 'source', srcSide),
          targetHandle: handleId(fk.refColumns[0]!, 'target', tgtSide),
          type: 'smoothstep',
          label: fk.columns.length > 1 ? fk.columns.join(', ') : undefined,
          markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--neon-cyan)' },
          style: { stroke: 'var(--neon-cyan)', strokeWidth: 1.5 },
        }
      }),
  )
}

/** Indexes touching each column, so rows can show inline badges. */
export function indexesByColumn(indexes: Index[]): Map<string, Index[]> {
  const map = new Map<string, Index[]>()
  for (const index of indexes) {
    for (const column of index.columns) map.set(column, [...(map.get(column) ?? []), index])
  }
  return map
}
