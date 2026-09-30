import { useEffect, useState } from 'react'
import { FIXTURE_DDL } from './db/fixture'
import { createDb, schemaFromDdl } from './db/pglite'
import type { Schema } from './db/types'
import { Diagram } from './diagram/Diagram'
import { useDiagram } from './diagram/useDiagram'
import './theme/tokens.css'

export function App() {
  const [schema, setSchema] = useState<Schema | null>(null)
  const { nodes, edges, onNodesChange } = useDiagram(schema)

  useEffect(() => {
    createDb()
      .then((db) => schemaFromDdl(db, FIXTURE_DDL))
      .then(setSchema)
  }, [])

  return (
    <div style={{ height: '100%' }}>
      <Diagram nodes={nodes} edges={edges} onNodesChange={onNodesChange} />
    </div>
  )
}
