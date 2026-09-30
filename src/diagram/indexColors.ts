import type { Index, IndexKind } from '../db/types'
import { INDEX_STYLES } from '../theme/indexStyle'

/** Extra neon colours for a second (third, ...) multi-column group of the same kind on one table. */
const VARIANT_COLORS = [
  'var(--neon-orange)',
  'var(--neon-yellow)',
  'var(--neon-teal)',
  'var(--neon-pink)',
  'var(--neon-violet)',
  'var(--neon-green)',
  'var(--neon-blue)',
  'var(--neon-red)',
  'var(--neon-cyan)',
]

/**
 * Colour per index name. Indexes use their kind's colour, but when several multi-column indexes of the
 * same kind exist on a table each extra one takes a colour no other index on the table uses, so their
 * column groups can be told apart. The kind stays readable from the icon.
 */
export function indexColors(indexes: Index[]): Map<string, string> {
  const inUse = new Set(indexes.map((i) => INDEX_STYLES[i.kind].color))
  const groupsSeen = new Map<IndexKind, number>()
  const colors = new Map<string, string>()
  for (const index of indexes) {
    const base = INDEX_STYLES[index.kind].color
    const seen = groupsSeen.get(index.kind) ?? 0
    if (index.columns.length > 1) groupsSeen.set(index.kind, seen + 1)
    const isExtraGroup = index.columns.length > 1 && seen > 0
    if (!isExtraGroup) {
      colors.set(index.name, base)
      continue
    }
    const variant =
      VARIANT_COLORS.find((c) => !inUse.has(c)) ?? VARIANT_COLORS[seen % VARIANT_COLORS.length]!
    inUse.add(variant)
    colors.set(index.name, variant)
  }
  return colors
}
