import type { Schema } from '../db/types'
import type { Point } from '../layout/keys'
import type { ViewerPayload } from '../viewer/payload'
import viewerTemplate from 'virtual:viewer-template'

const DATA_PLACEHOLDER = '"__DIAGRAM_DATA__"'

interface PositionedNode {
  id: string
  position: Point
}

/** The schema as drawn plus where each node sits now (including anything the user dragged). */
export function payloadFromSchema(schema: Schema, nodes: PositionedNode[]): ViewerPayload {
  return { schema, positions: Object.fromEntries(nodes.map((n) => [n.id, n.position])) }
}

/** JSON safe to embed in a script tag: `<` is escaped so `</script>` can never appear. */
const embeddableJson = (payload: ViewerPayload) => JSON.stringify(payload).replace(/</g, '\\u003c')

export function injectPayload(template: string, payload: ViewerPayload): string {
  if (!template.includes(DATA_PLACEHOLDER)) {
    throw new Error('Viewer template missing or stale; run `bun run build:viewer`.')
  }
  return template.replace(DATA_PLACEHOLDER, () => embeddableJson(payload))
}

export const buildStandaloneHtml = (schema: Schema, nodes: PositionedNode[]): string =>
  injectPayload(viewerTemplate, payloadFromSchema(schema, nodes))
