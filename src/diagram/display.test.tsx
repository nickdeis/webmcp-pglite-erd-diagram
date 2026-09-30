import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LuEye } from 'react-icons/lu'
import { makeFunction } from '../db/builders'
import type { Partition } from '../db/types'
import { FunctionBody } from './FunctionBody'
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

describe('FunctionBody', () => {
  const typed = { type: 'text', typeName: 'text', typeCategory: 'S' }

  it('shows arguments (with non-default modes) and returned columns', () => {
    const fn = makeFunction({
      args: [
        { name: 'a', mode: 'in', ...typed },
        { name: 'b', mode: 'inout', ...typed },
      ],
      returns: [{ name: 'out1', ...typed }],
    })
    const html = renderToStaticMarkup(<FunctionBody fn={fn} />)
    expect(html).toContain('Arguments')
    expect(html).toContain('Returns rows')
    expect(html.match(/param-mode/g)).toHaveLength(1)
    expect(html).toContain('inout')
    expect(html).toContain('out1')
  })

  it('omits the arguments section for zero-argument functions and says "Returns" for non-set ones', () => {
    const html = renderToStaticMarkup(
      <FunctionBody fn={makeFunction({ returnsSet: false, returns: [{ name: 'x', ...typed }] })} />,
    )
    expect(html).not.toContain('Arguments')
    expect(html).toContain('>Returns<')
  })
})
