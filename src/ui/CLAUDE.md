# src/ui/

App chrome (pure display components).

- `AppLayout.tsx` — toolbar slot + resizable editor pane + diagram pane; receives the editor/diagram as slots.
- `DiagramStatus.tsx` — "Starting Postgres…" / "No tables yet" overlay.
- `RestoreBanner.tsx` — "Updated by AI · Restore previous" bar shown after a WebMCP `write_sql`.
- `ToolbarButton.tsx` — icon + label button.
- `ui.css` — layout, toolbar and error-banner styles.
