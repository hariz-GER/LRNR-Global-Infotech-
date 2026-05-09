import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'
import { Pencil, Trash2 } from 'lucide-react'

type MediaKind = 'image' | 'video'

const normalizeKind = (kind: unknown): MediaKind => (kind === 'video' ? 'video' : 'image')

export function MediaNodeView({ node, updateAttributes, deleteNode, selected }: ReactNodeViewProps) {
  const kind = normalizeKind(node.attrs.kind)
  const title = String(node.attrs.title || (kind === 'image' ? 'Image' : 'Video'))

  const editMedia = () => {
    const nextTitle = window.prompt(`${kind === 'image' ? 'Image' : 'Video'} title`, title)

    if (nextTitle === null) {
      return
    }

    const nextSrc = window.prompt(`${kind === 'image' ? 'Image' : 'Video'} source`, String(node.attrs.src ?? ''))

    if (nextSrc !== null && nextSrc.trim()) {
      updateAttributes({ title: nextTitle.trim() || title, src: nextSrc.trim() })
      return
    }

    updateAttributes({ title: nextTitle.trim() || title })
  }

  return (
    <NodeViewWrapper className={`media-node ${selected ? 'selected' : ''}`}>
      <figure>
        {kind === 'image' ? (
          <img src={node.attrs.src} alt={title} />
        ) : (
          <video src={node.attrs.src} title={title} controls />
        )}
        <figcaption>{title}</figcaption>
      </figure>
      <div className="media-actions" contentEditable={false}>
        <button type="button" onClick={editMedia} aria-label={`Edit ${title}`}>
          <Pencil size={15} />
        </button>
        <button type="button" onClick={deleteNode} aria-label={`Remove ${title}`}>
          <Trash2 size={15} />
        </button>
      </div>
    </NodeViewWrapper>
  )
}
