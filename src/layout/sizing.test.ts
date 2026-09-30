import { describe, expect, it } from 'vitest'
import { makeColumn, makeTable } from '../db/builders'
import type { Partition } from '../db/types'
import { METRICS, tableSize } from './sizing'

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
