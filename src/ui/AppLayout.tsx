import type { ReactNode } from 'react'
import { LuWandSparkles } from 'react-icons/lu'
import './ui.css'

interface Props {
  editor: ReactNode
  diagram: ReactNode
  onFormat: () => void
}

/** Pure display: toolbar over a resizable editor pane and the diagram. */
export function AppLayout({ editor, diagram, onFormat }: Props) {
  return (
    <div className="app">
      <header className="toolbar">
        <strong className="brand">pglite-diagram</strong>
        <button onClick={onFormat} title="Format SQL (Ctrl/Cmd+Shift+F)">
          <LuWandSparkles size={14} /> Format
        </button>
      </header>
      <main className="panes">
        <section className="editor-pane">{editor}</section>
        <section className="diagram-pane">{diagram}</section>
      </main>
    </div>
  )
}
