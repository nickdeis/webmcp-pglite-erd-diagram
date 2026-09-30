import { useReactFlow } from '@xyflow/react'
import { LuFileCode, LuImage, LuShapes } from 'react-icons/lu'
import type { Schema } from '../db/types'
import { ToolbarButton } from '../ui/ToolbarButton'
import { downloadText, downloadUrl } from './download'
import { renderDiagramImage, type ImageKind } from './image'
import { buildStandaloneHtml } from './standaloneHtml'

/** Container: reads the live nodes from React Flow and downloads the chosen export. */
export function ExportButtons({ schema }: { schema: Schema | null }) {
  const { getNodes } = useReactFlow()

  const exportImage = (kind: ImageKind) => async () => {
    downloadUrl(`diagram.${kind}`, await renderDiagramImage(kind, getNodes()))
  }
  const exportHtml = () => {
    if (schema) downloadText('diagram.html', buildStandaloneHtml(schema, getNodes()), 'text/html')
  }

  return (
    <>
      <ToolbarButton
        icon={LuImage}
        label="PNG"
        title="Export high-res PNG"
        onClick={exportImage('png')}
      />
      <ToolbarButton icon={LuShapes} label="SVG" title="Export SVG" onClick={exportImage('svg')} />
      <ToolbarButton
        icon={LuFileCode}
        label="HTML"
        title="Export a standalone diagram-only HTML file"
        onClick={exportHtml}
      />
    </>
  )
}
