export type IndexKind =
  'btree' | 'hash' | 'gin' | 'gist' | 'spgist' | 'brin' | 'fts' | 'trigram' | 'vector' | 'other'

export interface Column {
  name: string
  attnum: number
  /** Display type from format_type, e.g. `character varying(255)`. */
  type: string
  /** pg_type.typname, e.g. `varchar`, `_int4`, `vector`. */
  typeName: string
  /** pg_type.typcategory single letter, e.g. `N`, `S`, `A`. */
  typeCategory: string
  notNull: boolean
  default: string | null
  generated: boolean
  identity: boolean
  isPrimaryKey: boolean
  comment: string | null
}

export interface Index {
  name: string
  kind: IndexKind
  method: string
  unique: boolean
  /** Names of every column the index touches (key columns and expression inputs). */
  columns: string[]
  definition: string
  comment: string | null
}

export interface ForeignKey {
  name: string
  columns: string[]
  refSchema: string
  refTable: string
  refColumns: string[]
  onUpdate: string
  onDelete: string
}

export type RelationKind = 'table' | 'partitioned_table' | 'view' | 'materialized_view'

/** A partition nested under its parent; `depth` 0 is a direct child, deeper levels are sub-partitions. */
export interface Partition {
  schema: string
  name: string
  /** Bound expression, e.g. `FOR VALUES FROM ('2024-01-01') TO ('2025-01-01')` or `DEFAULT`. */
  bound: string
  depth: number
  /** Set when this partition is itself partitioned, e.g. `LIST (region)`. */
  partitionKey: string | null
}

/** A table, partitioned table, view or materialized view (all share columns and indexes). */
export interface Table {
  kind: RelationKind
  schema: string
  name: string
  comment: string | null
  columns: Column[]
  indexes: Index[]
  foreignKeys: ForeignKey[]
  /** e.g. `RANGE (created_at)` for partitioned tables. */
  partitionKey: string | null
  partitions: Partition[]
  /** Defining query for views and materialized views. */
  definition: string | null
}

export interface TypedValue {
  name: string
  /** Display type from format_type. */
  type: string
  typeName: string
  typeCategory: string
}

export interface FunctionArg extends TypedValue {
  mode: 'in' | 'inout' | 'variadic'
}

/** A function that returns rows: `RETURNS TABLE(...)`, `SETOF x`, or OUT parameters. */
export interface TableFunction {
  schema: string
  name: string
  /** Argument types as Postgres identifies the overload, e.g. `integer, text`. */
  identityArgs: string
  language: string
  comment: string | null
  args: FunctionArg[]
  /** Returned columns; for `SETOF scalar` a single unnamed entry. */
  returns: TypedValue[]
  returnsSet: boolean
}

/** `source` is read by `target` (view, materialized view or function); both are node keys. */
export interface Dependency {
  source: string
  target: string
}

export interface Schema {
  tables: Table[]
  functions: TableFunction[]
  dependencies: Dependency[]
}
