const MIDNIGHT_TIMESTAMP = /'(\d{4}-\d{2}-\d{2}) 00:00:00(?:[+-]\d{2}(?::\d{2})?)?'/g

/** Compact bound for display: `FROM ('2025-01-01') TO ('2026-01-01')`, `IN ('eu')`, `DEFAULT`. */
export const formatBound = (bound: string): string =>
  bound.replace(/^FOR VALUES /, '').replace(MIDNIGHT_TIMESTAMP, "'$1'")
