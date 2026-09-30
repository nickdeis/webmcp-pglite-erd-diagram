import { describe, expect, it, vi } from 'vitest'
import { enableRelay, relayEmbedUrl, RELAY_PORT } from './relay'

function fakeDocument(baseURI = 'http://localhost:5199/app/') {
  const script = {
    src: '',
    attrs: {} as Record<string, string>,
    remove: vi.fn(),
    setAttribute(k: string, v: string) {
      this.attrs[k] = v
    },
  }
  const widgets = [{ remove: vi.fn() }, { remove: vi.fn() }]
  const appended: unknown[] = []
  const doc = {
    baseURI,
    head: { appendChild: (el: unknown) => appended.push(el) },
    createElement: (tag: string) => (tag === 'script' ? script : undefined),
    querySelectorAll: (selector: string) => (selector === '[data-webmcp-relay]' ? widgets : []),
  } as unknown as Document
  return { doc, script, widgets, appended }
}

describe('relayEmbedUrl', () => {
  it('resolves next to the page so it works from any base path', () => {
    expect(relayEmbedUrl('http://localhost:5199/')).toBe('http://localhost:5199/relay/embed.js')
    expect(relayEmbedUrl('https://example.com/tools/erd/')).toBe(
      'https://example.com/tools/erd/relay/embed.js',
    )
  })
})

describe('enableRelay', () => {
  it('adds the local embed script with the relay port', () => {
    const { doc, script, appended } = fakeDocument()
    enableRelay(doc)
    expect(appended).toEqual([script])
    expect(script.src).toBe('http://localhost:5199/app/relay/embed.js')
    expect(script.attrs['data-relay-port']).toBe(String(RELAY_PORT))
  })

  it('accepts a custom port', () => {
    const { doc, script } = fakeDocument()
    enableRelay(doc, 9444)
    expect(script.attrs['data-relay-port']).toBe('9444')
  })

  it('disconnects by removing the script and the relay iframes', () => {
    const { doc, script, widgets } = fakeDocument()
    enableRelay(doc)()
    expect(script.remove).toHaveBeenCalledOnce()
    widgets.forEach((w) => expect(w.remove).toHaveBeenCalledOnce())
  })
})
