import type { TableNode } from '../diagram/model'
import type { ViewerPayload } from '../viewer/payload'
import viewerTemplate from 'virtual:viewer-template'

const DATA_PLACEHOLDER = '"__DIAGRAM_DATA__"'

export function payloadFromNodes(nodes: TableNode[]): ViewerPayload {
  return {
    schema: { tables: nodes.map((n) => n.data.table) },
    positions: Object.fromEntries(nodes.map((n) => [n.id, n.position])),
  }
}

/** JSON safe to embed in a script tag: `<` is escaped so `</script>` can never appear. */
const embeddableJson = (payload: ViewerPayload) => JSON.stringify(payload).replace(/</g, '\\u003c')

export function injectPayload(template: string, payload: ViewerPayload): string {
  if (!template.includes(DATA_PLACEHOLDER)) {
    throw new Error('Viewer template missing or stale; run `bun run build:viewer`.')
  }
  return template.replace(DATA_PLACEHOLDER, () => embeddableJson(payload))
}

export const buildStandaloneHtml = (nodes: TableNode[]): string =>
  injectPayload(viewerTemplate, payloadFromNodes(nodes))
