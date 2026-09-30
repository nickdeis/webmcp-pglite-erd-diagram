import type { ReactNode } from 'react'
import './ui.css'

interface Props {
  editor: ReactNode
  diagram: ReactNode
  toolbar: ReactNode
}

/** Pure display: toolbar over a resizable editor pane and the diagram. */
export function AppLayout({ editor, diagram, toolbar }: Props) {
  return (
    <div className="app">
      <header className="toolbar">
        <strong className="brand">pglite-diagram</strong>
        {toolbar}
      </header>
      <main className="panes">
        <section className="editor-pane">{editor}</section>
        <section className="diagram-pane">{diagram}</section>
      </main>
    </div>
  )
}
