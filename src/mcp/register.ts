import type { ModelContext, ModelContextRegisterToolOptions } from '@mcp-b/webmcp-types'
import type { AnyTool } from './tools'

export interface WebMcpEnv {
  /** Native `document.modelContext` (or the deprecated `navigator.modelContext`), if present. */
  getContext: () => ModelContext | undefined
  /** Installs the polyfill; only called when there is no native implementation. */
  installPolyfill: () => Promise<void>
}

export const browserEnv: WebMcpEnv = {
  getContext: () => document.modelContext ?? navigator.modelContext,
  installPolyfill: async () => {
    const { initializeWebMCPPolyfill } = await import('@mcp-b/webmcp-polyfill')
    initializeWebMCPPolyfill()
  },
}

/**
 * Registers the tools on WebMCP, loading the polyfill on demand. Aborting `signal` unregisters them,
 * and also cancels a registration that has not finished loading yet.
 */
export async function registerWebMcpTools(
  tools: AnyTool[],
  signal: AbortSignal,
  env: WebMcpEnv = browserEnv,
): Promise<void> {
  if (!env.getContext()) await env.installPolyfill()
  const context = env.getContext()
  if (!context) throw new Error('WebMCP is unavailable in this browser.')
  if (signal.aborted) return
  await Promise.all(tools.map((tool) => registerOne(context, tool, { signal })))
}

/** `registerTool` is overloaded on whether the tool has an input schema, so branch to pick the overload. */
const registerOne = (
  context: ModelContext,
  tool: AnyTool,
  options: ModelContextRegisterToolOptions,
) => (tool.inputSchema ? context.registerTool(tool, options) : context.registerTool(tool, options))
