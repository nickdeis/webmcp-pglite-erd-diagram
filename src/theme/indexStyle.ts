import type { IconType } from 'react-icons'
import {
  LuBoxes,
  LuGauge,
  LuLayers,
  LuScanSearch,
  LuSearch,
  LuTextSearch,
  LuWaypoints,
  LuZap,
  LuDatabase,
  LuSigma,
} from 'react-icons/lu'
import type { IndexKind } from '../db/types'

export interface IndexStyle {
  icon: IconType
  color: string
  label: string
}

export const INDEX_STYLES: Record<IndexKind, IndexStyle> = {
  fts: { icon: LuTextSearch, color: 'var(--neon-cyan)', label: 'Full-text search' },
  trigram: { icon: LuScanSearch, color: 'var(--neon-pink)', label: 'Trigram' },
  vector: { icon: LuWaypoints, color: 'var(--neon-violet)', label: 'Vector' },
  gin: { icon: LuBoxes, color: 'var(--neon-green)', label: 'GIN' },
  gist: { icon: LuLayers, color: 'var(--neon-yellow)', label: 'GiST' },
  btree: { icon: LuSigma, color: 'var(--neon-blue)', label: 'B-tree' },
  hash: { icon: LuZap, color: 'var(--neon-orange)', label: 'Hash' },
  brin: { icon: LuGauge, color: 'var(--neon-red)', label: 'BRIN' },
  spgist: { icon: LuSearch, color: 'var(--neon-teal)', label: 'SP-GiST' },
  other: { icon: LuDatabase, color: 'var(--fg-muted)', label: 'Index' },
}
