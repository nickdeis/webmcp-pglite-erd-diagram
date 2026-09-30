import type { Table } from '../db/types'

export interface Point {
  x: number
  y: number
}

/** Stable identity of a table across re-runs; also the React Flow node id. */
export const tableKey = (t: Pick<Table, 'schema' | 'name'>) => `${t.schema}.${t.name}`
