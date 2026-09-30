# src/diagram/

React Flow presentation. `Diagram` has no layout or database code so the standalone viewer can reuse it.

- `model.ts` — node types (`TableNode` for tables/partitioned tables/views/materialized views, `DiagramNode`), `buildNodes`, `indexesByColumn`.
- `edges.ts` — `buildEdges`: FK edges between column rows plus dashed dependency edges (source → view) in the reader's colour; self-referencing FKs loop out of the node's right side.
- `handles.ts` — handle ids: per-column (FKs) and whole-node (dependencies).
- `useDiagram.ts` — hook: ELK layout on schema change, keeps positions the user dragged.
- `Diagram.tsx` — `<ReactFlow>` wrapper with background, controls, minimap.
- `FitOnFirstLayout.tsx` — frames all tables once when first measured (later edits keep the viewport).
- `TableNode.tsx` — card for tables, partitioned tables, views and materialized views: coloured header, comment, columns, partitions, indexes.
- `RelationHeader.tsx`, `PartitionList.tsx`, `NodeHandles.tsx` — pure pieces of the cards (header with icon/caption, nested partitions with compact bounds, dependency handles).
- `ColumnRow.tsx` — column row (tinted + edge bar in the index colour when part of a multi-column index): PK/FK marks, name, inline index badges, type icon, comment, edge handles.
- `IndexBadge.tsx` — coloured icon badge for an index on a column (same colour + icon across a column group).
- `indexColors.ts` — `indexColors`: colour per index; extra multi-column groups of the same kind get distinct unused colours so overlapping groups can be told apart.
- `IndexBadge.test.tsx`, `display.test.tsx`, `model.test.ts`, `indexColors.test.ts` — tests.
- `diagram.css` — node styles; row heights come from `layout/sizing.ts` via inline styles.
