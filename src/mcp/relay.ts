/** Where `@mcp-b/webmcp-local-relay` listens by default. */
export const RELAY_HOST = '127.0.0.1'
export const RELAY_PORT = 9333

/** Attribute the embed puts on its hidden iframe; removing that iframe closes the relay connection. */
const WIDGET_SELECTOR = '[data-webmcp-relay]'
const EMBED_PATH = 'relay/embed.js'

export const relayEmbedUrl = (baseUri: string): string => new URL(EMBED_PATH, baseUri).href

/**
 * Loads the relay embed, which relays this page's `document.modelContext` tools to a local
 * `webmcp-local-relay` process (and from there to Claude Desktop, Cursor, Claude Code).
 * Returns a function that disconnects.
 *
 * The embed leaves a 2 s tool-polling timer behind after it is removed; that is harmless and only
 * accumulates if the user flips the bridge on and off repeatedly.
 */
export function enableRelay(doc: Document, port: number = RELAY_PORT): () => void {
  const script = doc.createElement('script')
  script.src = relayEmbedUrl(doc.baseURI)
  script.setAttribute('data-relay-port', String(port))
  doc.head.appendChild(script)
  return () => {
    script.remove()
    doc.querySelectorAll(WIDGET_SELECTOR).forEach((widget) => widget.remove())
  }
}

/** Commands shown to the user for connecting their agent to the local relay. */
export const RELAY_COMMANDS = {
  start: 'npx @mcp-b/webmcp-local-relay',
  claudeCode: 'claude mcp add webmcp-local-relay -- npx -y @mcp-b/webmcp-local-relay@latest',
} as const
