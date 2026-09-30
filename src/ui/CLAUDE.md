# src/ui/

App chrome (pure display components).

- `AppLayout.tsx` — toolbar slot + resizable editor pane + diagram pane; receives the editor/diagram as slots.
- `DiagramStatus.tsx` — "Starting Postgres…" / "No tables yet" overlay.
- `RestoreBanner.tsx` — "Updated by AI · Restore previous" bar shown after a WebMCP `write_sql`.
- `AgentBridgeBanner.tsx` — shown while the agent bridge is on: how to start the relay and connect an agent, plus a warning that agents can rewrite the DDL.
- `ToolbarButton.tsx` — icon + label button; `pressed` makes it a toggle (`aria-pressed`).
- `ui.css` — layout, toolbar, banner and toggle styles.
