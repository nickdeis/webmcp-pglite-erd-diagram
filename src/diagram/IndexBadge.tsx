import type { Index } from '../db/types'
import { INDEX_STYLES } from '../theme/indexStyle'

interface Props {
  index: Index
  /** Overrides the kind's colour, e.g. to tell two multi-column groups apart. */
  color?: string
}

export function IndexBadge({ index, color: colorOverride }: Props) {
  const { icon: Icon, color: kindColor, label } = INDEX_STYLES[index.kind]
  const color = colorOverride ?? kindColor
  const group = index.columns.length > 1 ? ` (${index.columns.join(', ')})` : ''
  return (
    <span
      className="index-badge"
      style={{ color, borderColor: color }}
      title={`${label}${index.unique ? ' unique' : ''}: ${index.name}${group}`}
    >
      <Icon size={12} />
    </span>
  )
}
