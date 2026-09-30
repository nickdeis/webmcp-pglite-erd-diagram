import { LuGrid2X2 } from 'react-icons/lu'
import type { Partition } from '../db/types'
import { formatBound } from '../layout/partitionBound'

interface Props {
  partitions: Partition[]
  /** Partitions beyond the visible ones, summarised as "+N more". */
  hiddenCount: number
}

const INDENT_PX = 14

/** Pure display: partitions with their bounds; sub-partitions are indented under their parent. */
export function PartitionList({ partitions, hiddenCount }: Props) {
  return (
    <div className="partition-list">
      <div className="index-section">Partitions</div>
      {partitions.map((p) => (
        <div
          key={`${p.schema}.${p.name}`}
          className="partition-row"
          style={{ paddingLeft: 12 + p.depth * INDENT_PX }}
          title={p.partitionKey ? `${p.name} is partitioned by ${p.partitionKey}` : p.bound}
        >
          <LuGrid2X2 size={12} />
          <span className="partition-name">{p.name}</span>
          <span className="partition-bound">{p.partitionKey ?? formatBound(p.bound)}</span>
        </div>
      ))}
      {hiddenCount > 0 && <div className="partition-row partition-more">+ {hiddenCount} more</div>}
    </div>
  )
}
