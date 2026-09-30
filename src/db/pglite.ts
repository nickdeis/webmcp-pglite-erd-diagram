import { PGlite } from '@electric-sql/pglite'
import { btree_gin } from '@electric-sql/pglite/contrib/btree_gin'
import { btree_gist } from '@electric-sql/pglite/contrib/btree_gist'
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm'
import { vector } from '@electric-sql/pglite-pgvector'
import { introspect } from './introspect'
import type { Schema } from './types'

const EXTENSIONS = { pg_trgm, btree_gin, btree_gist, vector }

export const createDb = () => PGlite.create({ extensions: EXTENSIONS })

export type Db = Awaited<ReturnType<typeof createDb>>

/**
 * Run DDL and introspect the result inside a transaction that is always rolled back,
 * so the database is pristine for the next run. Throws the Postgres error on bad DDL.
 */
export async function schemaFromDdl(db: Db, ddl: string): Promise<Schema> {
  let schema!: Schema
  await db.transaction(async (tx) => {
    await tx.exec(ddl)
    schema = await introspect(tx)
    await tx.rollback()
  })
  return schema
}
