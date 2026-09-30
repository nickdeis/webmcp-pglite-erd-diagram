import type { Table, TableFunction } from '../db/types'
import { FUNCTION_STYLE, RELATION_STYLES } from '../theme/relationStyle'
import { formatBound } from './partitionBound'

/** Pixel metrics shared by layout (sizing) and rendering (node styles). */
export const METRICS = {
  charWidth: 7.3,
  headerHeight: 34,
  tableCommentHeight: 16,
  rowHeight: 26,
  commentHeight: 15,
  sectionHeight: 22,
  indexRowHeight: 24,
  partitionRowHeight: 22,
  paramRowHeight: 24,
  /** More partitions than this collapse into a "+N more" row. */
  maxPartitionRows: 8,
  minWidth: 220,
  maxWidth: 480,
  /** Icons, key/fk marks, badges and padding around a column row's text. */
  rowChrome: 120,
}

export const columnRowHeight = (comment: string | null) =>
  METRICS.rowHeight + (comment ? METRICS.commentHeight : 0)

export const indexRowHeight = (comment: string | null) =>
  METRICS.indexRowHeight + (comment ? METRICS.commentHeight : 0)

export interface Size {
  width: number
  height: number
}

const chars = (n: number) => n * METRICS.charWidth

/** Longest wanted width, clamped to the node's min/max. */
const clampWidth = (...wanted: number[]) =>
  Math.ceil(Math.min(Math.max(METRICS.minWidth, ...wanted), METRICS.maxWidth))

export const visiblePartitions = (table: Table) =>
  table.partitions.slice(0, METRICS.maxPartitionRows)
export const hiddenPartitionCount = (table: Table) =>
  Math.max(0, table.partitions.length - METRICS.maxPartitionRows)

/** Header caption: partitioned tables show their key, views their kind. */
export const relationLabel = (table: Table): string =>
  table.partitionKey ?? RELATION_STYLES[table.kind].label

export function tableSize(table: Table): Size {
  const m = METRICS
  const header = chars(table.name.length + relationLabel(table).length) + 90
  const rows = table.columns.map((c) => chars(c.name.length + c.type.length) + m.rowChrome)
  const indexes = table.indexes.map(
    (i) => chars(i.name.length + i.columns.join(', ').length + 4) + 60,
  )
  const partitions = visiblePartitions(table).map(
    (p) => chars(p.name.length + formatBound(p.bound).length) + 70,
  )
  const comments = [table.comment, ...table.columns.map((c) => c.comment)].map(
    (c) => chars(c?.length ?? 0) + 40,
  )
  return {
    width: clampWidth(header, ...rows, ...indexes, ...partitions, ...comments),
    height: tableHeight(table),
  }
}

function tableHeight(table: Table): number {
  const m = METRICS
  const header = m.headerHeight + (table.comment ? m.tableCommentHeight : 0)
  const columns = table.columns.reduce((h, c) => h + columnRowHeight(c.comment), 0)
  const indexes = table.indexes.reduce((h, i) => h + indexRowHeight(i.comment), 0)
  const partitionRows = visiblePartitions(table).length + (hiddenPartitionCount(table) > 0 ? 1 : 0)
  const partitions = partitionRows > 0 ? m.sectionHeight + partitionRows * m.partitionRowHeight : 0
  return header + columns + partitions + (table.indexes.length ? m.sectionHeight + indexes : 0)
}

export function functionSize(fn: TableFunction): Size {
  const m = METRICS
  const header = chars(fn.name.length + FUNCTION_STYLE.label.length) + 90
  const params = [...fn.args, ...fn.returns].map((p) => chars(p.name.length + p.type.length) + 80)
  const comment = chars(fn.comment?.length ?? 0) + 40
  const argsHeight = fn.args.length > 0 ? m.sectionHeight + fn.args.length * m.paramRowHeight : 0
  const returnsHeight = m.sectionHeight + fn.returns.length * m.paramRowHeight
  const commentHeight = fn.comment ? m.tableCommentHeight : 0
  return {
    width: clampWidth(header, comment, ...params),
    height: m.headerHeight + commentHeight + argsHeight + returnsHeight,
  }
}
