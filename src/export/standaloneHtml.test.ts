import { describe, expect, it } from 'vitest'
import { makeSchema, makeTable } from '../db/builders'
import type { ViewerPayload } from '../viewer/payload'
import { injectPayload } from './standaloneHtml'

const PAYLOAD: ViewerPayload = {
  schema: makeSchema([makeTable({ name: '</script><b>', comment: 'a <tag> & "quotes"' })]),
  positions: { 'public.</script><b>': { x: 1, y: 2 } },
}

const TEMPLATE = '<script id="diagram-data" type="application/json">"__DIAGRAM_DATA__"</script>'

describe('injectPayload', () => {
  it('embeds JSON that round-trips through the script tag', () => {
    const html = injectPayload(TEMPLATE, PAYLOAD)
    const json = html.slice(html.indexOf('>') + 1, html.lastIndexOf('</script>'))
    expect(JSON.parse(json)).toEqual(PAYLOAD)
  })

  it('never lets user text close the script tag', () => {
    const html = injectPayload(TEMPLATE, PAYLOAD)
    expect(html.match(/<\/script>/g)).toHaveLength(1)
  })

  it('does not interpret $ patterns in user text', () => {
    const payload = {
      ...PAYLOAD,
      schema: makeSchema([{ ...PAYLOAD.schema.tables[0]!, comment: "$& $1 $'" }]),
    }
    expect(injectPayload(TEMPLATE, payload)).toContain("$& $1 $'")
  })

  it('fails loudly when the template is missing', () => {
    expect(() => injectPayload('', PAYLOAD)).toThrow(/build:viewer/)
  })
})
