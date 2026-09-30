import type { NodeProps } from '@xyflow/react'
import {
  hiddenPartitionCount,
  indexRowHeight,
  relationLabel,
  visiblePartitions,
} from '../layout/sizing'
import { RELATION_STYLES } from '../theme/relationStyle'
import { INDEX_STYLES } from '../theme/indexStyle'
import { ColumnRow } from './ColumnRow'
import { indexColors } from './indexColors'
import { NodeHandles } from './NodeHandles'
import { PartitionList } from './PartitionList'
import { RelationHeader } from './RelationHeader'
import { indexesByColumn, type TableNode as TableNodeType } from './model'

export function TableNode({ data: { table } }: NodeProps<TableNodeType>) {
  const byColumn = indexesByColumn(table.indexes)
  const colors = indexColors(table.indexes)
  const fkColumns = new Set(table.foreignKeys.flatMap((fk) => fk.columns))
  const style = RELATION_STYLES[table.kind]
  return (
    <div
      className={style.dashed ? 'table-node dashed' : 'table-node'}
      style={{ ['--node-color' as string]: style.color }}
    >
      <RelationHeader
        icon={style.icon}
        schema={table.schema}
        name={table.name}
        label={relationLabel(table)}
        title={table.definition ?? undefined}
      />
      <NodeHandles />
      {table.comment && <div className="comment table-comment">{table.comment}</div>}
      {table.columns.map((column) => (
        <ColumnRow
          key={column.name}
          column={column}
          indexes={byColumn.get(column.name) ?? []}
          isForeignKey={fkColumns.has(column.name)}
          colors={colors}
        />
      ))}
      {table.partitions.length > 0 && (
        <PartitionList
          partitions={visiblePartitions(table)}
          hiddenCount={hiddenPartitionCount(table)}
        />
      )}
      {table.indexes.length > 0 && <IndexList table={table} colors={colors} />}
    </div>
  )
}

function IndexList({
  table,
  colors,
}: {
  table: TableNodeType['data']['table']
  colors: Map<string, string>
}) {
  return (
    <div className="index-list">
      <div className="index-section">Indexes</div>
      {table.indexes.map((index) => {
        const Icon = INDEX_STYLES[index.kind].icon
        const color = colors.get(index.name)
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
