import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LuEye } from 'react-icons/lu'
import type { Partition } from '../db/types'
import { PartitionList } from './PartitionList'
import { RelationHeader } from './RelationHeader'

describe('RelationHeader', () => {
  it('shows the name, a caption and hides the public schema', () => {
    const html = renderToStaticMarkup(
      <RelationHeader icon={LuEye} schema="public" name="v" label="VIEW" />,
    )
    expect(html).toContain('>v<')
    expect(html).toContain('VIEW')
    expect(html).not.toContain('public.')
  })

  it('prefixes other schemas and exposes the tooltip', () => {
    const html = renderToStaticMarkup(
      <RelationHeader icon={LuEye} schema="app" name="v" label="" title="select 1" />,
    )
    expect(html).toContain('app.')
    expect(html).toContain('title="select 1"')
    expect(html).not.toContain('relation-label')
  })
})

describe('PartitionList', () => {
  const p = (name: string, over: Partial<Partition> = {}): Partition => ({
    schema: 'public',
    name,
    bound: "FOR VALUES IN ('eu')",
    depth: 0,
    partitionKey: null,
    ...over,
  })

  it('lists partitions with compact bounds and indents sub-partitions', () => {
    const html = renderToStaticMarkup(
      <PartitionList
        partitions={[p('a'), p('b', { depth: 1 }), p('c', { partitionKey: 'LIST (x)' })]}
        hiddenCount={0}
      />,
    )
    expect(html).toContain('IN (&#x27;eu&#x27;)')
    expect(html).toContain('padding-left:26px')
    expect(html).toContain('LIST (x)')
    expect(html).not.toContain('more')
  })

  it('summarises hidden partitions', () => {
    expect(renderToStaticMarkup(<PartitionList partitions={[p('a')]} hiddenCount={5} />)).toContain(
      '+ 5 more',
    )
  })
})
