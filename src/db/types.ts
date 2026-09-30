export type IndexKind =
  | 'btree'
  | 'hash'
  | 'gin'
  | 'gist'
  | 'spgist'
  | 'brin'
  | 'fts'
  | 'trigram'
  | 'vector'
  | 'other'

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

export interface Table {
  schema: string
  name: string
  comment: string | null
  columns: Column[]
  indexes: Index[]
  foreignKeys: ForeignKey[]
}

export interface Schema {
  tables: Table[]
}
