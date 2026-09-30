export interface DdlError {
  message: string
  /** 1-based line in the DDL where Postgres reported the problem, when it says. */
  line: number | null
}

const lineAt = (ddl: string, position: unknown): number | null =>
  typeof position === 'string' || typeof position === 'number'
    ? ddl.slice(0, Number(position) - 1).split('\n').length
    : null

/** Turn whatever PGlite threw into a message plus the line it points at. */
export function toDdlError(ddl: string, e: unknown): DdlError {
  const err = e as { message?: string; position?: unknown }
  return { message: err.message ?? String(e), line: lineAt(ddl, err.position) }
}

export const formatDdlError = ({ line, message }: DdlError): string =>
  line === null ? message : `Line ${line}: ${message}`
