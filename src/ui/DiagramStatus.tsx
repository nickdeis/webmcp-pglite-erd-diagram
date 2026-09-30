interface Props {
  loading: boolean
  empty: boolean
}

/** Pure display: overlay text while Postgres boots or when the DDL defines no tables. */
export function DiagramStatus({ loading, empty }: Props) {
  if (!loading && !empty) return null
  return (
    <div className="diagram-status">
      {loading ? 'Starting Postgres…' : 'No tables yet — write some DDL on the left.'}
    </div>
  )
}
