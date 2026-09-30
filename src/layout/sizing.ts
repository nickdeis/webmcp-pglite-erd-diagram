import type { Table } from '../db/types'

/** Pixel metrics shared by layout (sizing) and rendering (TableNode styles). */
export const METRICS = {
  charWidth: 7.3,
  headerHeight: 34,
  tableCommentHeight: 16,
  rowHeight: 26,
  commentHeight: 15,
  sectionHeight: 22,
  indexRowHeight: 24,
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

export function tableSize(table: Table): Size {
  const m = METRICS
  const rowWidths = table.columns.map((c) => chars(c.name.length + c.type.length) + m.rowChrome)
  const indexWidths = table.indexes.map(
    (i) => chars(i.name.length + i.columns.join(', ').length + 4) + 60,
  )
  const commentWidths = [table.comment, ...table.columns.map((c) => c.comment)].map(
    (c) => chars(c?.length ?? 0) + 40,
  )
  const width = Math.max(
    m.minWidth,
    ...rowWidths,
    ...indexWidths.map((w) => Math.min(w, m.maxWidth)),
    ...commentWidths.map((w) => Math.min(w, m.maxWidth)),
  )
  return { width: Math.ceil(Math.min(width, m.maxWidth)), height: tableHeight(table) }
}

function tableHeight(table: Table): number {
  const m = METRICS
  const header = m.headerHeight + (table.comment ? m.tableCommentHeight : 0)
  const columns = table.columns.reduce((h, c) => h + columnRowHeight(c.comment), 0)
  const indexes = table.indexes.reduce((h, i) => h + indexRowHeight(i.comment), 0)
  return header + columns + (table.indexes.length ? m.sectionHeight + indexes : 0)
}
