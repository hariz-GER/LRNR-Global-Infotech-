import { useCallback, useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { CirclePlus } from 'lucide-react'
import { ASSESSMENT_WIDGET, EDITOR_SAVE_DELAY_MS, MEDIA_WIDGETS } from '../../constants/authoring'
import { useActiveNode, useAuthoringStore } from '../../store/useAuthoringStore'
import { EditorToolbar, SelectionBubbleMenu } from './EditorToolbar'
import { MediaNode } from './MediaExtension'

type MediaKind = 'image' | 'video'

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', () => resolve(String(reader.result)))
    reader.addEventListener('error', () => reject(reader.error))
    reader.readAsDataURL(file)
  })

export function RichTextEditor() {
  const activeNode = useActiveNode()
  const activeNodeId = useAuthoringStore((state) => state.activeNodeId)
  const updateContent = useAuthoringStore((state) => state.updateContent)
  const pendingSaveRef = useRef<number | null>(null)
  const activeNodeIdRef = useRef(activeNodeId)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const widgetStripRef = useRef<HTMLDivElement | null>(null)
  const mediaKindRef = useRef<MediaKind>('image')
  const [isWidgetMenuOpen, setIsWidgetMenuOpen] = useState(false)

  const saveBody = useCallback(
    (nodeId: string, body: string) => {
      if (pendingSaveRef.current) {
        window.clearTimeout(pendingSaveRef.current)
      }

      pendingSaveRef.current = window.setTimeout(() => {
        updateContent(nodeId, { body })
        pendingSaveRef.current = null
      }, EDITOR_SAVE_DELAY_MS)
    },
    [updateContent],
  )

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noreferrer',
          target: '_blank',
        },
      }),
      MediaNode,
      Placeholder.configure({
        placeholder: 'Start writing content...',
      }),
    ],
    content: activeNode?.content.body ?? '',
    editorProps: {
      attributes: {
        class: 'editor-prose',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      if (activeNodeIdRef.current) {
        saveBody(activeNodeIdRef.current, currentEditor.getHTML())
      }
    },
  })

  useEffect(() => {
    activeNodeIdRef.current = activeNodeId
  }, [activeNodeId])

  useEffect(() => {
    return () => {
      if (pendingSaveRef.current) {
        window.clearTimeout(pendingSaveRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isWidgetMenuOpen) {
      return undefined
    }

    const closeWidgetMenuOnOutsideClick = (event: PointerEvent) => {
      const target = event.target

      if (target instanceof Node && !widgetStripRef.current?.contains(target)) {
        setIsWidgetMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeWidgetMenuOnOutsideClick)

    return () => {
      document.removeEventListener('pointerdown', closeWidgetMenuOnOutsideClick)
    }
  }, [isWidgetMenuOpen])

  useEffect(() => {
    if (!editor || !activeNode) {
      return
    }

    if (pendingSaveRef.current) {
      window.clearTimeout(pendingSaveRef.current)
      pendingSaveRef.current = null
    }

    if (editor.getHTML() !== activeNode.content.body) {
      editor.commands.setContent(activeNode.content.body, { emitUpdate: false })
    }
  }, [activeNode, editor])

  const pickMedia = (kind: MediaKind) => {
    mediaKindRef.current = kind
    setIsWidgetMenuOpen(false)
    fileInputRef.current?.click()
  }

  const insertMediaFile = async (file: File) => {
    if (!editor) {
      return
    }

    const kind = mediaKindRef.current
    const src = await readFileAsDataUrl(file)
    const title = file.name.replace(/\.[^.]+$/, '') || (kind === 'image' ? 'Image' : 'Video')

    editor
      .chain()
      .focus()
      .insertContent({
        type: 'mediaBlock',
        attrs: { kind, src, title },
      })
      .run()
  }

  const insertAssessment = () => {
    editor
      ?.chain()
      .focus()
      .insertContent('<blockquote><p><strong>Assessment item</strong>: add prompt, options, and feedback.</p></blockquote>')
      .run()
    setIsWidgetMenuOpen(false)
  }

  if (!activeNode) {
    return (
      <main className="editor-shell empty-editor">
        <h1>WYSIWYG Editor</h1>
        <p>Select or create an item to begin editing.</p>
      </main>
    )
  }

  return (
    <main className="editor-shell">
      <div className="editor-meta">
        <span>collection.1 / collection.1.1 / {activeNode.label}</span>
        <button type="button">Add item member</button>
      </div>

      <TitleInput key={activeNode.id} nodeId={activeNode.id} title={activeNode.content.title} />

      <div className="editor-stage">
        <EditorToolbar editor={editor} onPickMedia={pickMedia} />
        <SelectionBubbleMenu editor={editor} />
        <EditorContent editor={editor} />
      </div>

      <input
        ref={fileInputRef}
        className="visually-hidden"
        type="file"
        accept={MEDIA_WIDGETS.map((widget) => widget.accept).join(',')}
        onChange={(event) => {
          const [file] = Array.from(event.target.files ?? [])

          if (file) {
            void insertMediaFile(file)
          }

          event.target.value = ''
        }}
      />

      <div className={`widget-strip ${isWidgetMenuOpen ? 'open' : ''}`} ref={widgetStripRef}>
        <button
          className="widget-add"
          type="button"
          onClick={() => setIsWidgetMenuOpen((value) => !value)}
          aria-label="Add editor content"
          aria-expanded={isWidgetMenuOpen}
        >
          <CirclePlus size={21} />
        </button>
        <div className="widget-menu" aria-label="Add editor content">
          {MEDIA_WIDGETS.map((widget) => {
            const Icon = widget.icon

            return (
              <button key={widget.id} type="button" onClick={() => pickMedia(widget.id)}>
                <Icon size={16} />
                {widget.label}
              </button>
            )
          })}
          <button type="button" onClick={insertAssessment}>
            <AssessmentIcon size={16} />
            {ASSESSMENT_WIDGET.label}
          </button>
        </div>
      </div>
    </main>
  )
}

const AssessmentIcon = ASSESSMENT_WIDGET.icon

function TitleInput({ nodeId, title: initialTitle }: { nodeId: string; title: string }) {
  const [title, setTitle] = useState(initialTitle)
  const updateContent = useAuthoringStore((state) => state.updateContent)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (title !== initialTitle) {
        updateContent(nodeId, { title })
      }
    }, EDITOR_SAVE_DELAY_MS)

    return () => window.clearTimeout(timeout)
  }, [initialTitle, nodeId, title, updateContent])

  return (
    <input
      className="title-input"
      value={title}
      onChange={(event) => setTitle(event.target.value)}
      aria-label="Content title"
    />
  )
}
