import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { makeColumn, makeSchema, makeTable } from '../db/builders'
import { completionNamespace } from './completion'
import { ErrorBanner } from './ErrorBanner'
import { formatSql } from './format'

describe('completionNamespace', () => {
  it('maps table and view names to column names', () => {
    const schema = makeSchema([
      makeTable({ name: 'users', columns: [makeColumn('id'), makeColumn('email')] }),
      makeTable({ kind: 'view', name: 'v', columns: [makeColumn('x')] }),
    ])
    expect(completionNamespace(schema)).toEqual({ users: ['id', 'email'], v: ['x'] })
  })

  it('is empty before the first successful run', () => {
    expect(completionNamespace(null)).toEqual({})
  })
})

describe('ErrorBanner', () => {
  it('renders nothing without an error', () => {
    expect(renderToStaticMarkup(<ErrorBanner error={null} />)).toBe('')
  })

  it('shows the line and message', () => {
    const html = renderToStaticMarkup(<ErrorBanner error={{ message: 'boom', line: 3 }} />)
    expect(html).toContain('Line 3: ')
    expect(html).toContain('boom')
  })
})

describe('formatSql', () => {
  it('lower-cases keywords and puts statements on their own lines', async () => {
    const out = await formatSql("CREATE TABLE t (id int);COMMENT ON TABLE t IS 'x';")
    expect(out).toBe("create table t (id int);\n\ncomment on table t is 'x';\n")
  })
})
