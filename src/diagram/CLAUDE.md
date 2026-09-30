# src/diagram/

React Flow presentation. `Diagram` has no layout or database code so the standalone viewer can reuse it.

- `model.ts` — `buildNodes` / `buildEdges` (Schema + positions → React Flow), handle ids, `indexesByColumn`.
- `useDiagram.ts` — hook: ELK layout on schema change, keeps positions the user dragged.
- `Diagram.tsx` — `<ReactFlow>` wrapper with background, controls, minimap.
- `FitOnFirstLayout.tsx` — frames all tables once when first measured (later edits keep the viewport).
- `TableNode.tsx` — table card: header, comment, columns, index list.
- `ColumnRow.tsx` — column row: PK/FK marks, name, inline index badges, type icon, comment, edge handles.
- `IndexBadge.tsx` — coloured icon badge for an index on a column (same colour + icon across a column group).
- `IndexBadge.test.tsx` — display test.
- `diagram.css` — node styles; row heights come from `layout/sizing.ts` via inline styles.
