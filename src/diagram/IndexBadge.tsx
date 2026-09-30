import type { Index } from '../db/types'
import { INDEX_STYLES } from '../theme/indexStyle'

export function IndexBadge({ index }: { index: Index }) {
  const { icon: Icon, color, label } = INDEX_STYLES[index.kind]
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
