import type { InputSchema, ModelContextTool } from '@mcp-b/webmcp-types'
import type { Schema } from '../db/types'

export interface ToolDeps {
  getDdl: () => string
  applyDdl: (ddl: string) => void
  format: (sql: string) => Promise<string>
  /** Runs DDL against an empty database and introspects it; rejects with a `Line N: message` Error. */
  run: (sql: string) => Promise<Schema>
}

interface SqlInput extends Record<string, unknown> {
  sql: string
}

/** Tool input types are erased so tools with different inputs can live in one list. */
type AnyArgs = any
export type SchemaTool = ModelContextTool<AnyArgs, unknown> & { inputSchema: InputSchema }
export type SchemalessTool = Omit<ModelContextTool<AnyArgs, unknown>, 'inputSchema'> & {
  inputSchema?: undefined
}
export type AnyTool = SchemaTool | SchemalessTool

const SCRIPT_RULES =
  'The editor holds the COMPLETE Postgres DDL script for the diagram, and it is always run against an empty ' +
  'database: an ALTER only works if the CREATE it modifies is in the same script. Extensions available: ' +
  'pg_trgm, btree_gin, btree_gist, vector. COMMENT ON statements appear in the diagram.'

const SQL_SCHEMA = {
  type: 'object',
  properties: { sql: { type: 'string', description: 'The complete DDL script.' } },
  required: ['sql'],
  additionalProperties: false,
} as const

const READ_ONLY = { readOnlyHint: true }

function sqlArg(input: unknown): string {
  const sql = (input as Partial<SqlInput> | null)?.sql
  if (typeof sql !== 'string') throw new TypeError('Expected an object like { "sql": "<DDL>" }.')
  return sql
}

const countLines = (text: string) => text.split('\n').length

async function formatOrExplain({ format }: ToolDeps, sql: string): Promise<string> {
  try {
    return await format(sql)
  } catch (e) {
    throw new Error(`Could not format SQL: ${e instanceof Error ? e.message : String(e)}`)
  }
}

export function createTools(deps: ToolDeps): AnyTool[] {
  return [
    {
      name: 'read_sql',
      description: `Returns the DDL currently in the editor (even if it is invalid). ${SCRIPT_RULES}`,
      annotations: READ_ONLY,
      execute: async () => deps.getDdl(),
    },
    {
      name: 'format_sql',
      description:
        'Formats Postgres SQL (lower-case keywords) and returns it. Does not change the editor.',
      inputSchema: SQL_SCHEMA,
      annotations: READ_ONLY,
      execute: async (input) => formatOrExplain(deps, sqlArg(input)),
    },
    {
      name: 'validate_sql',
      description:
        'Runs the DDL against a scratch Postgres (nothing is kept) and reports whether it is valid. ' +
        `On failure it throws with the Postgres message and line number. ${SCRIPT_RULES}`,
      inputSchema: SQL_SCHEMA,
      annotations: READ_ONLY,
      execute: async (input) => {
        await deps.run(sqlArg(input))
        return 'DDL is valid.'
      },
    },
    {
      name: 'write_sql',
      description:
        'REPLACES the editor content with the given DDL after validating and formatting it; the diagram updates. ' +
        `If formatting or validation fails it throws and changes nothing. ${SCRIPT_RULES}`,
      inputSchema: SQL_SCHEMA,
      execute: async (input) => {
        const sql = sqlArg(input)
        await deps.run(sql) // validate as submitted, so `Line N` points into the caller's own text
        const formatted = await formatOrExplain(deps, sql)
        deps.applyDdl(formatted)
        return `Wrote ${countLines(formatted)} lines to the editor.`
      },
    },
    {
      name: 'read_schema',
      description:
        'Returns the schema the current editor DDL produces: tables, views, materialized views (kind field), partitioned tables with ' +
        'their nested partitions and bounds, columns (type, ' +
        'nullability, default, comment), indexes (kind, columns), foreign keys, comments and view dependencies. ' +
        'Throws if the current DDL is invalid.',
      annotations: READ_ONLY,
      execute: async () => deps.run(deps.getDdl()),
    },
  ]
}
