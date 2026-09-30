import type { Node } from '@xyflow/react'
import type { Index, Schema, Table } from '../db/types'
import { tableKey, type Point } from '../layout/keys'
import { tableSize, type Size } from '../layout/sizing'

export interface TableNodeData extends Record<string, unknown> {
  table: Table
}

/** Tables, partitioned tables, views and materialized views all render as this node. */
export type TableNode = Node<TableNodeData, 'table'>
export type DiagramNode = TableNode

const sizeProps = ({ width, height }: Size) => ({
  width,
  height,
  initialWidth: width,
  initialHeight: height,
})

export function buildNodes(schema: Schema, positions: Record<string, Point>): DiagramNode[] {
  const at = (key: string) => positions[key] ?? { x: 0, y: 0 }
  return schema.tables.map((table): TableNode => {
    const id = tableKey(table)
    return { id, type: 'table', position: at(id), data: { table }, ...sizeProps(tableSize(table)) }
  })
}

/** Indexes touching each column, so rows can show inline badges. */
export function indexesByColumn(indexes: Index[]): Map<string, Index[]> {
  const map = new Map<string, Index[]>()
  for (const index of indexes) {
    for (const column of index.columns) map.set(column, [...(map.get(column) ?? []), index])
  }
  return map
}
