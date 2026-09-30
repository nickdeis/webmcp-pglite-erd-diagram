import { MarkerType, type Edge } from '@xyflow/react'
import type { Dependency, ForeignKey, Schema, Table } from '../db/types'
import { functionKey, tableKey, type Point } from '../layout/keys'
import { FUNCTION_STYLE, RELATION_STYLES } from '../theme/relationStyle'
import { handleId, nodeHandleId, type HandleSide } from './handles'

type Positions = Record<string, Point>
type Sides = readonly [source: HandleSide, target: HandleSide]

const FK_COLOR = 'var(--neon-cyan)'

/** Attach on the facing sides: the left node's right edge to the right node's left edge. */
const facingSides = (leftKey: string, rightKey: string, positions: Positions): boolean =>
  (positions[leftKey]?.x ?? 0) <= (positions[rightKey]?.x ?? 0)

const arrow = (color: string) => ({ type: MarkerType.ArrowClosed, color })

/** One edge per FK: from the referencing column row to the referenced column row. */
function foreignKeyEdge(table: Table, fk: ForeignKey, positions: Positions): Edge {
  const source = tableKey(table)
  const target = `${fk.refSchema}.${fk.refTable}`
  const sides: Sides = facingSides(target, source, positions)
    ? ['left', 'right']
    : ['right', 'left']
  return {
    id: `${source}:${fk.name}`,
    source,
    target,
    sourceHandle: handleId(fk.columns[0]!, 'source', sides[0]),
    targetHandle: handleId(fk.refColumns[0]!, 'target', sides[1]),
    type: 'smoothstep',
    label: fk.columns.length > 1 ? fk.columns.join(', ') : undefined,
    markerEnd: arrow(FK_COLOR),
    style: { stroke: FK_COLOR, strokeWidth: 1.5 },
  }
}

/** Dashed edge from what is read to the view/function that reads it, coloured like the reader. */
function dependencyEdge(dep: Dependency, color: string, positions: Positions): Edge {
  const sides: Sides = facingSides(dep.source, dep.target, positions)
    ? ['right', 'left']
    : ['left', 'right']
  return {
    id: `dep:${dep.source}>${dep.target}`,
    source: dep.source,
    target: dep.target,
    sourceHandle: nodeHandleId('source', sides[0]),
    targetHandle: nodeHandleId('target', sides[1]),
    type: 'smoothstep',
    markerEnd: arrow(color),
    style: { stroke: color, strokeWidth: 1.5, strokeDasharray: '6 4' },
  }
}

function nodeColors(schema: Schema): Map<string, string> {
  const colors = new Map<string, string>()
  for (const t of schema.tables) colors.set(tableKey(t), RELATION_STYLES[t.kind].color)
  for (const f of schema.functions) colors.set(functionKey(f), FUNCTION_STYLE.color)
  return colors
}

export function buildEdges(schema: Schema, positions: Positions): Edge[] {
  const keys = new Set(schema.tables.map(tableKey))
  const colors = nodeColors(schema)
  const foreignKeys = schema.tables.flatMap((table) =>
    table.foreignKeys
      .filter((fk) => keys.has(`${fk.refSchema}.${fk.refTable}`))
      .map((fk) => foreignKeyEdge(table, fk, positions)),
  )
  const dependencies = schema.dependencies.map((dep) =>
    dependencyEdge(dep, colors.get(dep.target) ?? FK_COLOR, positions),
  )
  return [...foreignKeys, ...dependencies]
}
