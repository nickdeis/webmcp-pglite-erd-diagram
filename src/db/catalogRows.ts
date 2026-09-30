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

export interface FunctionRow {
  oid: number
  schema: string
  name: string
  language: string
  identity_args: string
  return_type: string
  return_type_name: string
  return_type_category: string
  returns_set: boolean
  comment: string | null
}

export interface FunctionArgRow {
  fn_oid: number
  name: string
  mode: 'i' | 'o' | 'b' | 'v' | 't'
  type: string
  type_name: string
  type_category: string
}

export interface ViewDependencyRow {
  target_oid: number
  source_oid: number
  source_class: 'pg_class' | 'pg_proc'
}

export interface FunctionDependencyRow {
  fn_oid: number
  source_oid: number
}
