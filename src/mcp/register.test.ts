import type { ModelContext } from '@mcp-b/webmcp-types'
import { describe, expect, it, vi } from 'vitest'
import { registerWebMcpTools, type WebMcpEnv } from './register'
import type { AnyTool } from './tools'

const TOOLS: AnyTool[] = [
  { name: 'a', description: 'a', execute: async () => 'a' },
  { name: 'b', description: 'b', inputSchema: { type: 'object' }, execute: async () => 'b' },
]

function fakeContext() {
  const registered: { name: string; signal?: AbortSignal }[] = []
  const context = {
    registerTool: async (tool: { name: string }, options?: { signal?: AbortSignal }) => {
      registered.push({ name: tool.name, signal: options?.signal })
    },
  } as unknown as ModelContext
  return { context, registered }
}

describe('registerWebMcpTools', () => {
  it('uses a native implementation without loading the polyfill', async () => {
    const { context, registered } = fakeContext()
    const installPolyfill = vi.fn(async () => {})
    const controller = new AbortController()
    await registerWebMcpTools(TOOLS, controller.signal, {
      getContext: () => context,
      installPolyfill,
    })
    expect(installPolyfill).not.toHaveBeenCalled()
    expect(registered.map((r) => r.name)).toEqual(['a', 'b'])
    expect(registered.every((r) => r.signal === controller.signal)).toBe(true)
  })

  it('loads the polyfill when there is no native implementation', async () => {
    const { context, registered } = fakeContext()
    let installed = false
    const env: WebMcpEnv = {
      getContext: () => (installed ? context : undefined),
      installPolyfill: async () => void (installed = true),
    }
    await registerWebMcpTools(TOOLS, new AbortController().signal, env)
    expect(registered).toHaveLength(2)
  })

  it('registers nothing if aborted while the polyfill was loading', async () => {
    const { context, registered } = fakeContext()
    const controller = new AbortController()
    let installed = false
    const env: WebMcpEnv = {
      getContext: () => (installed ? context : undefined),
      installPolyfill: async () => {
        installed = true
        controller.abort()
      },
    }
    await registerWebMcpTools(TOOLS, controller.signal, env)
    expect(registered).toEqual([])
  })

  it('rejects when WebMCP cannot be provided', async () => {
    const env: WebMcpEnv = { getContext: () => undefined, installPolyfill: async () => {} }
    await expect(registerWebMcpTools(TOOLS, new AbortController().signal, env)).rejects.toThrow(
      /unavailable/,
    )
  })
})
