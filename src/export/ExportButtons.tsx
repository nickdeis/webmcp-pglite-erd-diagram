import { useReactFlow } from '@xyflow/react'
import { LuFileCode, LuImage, LuShapes } from 'react-icons/lu'
import type { TableNode } from '../diagram/model'
import { ToolbarButton } from '../ui/ToolbarButton'
import { downloadText, downloadUrl } from './download'
import { renderDiagramImage, type ImageKind } from './image'
import { buildStandaloneHtml } from './standaloneHtml'

/** Container: reads the live nodes from React Flow and downloads the chosen export. */
export function ExportButtons() {
  const { getNodes } = useReactFlow<TableNode>()

  const exportImage = (kind: ImageKind) => async () => {
    downloadUrl(`diagram.${kind}`, await renderDiagramImage(kind, getNodes()))
  }
  const exportHtml = () =>
    downloadText('diagram.html', buildStandaloneHtml(getNodes()), 'text/html')

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
