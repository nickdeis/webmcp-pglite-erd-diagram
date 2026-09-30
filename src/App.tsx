import { completionNamespace } from './editor/completion'
import { ErrorBanner } from './editor/ErrorBanner'
import { formatSql } from './editor/format'
import { SqlEditor } from './editor/SqlEditor'
import { SAMPLE_DDL } from './db/sample'
import { useSchema } from './db/useSchema'
import { Diagram } from './diagram/Diagram'
import { useDiagram } from './diagram/useDiagram'
import { usePersistedDdl } from './state/usePersistedDdl'
import { ReactFlowProvider } from '@xyflow/react'
import { LuWandSparkles } from 'react-icons/lu'
import { ExportButtons } from './export/ExportButtons'
import { DiagramStatus } from './ui/DiagramStatus'
import { ToolbarButton } from './ui/ToolbarButton'
import { AppLayout } from './ui/AppLayout'
import './theme/tokens.css'

export function App() {
  const [ddl, setDdl] = usePersistedDdl(SAMPLE_DDL)
  const { schema, error, loading } = useSchema(ddl)
  const { nodes, edges, onNodesChange } = useDiagram(schema)
  const format = () => formatSql(ddl).then(setDdl, console.error)

  return (
    <ReactFlowProvider>
      <AppLayout
        toolbar={
          <>
            <ToolbarButton
              icon={LuWandSparkles}
              label="Format"
              title="Format SQL (Ctrl/Cmd+Shift+F)"
              onClick={format}
            />
            <ExportButtons />
          </>
        }
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
        diagram={
          <>
            <Diagram nodes={nodes} edges={edges} onNodesChange={onNodesChange} />
            <DiagramStatus loading={loading} empty={schema?.tables.length === 0} />
          </>
        }
      />
    </ReactFlowProvider>
  )
}
