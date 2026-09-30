import type { Options } from 'prettier'
import { format } from 'prettier/standalone'
import sqlPlugin from 'prettier-plugin-sql'

interface SqlFormatOptions extends Options {
  language: 'postgresql'
  keywordCase: 'lower'
}

const OPTIONS: SqlFormatOptions = {
  parser: 'sql',
  plugins: [sqlPlugin],
  language: 'postgresql',
  keywordCase: 'lower',
}

export const formatSql = (ddl: string): Promise<string> => format(ddl, OPTIONS)
