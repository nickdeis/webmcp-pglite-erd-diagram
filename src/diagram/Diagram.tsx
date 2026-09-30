import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type OnNodesChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './diagram.css'
import type { TableNode as TableNodeType } from './model'
import { FitOnFirstLayout } from './FitOnFirstLayout'
import { TableNode } from './TableNode'

const nodeTypes = { table: TableNode }

interface Props {
  nodes: TableNodeType[]
  edges: Edge[]
  onNodesChange?: OnNodesChange<TableNodeType>
}

/** Pure presentation: no layout or database code, so the standalone viewer can reuse it. */
export function Diagram({ nodes, edges, onNodesChange }: Props) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      colorMode="dark"
      minZoom={0.1}
      nodesConnectable={false}
    >
      <FitOnFirstLayout />
      <Background color="#2a2b2c" gap={24} />
      <Controls showInteractive={false} />
      <MiniMap pannable zoomable nodeColor="#2a2b2c" maskColor="#12131499" />
    </ReactFlow>
  )
}
