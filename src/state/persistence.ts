import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'

export const HASH_KEY = 'd'
export const STORAGE_KEY = 'pglite-diagram:ddl'

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export const ddlToHash = (ddl: string): string =>
  `#${HASH_KEY}=${compressToEncodedURIComponent(ddl)}`

/** DDL encoded in a location hash, or null when absent or corrupt. */
export function ddlFromHash(hash: string): string | null {
  const encoded = new URLSearchParams(hash.replace(/^#/, '')).get(HASH_KEY)
  return encoded ? decompressFromEncodedURIComponent(encoded) || null : null
}

const safely = <T>(action: () => T): T | null => {
  try {
    return action()
  } catch {
    return null
  }
}

export const readStoredDdl = (storage: StorageLike): string | null =>
  safely(() => storage.getItem(STORAGE_KEY))

export const writeStoredDdl = (storage: StorageLike, ddl: string): void => {
  safely(() => storage.setItem(STORAGE_KEY, ddl))
}

/** Precedence: shared URL, then the last local edit, then the sample. */
export const initialDdl = (hash: string, storage: StorageLike, sample: string): string =>
  ddlFromHash(hash) ?? readStoredDdl(storage) ?? sample
