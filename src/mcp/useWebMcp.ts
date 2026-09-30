import { useEffect, useRef, useState } from 'react'
import { runDdlOrExplain } from '../db/instance'
import { formatSql } from '../editor/format'
import { registerWebMcpTools } from './register'
import { createTools } from './tools'

interface AiEdit {
  previous: string
  written: string
}

/** Run `task` once the browser is idle (after first paint); returns a canceller. */
function whenIdle(task: () => void): () => void {
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(task)
    return () => window.cancelIdleCallback(id)
  }
  const id = setTimeout(task, 0)
  return () => clearTimeout(id)
}

/**
 * Exposes the editor to WebMCP agents. `previousDdl` is the DDL an agent just replaced, offered for
 * restore only while the editor still holds exactly what the agent wrote.
 */
export function useWebMcp(ddl: string, setDdl: (ddl: string) => void) {
  const latest = useRef(ddl)
  const [edit, setEdit] = useState<AiEdit | null>(null)

  useEffect(() => {
    latest.current = ddl
  })

  useEffect(() => {
    const controller = new AbortController()
    const applyDdl = (written: string) => {
      if (written !== latest.current) setEdit({ previous: latest.current, written })
      setDdl(written)
    }
    const tools = createTools({
      getDdl: () => latest.current,
      applyDdl,
      format: formatSql,
      run: runDdlOrExplain,
    })
    const cancelIdle = whenIdle(() => {
      registerWebMcpTools(tools, controller.signal).catch((e) =>
        console.warn('WebMCP unavailable:', e),
      )
    })
    return () => {
      cancelIdle()
      controller.abort()
    }
  }, [setDdl])

  const previousDdl = edit && edit.written === ddl ? edit.previous : null
  const restore = () => {
    if (previousDdl !== null) setDdl(previousDdl)
    setEdit(null)
  }
  return { previousDdl, restore, dismiss: () => setEdit(null) }
}
