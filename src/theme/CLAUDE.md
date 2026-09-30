# src/theme/

Look and feel: VS Code "2026 Dark" palette plus neon accents.

- `tokens.css` — CSS variables (background, foreground, syntax and neon colours, fonts) and base body styles.
- `indexStyle.ts` — `INDEX_STYLES`: icon, neon colour and label per `IndexKind`.
- `relationStyle.ts` — `RELATION_STYLES` (table / partitioned table / view / materialized view) and `FUNCTION_STYLE`: icon, neon colour, caption and dashed flag per node kind.
- `typeIcons.ts` — `typeIcon(typeName, typeCategory)`: icon per Postgres type, with `typcategory` fallbacks.
