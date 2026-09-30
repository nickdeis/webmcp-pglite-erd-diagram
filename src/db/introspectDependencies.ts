import type { PartitionRow, TableRow, ViewDependencyRow } from './catalogRows'
import { tableKey } from './keys'
import type { Dependency } from './types'

export interface DependencyInput {
  tables: TableRow[]
  partitions: PartitionRow[]
  viewDeps: ViewDependencyRow[]
}

/** oid → node key. A partition resolves to its top-level parent, since that is what is drawn. */
function keysByOid({ tables, partitions }: DependencyInput) {
  const relations = new Map(tables.map((t) => [t.oid, tableKey(t)]))
  const parentOf = new Map(partitions.map((p) => [p.oid, p.parent_oid]))
  for (const p of partitions) {
    let top = p.parent_oid
    while (parentOf.has(top)) top = parentOf.get(top)!
    if (relations.has(top)) relations.set(p.oid, relations.get(top)!)
  }
  return relations
}

/** Edges from what is read to the view that reads it, between drawn nodes only. */
export function buildDependencies(input: DependencyInput): Dependency[] {
  const keys = keysByOid(input)
  const unique = new Map<string, Dependency>()
  for (const d of input.viewDeps) {
    const source = keys.get(d.source_oid)
    const target = keys.get(d.target_oid)
    if (source && target && source !== target) unique.set(`${source}>${target}`, { source, target })
  }
  return [...unique.values()]
}
