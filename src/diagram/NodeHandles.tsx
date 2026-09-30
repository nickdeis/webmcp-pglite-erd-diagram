import { Handle, Position } from '@xyflow/react'
import { nodeHandleId } from './handles'

const SIDES = [
  ['left', Position.Left],
  ['right', Position.Right],
] as const

/** Whole-node connection points in the header, used by view/function dependency edges. */
export function NodeHandles() {
  return SIDES.map(([side, position]) => (
    <span key={side}>
      <Handle
        className="node-handle"
        id={nodeHandleId('source', side)}
        type="source"
        position={position}
      />
      <Handle
        className="node-handle"
        id={nodeHandleId('target', side)}
        type="target"
        position={position}
      />
    </span>
  ))
}
