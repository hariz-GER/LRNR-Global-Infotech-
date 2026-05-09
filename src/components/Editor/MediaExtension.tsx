import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { MediaNodeView } from './MediaNodeView'

type MediaKind = 'image' | 'video'

const normalizeKind = (kind: unknown): MediaKind => (kind === 'video' ? 'video' : 'image')

export const MediaNode = Node.create({
  name: 'mediaBlock',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      kind: {
        default: 'image',
      },
      title: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-media-kind]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) {
            return false
          }

          const kind = normalizeKind(element.dataset.mediaKind)
          const media = element.querySelector(kind === 'image' ? 'img' : 'video')
          const caption = element.querySelector('figcaption')?.textContent ?? ''

          return {
            kind,
            src: media?.getAttribute('src'),
            title: caption || media?.getAttribute('title') || media?.getAttribute('alt') || '',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const kind = normalizeKind(HTMLAttributes.kind)
    const title = String(HTMLAttributes.title || (kind === 'image' ? 'Image' : 'Video'))

    return [
      'figure',
      mergeAttributes(HTMLAttributes, { 'data-media-kind': kind, class: 'media-node' }),
      kind === 'image'
        ? ['img', { src: HTMLAttributes.src, alt: title }]
        : ['video', { src: HTMLAttributes.src, title, controls: 'true' }],
      ['figcaption', title],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MediaNodeView)
  },
})
