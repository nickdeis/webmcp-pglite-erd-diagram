import type { NodeProps } from '@xyflow/react'
import { LuTable2 } from 'react-icons/lu'
import { indexRowHeight } from '../layout/sizing'
import { INDEX_STYLES } from '../theme/indexStyle'
import { ColumnRow } from './ColumnRow'
import { indexesByColumn, type TableNode as TableNodeType } from './model'

export function TableNode({ data: { table } }: NodeProps<TableNodeType>) {
  const byColumn = indexesByColumn(table.indexes)
  const fkColumns = new Set(table.foreignKeys.flatMap((fk) => fk.columns))
  return (
    <div className="table-node">
      <div className="table-header">
        <LuTable2 size={14} />
        <span className="table-name">
          {table.schema !== 'public' && <span className="table-schema">{table.schema}.</span>}
          {table.name}
        </span>
      </div>
      {table.comment && <div className="comment table-comment">{table.comment}</div>}
      {table.columns.map((column) => (
        <ColumnRow
          key={column.name}
          column={column}
          indexes={byColumn.get(column.name) ?? []}
          isForeignKey={fkColumns.has(column.name)}
        />
      ))}
      {table.indexes.length > 0 && <IndexList table={table} />}
    </div>
  )
}

function IndexList({ table }: { table: TableNodeType['data']['table'] }) {
  return (
    <div className="index-list">
      <div className="index-section">Indexes</div>
      {table.indexes.map((index) => {
        const { icon: Icon, color } = INDEX_STYLES[index.kind]
        return (
          <div
            key={index.name}
            className="index-row"
            style={{ height: indexRowHeight(index.comment) }}
          >
            <div className="index-main" style={{ color }}>
              <Icon size={12} />
              <span className="index-name">{index.name}</span>
              <span className="index-columns">({index.columns.join(', ')})</span>
              {index.unique && <span className="index-unique">unique</span>}
            </div>
            {index.comment && <div className="comment">{index.comment}</div>}
          </div>
        )
      })}
    </div>
  )
}
