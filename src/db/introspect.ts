import type { PartitionRow, TableRow, ViewDependencyRow } from './catalogRows'
import { buildDependencies } from './introspectDependencies'
import { buildTable } from './introspectTables'
import { COLUMNS_SQL, CONSTRAINTS_SQL, INDEXES_SQL, TABLES_SQL } from './queries'
import { PARTITIONS_SQL, VIEW_DEPENDENCIES_SQL } from './relationQueries'
import type { Schema } from './types'

export interface Queryable {
  query<T>(sql: string): Promise<{ rows: T[] }>
}

const rows = async <T>(db: Queryable, sql: string) => (await db.query<T>(sql)).rows

/** Read tables, views, partitions, keys, indexes and comments out of pg_catalog. */
export async function introspect(db: Queryable): Promise<Schema> {
  const [tables, partitions, columns, constraints, indexes, viewDeps] = await Promise.all([
    rows<TableRow>(db, TABLES_SQL),
    rows<PartitionRow>(db, PARTITIONS_SQL),
    rows<any>(db, COLUMNS_SQL),
    rows<any>(db, CONSTRAINTS_SQL),
    rows<any>(db, INDEXES_SQL),
    rows<ViewDependencyRow>(db, VIEW_DEPENDENCIES_SQL),
  ])
  return {
    tables: tables.map((t) => buildTable(t, partitions, columns, constraints, indexes)),
    dependencies: buildDependencies({ tables, partitions, viewDeps }),
  }
}
