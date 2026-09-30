import type {
  FunctionDependencyRow,
  FunctionRow,
  PartitionRow,
  TableRow,
  ViewDependencyRow,
} from './catalogRows'
import { functionKey, tableKey } from './keys'
import type { Dependency } from './types'

export interface DependencyInput {
  tables: TableRow[]
  partitions: PartitionRow[]
  functions: FunctionRow[]
  viewDeps: ViewDependencyRow[]
  functionDeps: FunctionDependencyRow[]
}

/** oid → node key. A partition resolves to its top-level parent, since that is what is drawn. */
function keysByOid({ tables, partitions, functions }: DependencyInput) {
  const relations = new Map(tables.map((t) => [t.oid, tableKey(t)]))
  const parentOf = new Map(partitions.map((p) => [p.oid, p.parent_oid]))
  for (const p of partitions) {
    let top = p.parent_oid
    while (parentOf.has(top)) top = parentOf.get(top)!
    if (relations.has(top)) relations.set(p.oid, relations.get(top)!)
  }
  return {
    relations,
    functions: new Map(
      functions.map((f) => [f.oid, functionKey({ ...f, identityArgs: f.identity_args })]),
    ),
  }
}

/** Edges from what is read to the view/function that reads it, between drawn nodes only. */
export function buildDependencies(input: DependencyInput): Dependency[] {
  const keys = keysByOid(input)
  const pairs: [string | undefined, string | undefined][] = [
    ...input.viewDeps.map((d): [string | undefined, string | undefined] => [
      (d.source_class === 'pg_class' ? keys.relations : keys.functions).get(d.source_oid),
      keys.relations.get(d.target_oid),
    ]),
    ...input.functionDeps.map((d): [string | undefined, string | undefined] => [
      keys.relations.get(d.source_oid),
      keys.functions.get(d.fn_oid),
    ]),
  ]
  const unique = new Map<string, Dependency>()
  for (const [source, target] of pairs) {
    if (source && target && source !== target) unique.set(`${source}>${target}`, { source, target })
  }
  return [...unique.values()]
}
