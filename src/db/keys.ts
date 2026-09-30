import type { Table } from './types'

/** Stable identity of a table/view across re-runs; also the React Flow node id. */
export const tableKey = (t: Pick<Table, 'schema' | 'name'>) => `${t.schema}.${t.name}`
