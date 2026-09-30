import type { SQLNamespace } from '@codemirror/lang-sql'
import type { Schema } from '../db/types'

/** Tables and views (with their columns) from the last successful run, for identifier autocomplete. */
export function completionNamespace(schema: Schema | null): SQLNamespace {
  return Object.fromEntries(
    (schema?.tables ?? []).map((t) => [t.name, t.columns.map((c) => c.name)] as const),
  )
}
