import { useEdgesState, useNodesState, type OnNodesChange } from '@xyflow/react'
import { useEffect, useRef } from 'react'
import type { Schema } from '../db/types'
import { layoutSchema } from '../layout/elk'
import type { Point } from '../layout/keys'
import { buildEdges } from './edges'
import { buildNodes, type DiagramNode } from './model'

/** Lays out the schema with ELK, keeping positions the user has dragged tables to. */
export function useDiagram(schema: Schema | null) {
  const [nodes, setNodes, onNodesChange] = useNodesState<DiagramNode>([])
  const [edges, setEdges] = useEdgesState<ReturnType<typeof buildEdges>[number]>([])
  const dragged = useRef<Record<string, Point>>({})

  useEffect(() => {
    if (!schema) return
    let stale = false
    layoutSchema(schema).then((auto) => {
      if (stale) return
      const positions = { ...auto, ...dragged.current }
      setNodes(buildNodes(schema, positions))
      setEdges(buildEdges(schema, positions))
    })
    return () => {
      stale = true
    }
  }, [schema, setNodes, setEdges])

  const trackDrags: OnNodesChange<DiagramNode> = (changes) => {
    for (const change of changes) {
      if (change.type === 'position' && change.position)
        dragged.current[change.id] = change.position
    }
    onNodesChange(changes)
  }

  return { nodes, edges, onNodesChange: trackDrags }
}
