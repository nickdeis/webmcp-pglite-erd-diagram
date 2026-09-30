/** Raw rows returned by the catalog queries (snake_case, as Postgres names the columns). */
export interface TableRow {
  oid: number
  schema: string
  name: string
  relkind: 'r' | 'p' | 'v' | 'm'
  comment: string | null
  partition_key: string | null
  definition: string | null
}

export interface PartitionRow {
  parent_oid: number
  oid: number
  schema: string
  name: string
  bound: string
  partition_key: string | null
}

export interface ViewDependencyRow {
  target_oid: number
  source_oid: number
}
