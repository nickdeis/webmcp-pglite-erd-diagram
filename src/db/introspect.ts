import { classifyIndex } from './indexKind'
import { COLUMNS_SQL, CONSTRAINTS_SQL, INDEXES_SQL, TABLES_SQL } from './queries'
import type { Column, ForeignKey, Index, Schema, Table } from './types'

export interface Queryable {
  query<T>(sql: string): Promise<{ rows: T[] }>
}

const rows = async <T>(db: Queryable, sql: string) => (await db.query<T>(sql)).rows

/** Read tables, columns, keys, indexes and comments out of pg_catalog. */
export async function introspect(db: Queryable): Promise<Schema> {
  const [tables, columns, constraints, indexes] = await Promise.all([
    rows<any>(db, TABLES_SQL),
    rows<any>(db, COLUMNS_SQL),
    rows<any>(db, CONSTRAINTS_SQL),
    rows<any>(db, INDEXES_SQL),
  ])
  return { tables: tables.map((t) => buildTable(t, columns, constraints, indexes)) }
}

function buildTable(t: any, columns: any[], constraints: any[], indexes: any[]): Table {
  const own = <R extends { table_oid: number }>(list: R[]) =>
    list.filter((r) => r.table_oid === t.oid)
  const primaryKey = new Set(
    own(constraints)
      .filter((c) => c.type === 'p')
      .flatMap((c) => c.columns),
  )
  return {
    schema: t.schema,
    name: t.name,
    comment: t.comment,
    columns: own(columns).map((c) => toColumn(c, primaryKey)),
    indexes: own(indexes).map(toIndex),
    foreignKeys: own(constraints)
      .filter((c) => c.type === 'f')
      .map(toForeignKey),
  }
}

const toColumn = (c: any, primaryKey: Set<string>): Column => ({
  name: c.name,
  attnum: c.attnum,
  type: c.type,
  typeName: c.type_name,
  typeCategory: c.type_category,
  notNull: c.not_null,
  default: c.default,
  generated: c.generated,
  identity: c.identity,
  isPrimaryKey: primaryKey.has(c.name),
  comment: c.comment,
})

const toIndex = (i: any): Index => ({
  name: i.name,
  method: i.method,
  kind: classifyIndex({
    method: i.method,
    opclasses: i.opclasses,
    keyTypes: i.key_types,
    definition: i.definition,
  }),
  unique: i.unique,
  columns: i.columns,
  definition: i.definition,
  comment: i.comment,
})

const toForeignKey = (c: any): ForeignKey => ({
  name: c.name,
  columns: c.columns,
  refSchema: c.ref_schema,
  refTable: c.ref_table,
  refColumns: c.ref_columns,
  onUpdate: c.on_update,
  onDelete: c.on_delete,
})
