import type { NodeProps } from '@xyflow/react'
import { FUNCTION_STYLE } from '../theme/relationStyle'
import { FunctionBody } from './FunctionBody'
import type { FunctionNode as FunctionNodeType } from './model'
import { NodeHandles } from './NodeHandles'
import { RelationHeader } from './RelationHeader'

/** A row-returning function: arguments in, columns out. */
export function FunctionNode({ data: { fn } }: NodeProps<FunctionNodeType>) {
  return (
    <div className="table-node" style={{ ['--node-color' as string]: FUNCTION_STYLE.color }}>
      <RelationHeader
        icon={FUNCTION_STYLE.icon}
        schema={fn.schema}
        name={fn.name}
        label={FUNCTION_STYLE.label}
        title={`${fn.name}(${fn.identityArgs}) · ${fn.language}`}
      />
      <NodeHandles />
      {fn.comment && <div className="comment table-comment">{fn.comment}</div>}
      <FunctionBody fn={fn} />
    </div>
  )
}
