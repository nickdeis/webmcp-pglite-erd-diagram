import { useEffect, useState } from 'react'
import { readStoredFlag, writeStoredFlag, type StorageLike } from '../state/persistence'
import { enableRelay } from './relay'

const STORAGE_KEY = 'pglite-diagram:agent-bridge'

const noStorage: StorageLike = { getItem: () => null, setItem: () => {} }

function browserStorage(): StorageLike {
  try {
    return window.localStorage
  } catch {
    return noStorage
  }
}

/**
 * Opt-in bridge to desktop agents. Off by default, because turning it on makes the page open (and keep
 * retrying) a WebSocket to a relay on localhost; the choice is remembered.
 */
export function useAgentBridge() {
  const [enabled, setEnabled] = useState(() => readStoredFlag(browserStorage(), STORAGE_KEY))

  useEffect(() => {
    if (!enabled) return
    return enableRelay(document)
  }, [enabled])

  const toggle = () => {
    writeStoredFlag(browserStorage(), STORAGE_KEY, !enabled)
    setEnabled(!enabled)
  }
  return { enabled, toggle }
}
