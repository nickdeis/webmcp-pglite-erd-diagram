import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { RestoreBanner } from './RestoreBanner'

const noop = () => {}

describe('RestoreBanner', () => {
  it('renders nothing when there is no previous DDL', () => {
    expect(
      renderToStaticMarkup(<RestoreBanner previousDdl={null} onRestore={noop} onDismiss={noop} />),
    ).toBe('')
  })

  it('offers to restore and dismiss after an AI edit', () => {
    const html = renderToStaticMarkup(
      <RestoreBanner previousDdl="old" onRestore={noop} onDismiss={noop} />,
    )
    expect(html).toContain('Updated by AI')
    expect(html).toContain('Restore previous')
    expect(html).toContain('aria-label="Dismiss"')
  })

  it('still shows for an empty previous DDL (agent overwrote a blank editor)', () => {
    const html = renderToStaticMarkup(
      <RestoreBanner previousDdl="" onRestore={noop} onDismiss={noop} />,
    )
    expect(html).toContain('Restore previous')
  })
})
