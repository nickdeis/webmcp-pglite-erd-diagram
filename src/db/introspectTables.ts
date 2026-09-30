import type { PartitionRow, TableRow } from './catalogRows'
import { classifyIndex } from './indexKind'
import type { Column, ForeignKey, Index, Partition, RelationKind, Table } from './types'

const KIND_BY_RELKIND: Record<TableRow['relkind'], RelationKind> = {
  r: 'table',
  p: 'partitioned_table',
  v: 'view',
  m: 'materialized_view',
}

/** Depth-first flatten of the partition tree under `parentOid`. */
export function buildPartitions(parentOid: number, rows: PartitionRow[], depth = 0): Partition[] {
  return rows
    .filter((r) => r.parent_oid === parentOid)
    .flatMap((r) => [
      { schema: r.schema, name: r.name, bound: r.bound, depth, partitionKey: r.partition_key },
      ...buildPartitions(r.oid, rows, depth + 1),
    ])
}

export function buildTable(
  t: TableRow,
  partitions: PartitionRow[],
  columns: any[],
  constraints: any[],
  indexes: any[],
): Table {
  const own = <R extends { table_oid: number }>(list: R[]) =>
    list.filter((r) => r.table_oid === t.oid)
  const primaryKey = new Set(
    own(constraints)
      .filter((c) => c.type === 'p')
      .flatMap((c) => c.columns),
  )
  return {
    kind: KIND_BY_RELKIND[t.relkind],
    schema: t.schema,
    name: t.name,
    comment: t.comment,
    columns: own(columns).map((c) => toColumn(c, primaryKey)),
    indexes: own(indexes).map(toIndex),
    foreignKeys: own(constraints)
      .filter((c) => c.type === 'f')
      .map(toForeignKey),
    partitionKey: t.partition_key,
    partitions: buildPartitions(t.oid, partitions),
    definition: t.definition,
  }
}

const toColumn = (c: any, primaryKey: Set<string>): Column => ({
  name: c.name,
  attnum: c.attnum,
  type: c.type,
  typeName: c.type_name,
  typeCategory: c.type_category,
  notNull: c.not_null,
  default: c.default,
  generated: c.generated,
  identity: c.identity,
  isPrimaryKey: primaryKey.has(c.name),
  comment: c.comment,
})

const toIndex = (i: any): Index => ({
  name: i.name,
  method: i.method,
  kind: classifyIndex({
    method: i.method,
    opclasses: i.opclasses,
    keyTypes: i.key_types,
    definition: i.definition,
  }),
  unique: i.unique,
  columns: i.columns,
  definition: i.definition,
  comment: i.comment,
})

const toForeignKey = (c: any): ForeignKey => ({
  name: c.name,
  columns: c.columns,
  refSchema: c.ref_schema,
  refTable: c.ref_table,
  refColumns: c.ref_columns,
  onUpdate: c.on_update,
  onDelete: c.on_delete,
})
