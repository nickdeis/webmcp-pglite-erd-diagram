import type {
  FunctionArgRow,
  FunctionDependencyRow,
  FunctionRow,
  PartitionRow,
  TableRow,
  ViewDependencyRow,
} from './catalogRows'
import { FUNCTION_ARGS_SQL, FUNCTION_DEPENDENCIES_SQL, FUNCTIONS_SQL } from './functionQueries'
import { buildDependencies } from './introspectDependencies'
import { buildFunction } from './introspectFunctions'
import { buildTable } from './introspectTables'
import { COLUMNS_SQL, CONSTRAINTS_SQL, INDEXES_SQL, TABLES_SQL } from './queries'
import { PARTITIONS_SQL, VIEW_DEPENDENCIES_SQL } from './relationQueries'
import type { Schema } from './types'

export interface Queryable {
  query<T>(sql: string): Promise<{ rows: T[] }>
}

const rows = async <T>(db: Queryable, sql: string) => (await db.query<T>(sql)).rows

/** Read tables, views, partitions, table functions, keys, indexes and comments out of pg_catalog. */
export async function introspect(db: Queryable): Promise<Schema> {
  const [tables, partitions, columns, constraints, indexes] = await Promise.all([
    rows<TableRow>(db, TABLES_SQL),
    rows<PartitionRow>(db, PARTITIONS_SQL),
    rows<any>(db, COLUMNS_SQL),
    rows<any>(db, CONSTRAINTS_SQL),
    rows<any>(db, INDEXES_SQL),
  ])
  const [functions, functionArgs, viewDeps, functionDeps] = await Promise.all([
    rows<FunctionRow>(db, FUNCTIONS_SQL),
    rows<FunctionArgRow>(db, FUNCTION_ARGS_SQL),
    rows<ViewDependencyRow>(db, VIEW_DEPENDENCIES_SQL),
    rows<FunctionDependencyRow>(db, FUNCTION_DEPENDENCIES_SQL),
  ])
  return {
    tables: tables.map((t) => buildTable(t, partitions, columns, constraints, indexes)),
    functions: functions.map((f) => buildFunction(f, functionArgs)),
    dependencies: buildDependencies({ tables, partitions, functions, viewDeps, functionDeps }),
  }
}
