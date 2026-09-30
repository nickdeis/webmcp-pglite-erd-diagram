import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import type { Plugin } from 'vite'

/** Files of `@mcp-b/webmcp-local-relay`'s browser embed, served under `relay/` so the app never uses a CDN. */
export const RELAY_FILES = {
  'embed.js': 'text/javascript',
  'widget.js': 'text/javascript',
  'widget.html': 'text/html',
} as const

type RelayFile = keyof typeof RELAY_FILES

const isRelayFile = (name: string): name is RelayFile => name in RELAY_FILES

const readRelayFile = (name: RelayFile): Buffer => {
  const dist = dirname(createRequire(import.meta.url).resolve('@mcp-b/webmcp-local-relay'))
  return readFileSync(join(dist, 'browser', name))
}

/**
 * Ships the relay embed with the app: served by the dev server and copied into `dist/relay/`.
 * It stays inert until the user turns on the agent bridge (see src/mcp/relay.ts).
 */
export function relayAssets(): Plugin {
  return {
    name: 'relay-assets',
    configureServer(server) {
      server.middlewares.use('/relay', (req, res, next) => {
        const name = (req.url ?? '').split('?')[0]!.replace(/^\//, '')
        if (!isRelayFile(name)) return next()
        res.setHeader('Content-Type', RELAY_FILES[name])
        res.end(readRelayFile(name))
      })
    },
    generateBundle() {
      for (const name of Object.keys(RELAY_FILES) as RelayFile[]) {
        this.emitFile({ type: 'asset', fileName: `relay/${name}`, source: readRelayFile(name) })
      }
    },
  }
}
