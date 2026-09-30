import { getNodesBounds, type Node } from '@xyflow/react'
import { toPng, toSvg } from 'html-to-image'

export type ImageKind = 'png' | 'svg'

const PADDING = 48
const BACKGROUND = '#121314'
const TARGET_PIXEL_RATIO = 3
/** Browsers refuse canvases much larger than this on either side. */
const MAX_CANVAS_SIDE = 16000

const viewportElement = () => document.querySelector<HTMLElement>('.react-flow__viewport')!

/** Render every table (not just the visible part) to a data URL, framed by `PADDING`. */
export function renderDiagramImage(kind: ImageKind, nodes: Node[]): Promise<string> {
  const bounds = getNodesBounds(nodes)
  const width = Math.ceil(bounds.width + PADDING * 2)
  const height = Math.ceil(bounds.height + PADDING * 2)
  const options = {
    backgroundColor: BACKGROUND,
    width,
    height,
    pixelRatio: Math.min(TARGET_PIXEL_RATIO, MAX_CANVAS_SIDE / Math.max(width, height)),
    style: {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${PADDING - bounds.x}px, ${PADDING - bounds.y}px) scale(1)`,
    },
  }
  return (kind === 'png' ? toPng : toSvg)(viewportElement(), options)
}
