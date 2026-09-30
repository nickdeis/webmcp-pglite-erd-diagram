import type { IconType } from 'react-icons'
import { LuDatabaseZap, LuEye, LuLayoutGrid, LuTable2 } from 'react-icons/lu'
import type { RelationKind } from '../db/types'

export interface RelationStyle {
  icon: IconType
  color: string
  /** Short caption in the node header; empty for a plain table. */
  label: string
  /** Views get a dashed border: they store no rows of their own. */
  dashed: boolean
}

export const RELATION_STYLES: Record<RelationKind, RelationStyle> = {
  table: { icon: LuTable2, color: 'var(--neon-cyan)', label: '', dashed: false },
  partitioned_table: {
    icon: LuLayoutGrid,
    color: 'var(--neon-orange)',
    label: 'PARTITIONED',
    dashed: false,
  },
  view: { icon: LuEye, color: 'var(--neon-green)', label: 'VIEW', dashed: true },
  materialized_view: {
    icon: LuDatabaseZap,
    color: 'var(--neon-lime)',
    label: 'MATERIALIZED VIEW',
    dashed: false,
  },
}
