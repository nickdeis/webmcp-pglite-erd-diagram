import type { Column, Schema, Table } from './types'

/** Test helpers: build schema objects with only the fields a test cares about. */
export const makeColumn = (name: string, overrides: Partial<Column> = {}): Column => ({
  name,
  attnum: 1,
  type: 'integer',
  typeName: 'int4',
  typeCategory: 'N',
  notNull: false,
  default: null,
  generated: false,
  identity: false,
  isPrimaryKey: false,
  comment: null,
  ...overrides,
})

export const makeTable = (overrides: Partial<Table> = {}): Table => ({
  kind: 'table',
  schema: 'public',
  name: 't',
  comment: null,
  columns: [],
  indexes: [],
  foreignKeys: [],
  partitionKey: null,
  partitions: [],
  definition: null,
  ...overrides,
})

export const makeSchema = (tables: Table[] = [], overrides: Partial<Schema> = {}): Schema => ({
  tables,
  dependencies: [],
  ...overrides,
})
