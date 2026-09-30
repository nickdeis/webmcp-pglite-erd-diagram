import { describe, expect, it, vi } from 'vitest'
import { relayAssets, RELAY_FILES } from './relayAssets'

interface EmittedAsset {
  type: 'asset'
  fileName: string
  source: Buffer
}

/** Runs the plugin's `generateBundle` hook against a fake Rollup context and returns what it emitted. */
function emittedAssets(): EmittedAsset[] {
  const emitFile = vi.fn()
  const hook = relayAssets().generateBundle as unknown as (this: {
    emitFile: typeof emitFile
  }) => void
  hook.call({ emitFile })
  return emitFile.mock.calls.map(([file]) => file as EmittedAsset)
}

describe('relayAssets', () => {
  it('emits every relay file under relay/ with real content', () => {
    const assets = emittedAssets()
    const expected = Object.keys(RELAY_FILES).map((f) => `relay/${f}`)
    expect(assets.map((a) => a.fileName).sort()).toEqual(expected.sort())
    for (const asset of assets) {
      expect(asset.type).toBe('asset')
      expect(asset.source.length).toBeGreaterThan(1000)
    }
  })

  it('embed.js finds its widget next to itself and defaults to the local relay port', () => {
    const embed = emittedAssets().find((a) => a.fileName === 'relay/embed.js')!
    const text = embed.source.toString()
    expect(text).toContain('widget.html')
    expect(text).toContain('127.0.0.1')
    expect(text).toContain('9333')
  })
})
