import { Handle, Position } from '@xyflow/react'
import { LuKeyRound, LuLink } from 'react-icons/lu'
import type { Column, Index } from '../db/types'
import { columnRowHeight } from '../layout/sizing'
import { INDEX_STYLES } from '../theme/indexStyle'
import { typeIcon } from '../theme/typeIcons'
import { IndexBadge } from './IndexBadge'
import { handleId } from './handles'

interface Props {
  column: Column
  indexes: Index[]
  isForeignKey: boolean
}

const SIDES = [
  ['left', Position.Left],
  ['right', Position.Right],
] as const

/** Colour of the first multi-column index touching the column, if any (the row's group highlight). */
const groupColor = (indexes: Index[]): string | undefined => {
  const group = indexes.find((i) => i.columns.length > 1)
  return group && INDEX_STYLES[group.kind].color
}

export function ColumnRow({ column, indexes, isForeignKey }: Props) {
  const TypeIcon = typeIcon(column.typeName, column.typeCategory)
  const color = groupColor(indexes)
  return (
    <div
      className={color ? 'column-row grouped' : 'column-row'}
      style={{ height: columnRowHeight(column.comment), ['--group-color' as string]: color }}
    >
      {SIDES.map(([side, position]) => (
        <span key={side}>
          <Handle id={handleId(column.name, 'source', side)} type="source" position={position} />
          <Handle id={handleId(column.name, 'target', side)} type="target" position={position} />
        </span>
      ))}
      <div className="column-main">
        <span className="column-marks">
          {column.isPrimaryKey && <LuKeyRound size={12} className="mark-pk" title="Primary key" />}
          {isForeignKey && <LuLink size={12} className="mark-fk" title="Foreign key" />}
        </span>
        <span className={column.notNull ? 'column-name required' : 'column-name'}>
          {column.name}
        </span>
        <span className="column-badges">
          {indexes.map((index) => (
            <IndexBadge key={index.name} index={index} />
          ))}
        </span>
        <span
          className="column-type"
          title={column.default ? `default ${column.default}` : undefined}
        >
          <TypeIcon size={12} />
          {column.type}
        </span>
      </div>
      {column.comment && <div className="comment column-comment">{column.comment}</div>}
    </div>
  )
}
