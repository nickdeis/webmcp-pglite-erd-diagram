import { describe, expect, it } from 'vitest'
import type { Index, IndexKind } from '../db/types'
import { INDEX_STYLES } from '../theme/indexStyle'
import { indexColors } from './indexColors'

const index = (name: string, columns: string[], kind: IndexKind = 'btree'): Index => ({
  name,
  kind,
  method: kind,
  unique: false,
  columns,
  definition: '',
  comment: null,
})
const kindColor = (kind: IndexKind) => INDEX_STYLES[kind].color

describe('indexColors', () => {
  it('uses the kind colour for single-column indexes and for a lone multi-column group', () => {
    const colors = indexColors([
      index('a', ['x']),
      index('b', ['x', 'y'], 'gin'),
      index('c', ['z']),
    ])
    expect(colors.get('a')).toBe(kindColor('btree'))
    expect(colors.get('b')).toBe(kindColor('gin'))
    expect(colors.get('c')).toBe(kindColor('btree'))
  })

  it('gives each extra multi-column group of the same kind its own unused colour', () => {
    const colors = indexColors([
      index('g1', ['a', 'b']),
      index('g2', ['b', 'c']),
      index('g3', ['c', 'd']),
    ])
    const [c1, c2, c3] = ['g1', 'g2', 'g3'].map((n) => colors.get(n))
    expect(c1).toBe(kindColor('btree'))
    expect(new Set([c1, c2, c3]).size).toBe(3)
  })

  it('never reuses a colour that another index kind on the table already shows', () => {
    const colors = indexColors([
      index('hash_idx', ['a'], 'hash'),
      index('gin_idx', ['a'], 'gin'),
      index('g1', ['a', 'b']),
      index('g2', ['b', 'c']),
    ])
    const taken = [kindColor('hash'), kindColor('gin'), kindColor('btree')]
    expect(taken).not.toContain(colors.get('g2'))
  })

  it('is stable: the same indexes always get the same colours', () => {
    const indexes = [index('g1', ['a', 'b']), index('g2', ['b', 'c'])]
    expect([...indexColors(indexes)]).toEqual([...indexColors(indexes)])
  })

  it('does not treat two single-column indexes of one kind as groups', () => {
    const colors = indexColors([index('a', ['x']), index('b', ['y'])])
    expect(colors.get('b')).toBe(kindColor('btree'))
  })
})
