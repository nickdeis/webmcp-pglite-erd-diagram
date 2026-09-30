import { describe, expect, it } from 'vitest'
import { makeColumn, makeFunction, makeTable } from '../db/builders'
import type { Partition } from '../db/types'
import { functionSize, METRICS, tableSize } from './sizing'

const partition = (n: number): Partition => ({
  schema: 'public',
  name: `p${n}`,
  bound: 'DEFAULT',
  depth: 0,
  partitionKey: null,
})
const partitions = (count: number) => Array.from({ length: count }, (_, i) => partition(i))

describe('tableSize with partitions', () => {
  const base = tableSize(makeTable({ columns: [makeColumn('id')] })).height
  const withPartitions = (count: number) =>
    tableSize(makeTable({ columns: [makeColumn('id')], partitions: partitions(count) })).height

  it('adds a section plus one row per partition', () => {
    const { sectionHeight, partitionRowHeight } = METRICS
    expect(withPartitions(3)).toBe(base + sectionHeight + 3 * partitionRowHeight)
  })

  it('collapses partitions beyond the cap into a single "+N more" row', () => {
    const { maxPartitionRows } = METRICS
    expect(withPartitions(maxPartitionRows + 20)).toBe(
      withPartitions(maxPartitionRows) + METRICS.partitionRowHeight,
    )
  })
})

describe('functionSize', () => {
  const arg = (name: string) => ({
    name,
    type: 'integer',
    typeName: 'int4',
    typeCategory: 'N',
    mode: 'in' as const,
  })
  const ret = (name: string) => ({ name, type: 'text', typeName: 'text', typeCategory: 'S' })

  it('is header plus a returns section when there are no arguments', () => {
    const { headerHeight, sectionHeight, paramRowHeight } = METRICS
    expect(functionSize(makeFunction({ returns: [ret('a')] })).height).toBe(
      headerHeight + sectionHeight + paramRowHeight,
    )
  })

  it('grows with arguments, returned columns and a comment', () => {
    const small = functionSize(makeFunction({ returns: [ret('a')] })).height
    const withArgs = functionSize(
      makeFunction({ args: [arg('x'), arg('y')], returns: [ret('a')] }),
    ).height
    expect(withArgs).toBe(small + METRICS.sectionHeight + 2 * METRICS.paramRowHeight)
    expect(functionSize(makeFunction({ returns: [ret('a')], comment: 'hi' })).height).toBe(
      small + METRICS.tableCommentHeight,
    )
  })

  it('widens for long parameter types but stays within bounds', () => {
    const wide = functionSize(makeFunction({ returns: [ret('x'.repeat(200))] }))
    expect(wide.width).toBe(METRICS.maxWidth)
    expect(functionSize(makeFunction({ returns: [ret('a')] })).width).toBe(METRICS.minWidth)
  })
})
