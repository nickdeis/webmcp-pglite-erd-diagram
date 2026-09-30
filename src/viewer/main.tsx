import { createRoot } from 'react-dom/client'
import '../theme/tokens.css'
import { readPayload } from './payload'
import { ViewerApp } from './ViewerApp'

const json = document.getElementById('diagram-data')!.textContent!
createRoot(document.getElementById('root')!).render(<ViewerApp payload={readPayload(json)} />)
