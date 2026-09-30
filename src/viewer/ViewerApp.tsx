import { useNodesState } from '@xyflow/react'
import { Diagram } from '../diagram/Diagram'
import { buildEdges, buildNodes, type TableNode } from '../diagram/model'
import type { ViewerPayload } from './payload'

/** Diagram-only app: no editor, no database, no layout engine. */
export function ViewerApp({ payload: { schema, positions } }: { payload: ViewerPayload }) {
  const [nodes, , onNodesChange] = useNodesState<TableNode>(buildNodes(schema, positions))
  return (
    <div style={{ height: '100%' }}>
      <Diagram nodes={nodes} edges={buildEdges(schema, positions)} onNodesChange={onNodesChange} />
    </div>
  )
}
