export interface DdlError {
  message: string
  line: number | null
}

/** Pure display: the Postgres error for the current DDL, if any. */
export function ErrorBanner({ error }: { error: DdlError | null }) {
  if (!error) return null
  return (
    <div className="error-banner" role="alert">
      {error.line !== null && <strong>Line {error.line}: </strong>}
      {error.message}
    </div>
  )
}
