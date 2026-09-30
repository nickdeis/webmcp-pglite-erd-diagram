import type { SQLNamespace } from '@codemirror/lang-sql'
import type { Schema } from '../db/types'

/** Tables, views and functions from the last successful run, for identifier autocomplete. */
export function completionNamespace(schema: Schema | null): SQLNamespace {
  const relations = (schema?.tables ?? []).map(
    (t) => [t.name, t.columns.map((c) => c.name)] as const,
  )
  const functions = (schema?.functions ?? []).map(
    (f) =>
      [
        f.name,
        { self: { label: f.name, type: 'function', detail: `(${f.identityArgs})` }, children: [] },
      ] as const,
  )
  return Object.fromEntries([...functions, ...relations])
}
