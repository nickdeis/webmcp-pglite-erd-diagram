import type { IconType } from 'react-icons'

interface Props {
  icon: IconType
  label: string
  title?: string
  onClick: () => void
  /** For toggles: shows the pressed state. */
  pressed?: boolean
}

/** Pure display: a toolbar action button. */
export function ToolbarButton({ icon: Icon, label, title, onClick, pressed }: Props) {
  return (
    <button
      onClick={onClick}
      title={title ?? label}
      aria-pressed={pressed}
      className={pressed ? 'pressed' : undefined}
    >
      <Icon size={14} /> {label}
    </button>
  )
}
