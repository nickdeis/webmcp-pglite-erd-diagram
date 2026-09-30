import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { AgentBridgeBanner } from './AgentBridgeBanner'
import { ToolbarButton } from './ToolbarButton'
import { LuPlugZap } from 'react-icons/lu'

describe('AgentBridgeBanner', () => {
  const html = renderToStaticMarkup(<AgentBridgeBanner onTurnOff={() => {}} />)

  it('explains how to start the relay and connect an agent', () => {
    expect(html).toContain('npx @mcp-b/webmcp-local-relay')
    expect(html).toContain('claude mcp add webmcp-local-relay')
    expect(html).toContain('127.0.0.1:9333')
  })

  it('warns that connected agents can rewrite the DDL and offers to turn off', () => {
    expect(html).toContain('read and rewrite the DDL')
    expect(html).toContain('Turn off')
  })
})

describe('ToolbarButton', () => {
  it('exposes the pressed state of a toggle', () => {
    const on = renderToStaticMarkup(
      <ToolbarButton icon={LuPlugZap} label="X" pressed onClick={() => {}} />,
    )
    const off = renderToStaticMarkup(
      <ToolbarButton icon={LuPlugZap} label="X" pressed={false} onClick={() => {}} />,
    )
    expect(on).toContain('aria-pressed="true"')
    expect(on).toContain('class="pressed"')
    expect(off).toContain('aria-pressed="false"')
    expect(off).not.toContain('pressed"')
  })
})
