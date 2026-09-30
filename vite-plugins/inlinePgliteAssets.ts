import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import type { Plugin } from 'vite'

const BIG_ASSETS = ['pglite.wasm', 'initdb.wasm', 'pglite.data']
const MODULE_ID = 'virtual:pglite-assets'
const RESOLVED_ID = `\0${MODULE_ID}`

/** `new URL('./x.wasm', import.meta.url)`, also the emscripten glue's `new URL("x.wasm", ""+import.meta.url)`. */
const ASSET_URL =
  /new URL\((["'])(?:\.\/)?(pglite\.wasm|initdb\.wasm|pglite\.data)\1,\s*(?:(["'])\3\+)?import\.meta\.url\)/g

const pgliteDist = () => dirname(createRequire(import.meta.url).resolve('@electric-sql/pglite'))

/**
 * PGlite references each big asset several times, and Vite inlines every reference separately
 * (the 10 MB wasm ended up in the single file three times). Route every reference through one
 * shared module so each asset is inlined exactly once.
 */
export function inlinePgliteAssets(): Plugin {
  return {
    name: 'inline-pglite-assets',
    enforce: 'pre',
    apply: 'build',
    resolveId: (source) => (source === MODULE_ID ? RESOLVED_ID : undefined),
    load(id) {
      if (id !== RESOLVED_ID) return
      const imports = BIG_ASSETS.map(
        (f, i) => `import a${i} from ${JSON.stringify(join(pgliteDist(), `${f}?url`))};`,
      )
      return `${imports.join('\n')}\nexport default { ${BIG_ASSETS.map((f, i) => `${JSON.stringify(f)}: a${i}`)} }`
    },
    transform(code, id) {
      if (!id.includes('/node_modules/@electric-sql/pglite/') || !code.match(ASSET_URL)) return
      const body = code.replace(
        ASSET_URL,
        (_, __, file: string) => `new URL(__pgliteAssets[${JSON.stringify(file)}])`,
      )
      return {
        code: `import __pgliteAssets from ${JSON.stringify(MODULE_ID)};\n${body}`,
        map: null,
      }
    },
  }
}
