import { describe, expect, it } from 'vitest'
import {
  ddlFromHash,
  ddlToHash,
  initialDdl,
  readStoredDdl,
  readStoredFlag,
  STORAGE_KEY,
  writeStoredFlag,
} from './persistence'

const memoryStorage = (items: Record<string, string> = {}) => ({
  getItem: (key: string) => items[key] ?? null,
  setItem: (key: string, value: string) => void (items[key] = value),
})

const DDL = "create table t (id int);\ncomment on table t is 'héllo ✓';"

describe('URL hash', () => {
  it('round-trips DDL including unicode and newlines', () => {
    expect(ddlFromHash(ddlToHash(DDL))).toBe(DDL)
  })

  it('ignores empty or corrupt hashes', () => {
    expect(ddlFromHash('')).toBeNull()
    expect(ddlFromHash('#d=')).toBeNull()
    expect(ddlFromHash('#other=1')).toBeNull()
  })

  it('stays URL-safe', () => {
    expect(ddlToHash(DDL)).toMatch(/^#d=[A-Za-z0-9+\-$]+$/)
  })
})

describe('initialDdl', () => {
  it('prefers the URL, then localStorage, then the sample', () => {
    const stored = memoryStorage({ [STORAGE_KEY]: 'stored' })
    expect(initialDdl(ddlToHash('from url'), stored, 'sample')).toBe('from url')
    expect(initialDdl('', stored, 'sample')).toBe('stored')
    expect(initialDdl('', memoryStorage(), 'sample')).toBe('sample')
  })

  it('survives a throwing storage', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {},
    }
    expect(readStoredDdl(broken)).toBeNull()
    expect(initialDdl('', broken, 'sample')).toBe('sample')
  })
})

describe('stored flags', () => {
  it('round-trips and defaults to off', () => {
    const storage = memoryStorage()
    expect(readStoredFlag(storage, 'k')).toBe(false)
    writeStoredFlag(storage, 'k', true)
    expect(readStoredFlag(storage, 'k')).toBe(true)
    writeStoredFlag(storage, 'k', false)
    expect(readStoredFlag(storage, 'k')).toBe(false)
  })

  it('treats blocked storage as off and never throws', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    }
    expect(readStoredFlag(broken, 'k')).toBe(false)
    expect(() => writeStoredFlag(broken, 'k', true)).not.toThrow()
  })
})
