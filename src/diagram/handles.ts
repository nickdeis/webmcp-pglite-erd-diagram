export type HandleRole = 'source' | 'target'
export type HandleSide = 'left' | 'right'

/** Column-row handles: one source and one target per column and side (foreign keys attach here). */
export const handleId = (column: string, role: HandleRole, side: HandleSide) =>
  `${column}:${role}:${side}`

/** Whole-node handles in the header (view dependencies attach here). */
export const nodeHandleId = (role: HandleRole, side: HandleSide) => `#node:${role}:${side}`
