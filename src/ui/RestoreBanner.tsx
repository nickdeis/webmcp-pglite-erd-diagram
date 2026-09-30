interface Props {
  /** The DDL an agent just replaced; nothing is shown when null. */
  previousDdl: string | null
  onRestore: () => void
  onDismiss: () => void
}

/** Pure display: offers to undo a WebMCP `write_sql` that replaced the editor content. */
export function RestoreBanner({ previousDdl, onRestore, onDismiss }: Props) {
  if (previousDdl === null) return null
  return (
    <div className="restore-banner" role="status">
      <span>Updated by AI</span>
      <button onClick={onRestore}>Restore previous</button>
      <button onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  )
}
