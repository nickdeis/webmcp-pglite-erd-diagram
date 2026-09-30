import type { ModelContext, ModelContextRegisterToolOptions } from '@mcp-b/webmcp-types'
import type { AnyTool } from './tools'

export interface WebMcpEnv {
  /** Native `document.modelContext` (or the deprecated `navigator.modelContext`), if present. */
  getContext: () => ModelContext | undefined
  /** Installs the polyfill; only called when there is no native implementation. */
  installPolyfill: () => Promise<void>
}

/**
 * Chrome-side agents (e.g. Ask Gemini) look at `navigator.modelContext`, which can be a read-only getter on
 * the prototype, so a plain assignment is ignored: define an own property on the instance to shadow it.
 */
export function mirrorModelContext(host: object, context: ModelContext): void {
  if ((host as { modelContext?: ModelContext }).modelContext === context) return
  Object.defineProperty(host, 'modelContext', {
    value: context,
    configurable: true,
    writable: true,
  })
}

export const browserEnv: WebMcpEnv = {
  getContext: () => {
    const context = document.modelContext ?? navigator.modelContext
    if (context) mirrorModelContext(navigator, context)
    return context
  },
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
