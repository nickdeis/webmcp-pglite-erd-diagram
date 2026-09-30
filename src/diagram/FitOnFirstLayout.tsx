import { useNodesInitialized, useReactFlow } from '@xyflow/react'
import { useEffect, useRef } from 'react'

const FIT_PADDING = 0.15

/** Frames all tables once, when they first get measured; later edits keep the user's viewport. */
export function FitOnFirstLayout() {
  const initialized = useNodesInitialized()
  const { fitView } = useReactFlow()
  const done = useRef(false)

  useEffect(() => {
    if (!initialized || done.current) return
    done.current = true
    fitView({ padding: FIT_PADDING })
  }, [initialized, fitView])

  return null
}
