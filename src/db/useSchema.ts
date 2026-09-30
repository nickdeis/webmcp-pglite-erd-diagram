import { useEffect, useState } from 'react'
import { toDdlError, type DdlError } from './ddlError'
import { runDdl } from './instance'
import type { Schema } from './types'

const DEBOUNCE_MS = 350

export interface SchemaState {
  /** Last schema that ran cleanly; kept while the current DDL has errors. */
  schema: Schema | null
  error: DdlError | null
  loading: boolean
}

/** Runs the DDL in PGlite (debounced, latest wins) and exposes the resulting schema or error. */
export function useSchema(ddl: string): SchemaState {
  const [state, setState] = useState<SchemaState>({ schema: null, error: null, loading: true })

  useEffect(() => {
    let stale = false
    const timer = setTimeout(async () => {
      try {
        const schema = await runDdl(ddl)
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
