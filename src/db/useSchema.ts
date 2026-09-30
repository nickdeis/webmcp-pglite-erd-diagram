import { useEffect, useRef, useState } from 'react'
import type { DdlError } from '../editor/ErrorBanner'
import { createDb, schemaFromDdl, type Db } from './pglite'
import type { Schema } from './types'

const DEBOUNCE_MS = 350

export interface SchemaState {
  /** Last schema that ran cleanly; kept while the current DDL has errors. */
  schema: Schema | null
  error: DdlError | null
  loading: boolean
}

const lineAt = (ddl: string, position: unknown): number | null =>
  typeof position === 'string' || typeof position === 'number'
    ? ddl.slice(0, Number(position) - 1).split('\n').length
    : null

const toDdlError = (ddl: string, e: unknown): DdlError => {
  const err = e as { message?: string; position?: unknown }
  return { message: err.message ?? String(e), line: lineAt(ddl, err.position) }
}

/** Runs the DDL in PGlite (debounced, latest wins) and exposes the resulting schema or error. */
export function useSchema(ddl: string): SchemaState {
  const db = useRef<Promise<Db>>(null)
  const [state, setState] = useState<SchemaState>({ schema: null, error: null, loading: true })

  useEffect(() => {
    db.current ??= createDb()
    let stale = false
    const timer = setTimeout(async () => {
      try {
        const schema = await schemaFromDdl(await db.current!, ddl)
        if (!stale) setState({ schema, error: null, loading: false })
      } catch (e) {
        if (!stale) setState((s) => ({ ...s, error: toDdlError(ddl, e), loading: false }))
      }
    }, DEBOUNCE_MS)
    return () => {
      stale = true
      clearTimeout(timer)
    }
  }, [ddl])

  return state
}
