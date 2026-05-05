import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { CirclePlus, ClipboardCheck, Image, PlaySquare } from 'lucide-react'
import { useAuthoringStore } from '../../store/useAuthoringStore'
import { findNode } from '../../utils/tree'
import { EditorToolbar, SectionToolbar } from './EditorToolbar'

const widgets = [
  { label: 'Video', icon: PlaySquare },
  { label: 'Assessment item', icon: ClipboardCheck },
  { label: 'Image', icon: Image },
] as const

export function RichTextEditor() {
  const tree = useAuthoringStore((state) => state.tree)
  const activeNodeId = useAuthoringStore((state) => state.activeNodeId)
  const updateContent = useAuthoringStore((state) => state.updateContent)
  const activeNode = findNode(tree, activeNodeId)

  const editor = useEditor({
    extensions: [
      StarterKit,
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
      if (activeNodeId) {
        updateContent(activeNodeId, { body: currentEditor.getHTML() })
      }
    },
  })

  useEffect(() => {
    if (!editor || !activeNode) {
      return
    }

    if (editor.getHTML() !== activeNode.content.body) {
      editor.commands.setContent(activeNode.content.body, { emitUpdate: false })
    }
  }, [activeNode, editor])

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

      <input
        className="title-input"
        value={activeNode.content.title}
        onChange={(event) => updateContent(activeNode.id, { title: event.target.value })}
        aria-label="Content title"
      />

      <div className="editor-stage">
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} />
        <SectionToolbar editor={editor} />
      </div>

      <div className="widget-strip">
        <div className="widget-add">
          <CirclePlus size={21} />
        </div>
        <div className="widget-menu" aria-label="Add widgets">
          {widgets.map((widget) => {
            const Icon = widget.icon

            return (
              <button
                key={widget.label}
                type="button"
                onClick={() =>
                  updateContent(activeNode.id, {
                    widgets: [...activeNode.content.widgets, widget.label],
                    body: `${activeNode.content.body}<p><strong>${widget.label}</strong> widget placeholder</p>`,
                  })
                }
              >
                <Icon size={16} />
                {widget.label}
              </button>
            )
          })}
        </div>
      </div>

      {activeNode.content.widgets.length ? (
        <div className="widget-list">
          {activeNode.content.widgets.map((widget, index) => (
            <span key={`${widget}-${index}`}>{widget}</span>
          ))}
        </div>
      ) : null}
    </main>
  )
}
