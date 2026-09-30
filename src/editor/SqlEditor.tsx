import { PostgreSQL, sql, type SQLNamespace } from '@codemirror/lang-sql'
import { Prec } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import CodeMirror from '@uiw/react-codemirror'
import { editorTheme } from './theme'

interface Props {
  value: string
  onChange: (ddl: string) => void
  onFormat: () => void
  namespace: SQLNamespace
}

/** Pure display: DDL editor with Postgres highlighting and schema-aware autocomplete. */
export function SqlEditor({ value, onChange, onFormat, namespace }: Props) {
  const formatKey = keymap.of([{ key: 'Mod-Shift-f', run: () => (onFormat(), true) }])
  return (
    <CodeMirror
      className="sql-editor"
      value={value}
      height="100%"
      theme={editorTheme}
      extensions={[sql({ dialect: PostgreSQL, schema: namespace }), Prec.highest(formatKey)]}
      onChange={onChange}
    />
  )
}
