import { createDb, schemaFromDdl, type Db } from './pglite'
import { toDdlError, formatDdlError } from './ddlError'
import type { Schema } from './types'

let db: Promise<Db> | null = null

/** The one PGlite instance shared by the editor pipeline and the WebMCP tools. */
export const getDb = (): Promise<Db> => (db ??= createDb())

/** Run the DDL against an empty database (rolled back) and introspect it. Rejects with the raw Postgres error. */
export async function runDdl(ddl: string): Promise<Schema> {
  return schemaFromDdl(await getDb(), ddl)
}

/** Like `runDdl`, but rejects with an `Error` whose message starts with `Line N:` for humans and LLMs. */
export async function runDdlOrExplain(ddl: string): Promise<Schema> {
  try {
    return await runDdl(ddl)
  } catch (e) {
    throw new Error(formatDdlError(toDdlError(ddl, e)))
  }
}
