import type { IndexKind } from './types'

interface IndexFacts {
  method: string
  opclasses: string[]
  /** Types of the index's own attributes (expression results included). */
  keyTypes: string[]
  definition: string
}

const PLAIN_METHODS = ['btree', 'hash', 'gin', 'gist', 'spgist', 'brin']

/** Semantic kind of an index: FTS/trigram/vector win over the raw access method. */
export function classifyIndex({ method, opclasses, keyTypes, definition }: IndexFacts): IndexKind {
  if (method === 'hnsw' || method === 'ivfflat') return 'vector'
  if (opclasses.some((o) => o.includes('trgm'))) return 'trigram'
  if (isFullText({ method, opclasses, keyTypes, definition })) return 'fts'
  return PLAIN_METHODS.includes(method) ? (method as IndexKind) : 'other'
}

function isFullText({ method, opclasses, keyTypes, definition }: IndexFacts) {
  if (method !== 'gin' && method !== 'gist') return false
  return (
    keyTypes.includes('tsvector') ||
    opclasses.some((o) => o.startsWith('tsvector') || o.startsWith('tsquery')) ||
    /to_tsvector/i.test(definition)
  )
}
