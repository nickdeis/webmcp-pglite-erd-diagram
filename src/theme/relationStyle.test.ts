import { describe, expect, it } from 'vitest'
import { FUNCTION_STYLE, RELATION_STYLES } from './relationStyle'

describe('relation styles', () => {
  const all = [...Object.values(RELATION_STYLES), FUNCTION_STYLE]

  it('gives every kind its own colour and icon', () => {
    expect(new Set(all.map((s) => s.color)).size).toBe(all.length)
    expect(new Set(all.map((s) => s.icon)).size).toBe(all.length)
  })

  it('marks only plain views as dashed', () => {
    const dashed = Object.entries(RELATION_STYLES)
      .filter(([, s]) => s.dashed)
      .map(([k]) => k)
    expect(dashed).toEqual(['view'])
  })
})
