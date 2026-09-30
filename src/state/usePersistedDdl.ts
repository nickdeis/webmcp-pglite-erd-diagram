import { useEffect, useState } from 'react'
import { ddlToHash, ddlFromHash, initialDdl, writeStoredDdl } from './persistence'

const SAVE_DELAY_MS = 400

const localStorageOrNull = (): Storage | null => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

/** DDL state mirrored into the URL hash and localStorage; follows hash changes (e.g. pasted links). */
export function usePersistedDdl(sample: string) {
  const [ddl, setDdl] = useState(() =>
    initialDdl(
      location.hash,
      localStorageOrNull() ?? { getItem: () => null, setItem() {} },
      sample,
    ),
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      history.replaceState(null, '', ddlToHash(ddl))
      const storage = localStorageOrNull()
      if (storage) writeStoredDdl(storage, ddl)
    }, SAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [ddl])

  useEffect(() => {
    const onHashChange = () => setDdl((current) => ddlFromHash(location.hash) ?? current)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return [ddl, setDdl] as const
}
