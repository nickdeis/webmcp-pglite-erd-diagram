import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Index } from '../db/types'
import { IndexBadge } from './IndexBadge'

const index = (overrides: Partial<Index>): Index => ({
  name: 'idx',
  kind: 'btree',
  method: 'btree',
  unique: false,
  columns: ['a'],
  definition: '',
  comment: null,
  ...overrides,
})

describe('IndexBadge', () => {
  it('colours the badge by index kind', () => {
    const html = renderToStaticMarkup(<IndexBadge index={index({ kind: 'fts' })} />)
    expect(html).toContain('var(--neon-cyan)')
  })

  it('names the index, uniqueness and column group in the tooltip', () => {
    const html = renderToStaticMarkup(
      <IndexBadge index={index({ unique: true, name: 'ab_idx', columns: ['a', 'b'] })} />,
    )
    expect(html).toContain('B-tree unique: ab_idx (a, b)')
  })
})
