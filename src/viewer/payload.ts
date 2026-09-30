import type { Schema } from '../db/types'
import type { Point } from '../layout/keys'

/** Everything the standalone viewer needs: the schema and where each table sits. */
export interface ViewerPayload {
  schema: Schema
  positions: Record<string, Point>
}

export const readPayload = (json: string): ViewerPayload => JSON.parse(json)
