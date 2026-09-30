import { existsSync, readFileSync } from 'node:fs'
import type { Plugin } from 'vite'

const VIEWER_TEMPLATE = 'dist-viewer/viewer.html'
const MODULE_ID = 'virtual:viewer-template'

/** Exposes the prebuilt diagram-only viewer as a string (empty if it has not been built yet). */
export function viewerTemplate(): Plugin {
  return {
    name: 'viewer-template',
    resolveId: (source) => (source === MODULE_ID ? `\0${MODULE_ID}` : undefined),
    load(id) {
      if (id !== `\0${MODULE_ID}`) return
      const html = existsSync(VIEWER_TEMPLATE) ? readFileSync(VIEWER_TEMPLATE, 'utf8') : ''
      return `export default ${JSON.stringify(html)}`
    },
  }
}
