import type { IconType } from 'react-icons'

interface Props {
  icon: IconType
  schema: string
  name: string
  /** Small caption on the right (e.g. VIEW, RANGE (created_at)). */
  label: string
  /** Full text for the tooltip, such as a view's defining query. */
  title?: string
}

/** Pure display: node title bar in the node's colour (`--node-color`, set on the node). */
export function RelationHeader({ icon: Icon, schema, name, label, title }: Props) {
  return (
    <div className="table-header" title={title}>
      <Icon size={14} />
      <span className="table-name">
        {schema !== 'public' && <span className="table-schema">{schema}.</span>}
        {name}
      </span>
      {label && <span className="relation-label">{label}</span>}
    </div>
  )
}
