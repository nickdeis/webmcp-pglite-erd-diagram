import type { Table, TableFunction } from './types'

/** Stable identity of a table/view across re-runs; also the React Flow node id. */
export const tableKey = (t: Pick<Table, 'schema' | 'name'>) => `${t.schema}.${t.name}`

/** Overloads share a name, so the identity arguments are part of a function's key. */
export const functionKey = (f: Pick<TableFunction, 'schema' | 'name' | 'identityArgs'>) =>
  `${f.schema}.${f.name}(${f.identityArgs})`
