import { useState } from 'react'
import { completionNamespace } from './editor/completion'
import { ErrorBanner } from './editor/ErrorBanner'
import { formatSql } from './editor/format'
import { SqlEditor } from './editor/SqlEditor'
import { SAMPLE_DDL } from './db/sample'
import { useSchema } from './db/useSchema'
import { Diagram } from './diagram/Diagram'
import { useDiagram } from './diagram/useDiagram'
import { AppLayout } from './ui/AppLayout'
import './theme/tokens.css'

export function App() {
  const [ddl, setDdl] = useState(SAMPLE_DDL)
  const { schema, error } = useSchema(ddl)
  const { nodes, edges, onNodesChange } = useDiagram(schema)
  const format = () => formatSql(ddl).then(setDdl, console.error)

  return (
    <AppLayout
      onFormat={format}
      editor={
        <>
          <SqlEditor
            value={ddl}
            onChange={setDdl}
            onFormat={format}
            namespace={completionNamespace(schema)}
          />
          <ErrorBanner error={error} />
        </>
      }
      diagram={<Diagram nodes={nodes} edges={edges} onNodesChange={onNodesChange} />}
    />
  )
}
