import type { IconType } from 'react-icons'

interface Props {
  icon: IconType
  label: string
  title?: string
  onClick: () => void
}

/** Pure display: a toolbar action button. */
export function ToolbarButton({ icon: Icon, label, title, onClick }: Props) {
  return (
    <button onClick={onClick} title={title ?? label}>
      <Icon size={14} /> {label}
    </button>
  )
}
