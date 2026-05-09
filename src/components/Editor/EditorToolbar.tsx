import { useCallback, useEffect, useState } from 'react'
import type { Editor } from '@tiptap/react'
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  MessageSquare,
  Pilcrow,
  PlaySquare,
} from 'lucide-react'

type EditorToolbarProps = {
  editor: Editor | null
  onPickMedia: (kind: 'image' | 'video') => void
}

type SelectionToolbarProps = {
  editor: Editor | null
}

const setLink = (editor: Editor) => {
  const previousUrl = editor.getAttributes('link').href as string | undefined
  const url = window.prompt('Link URL', previousUrl ?? 'https://')

  if (url === null) {
    return
  }

  if (!url.trim()) {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
}

export function EditorToolbar({ editor, onPickMedia }: EditorToolbarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="editor-toolbar" aria-label="Editor toolbar">
      <div className="toolbar-group" aria-label="Text style">
        <button
          className={editor.isActive('paragraph') ? 'active' : ''}
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          aria-label="Paragraph"
        >
          <Pilcrow size={16} />
        </button>
        <button
          className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          aria-label="Heading 1"
        >
          <Heading1 size={17} />
        </button>
        <button
          className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading 2"
        >
          <Heading2 size={17} />
        </button>
        <button
          className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Heading 3"
        >
          <Heading3 size={17} />
        </button>
      </div>

      <div className="toolbar-group" aria-label="Inline formatting">
        <InlineButtons editor={editor} />
      </div>

      <div className="toolbar-group" aria-label="Media">
        <button type="button" onClick={() => onPickMedia('image')} aria-label="Insert image">
          <Image size={16} />
        </button>
        <button type="button" onClick={() => onPickMedia('video')} aria-label="Insert video">
          <PlaySquare size={16} />
        </button>
      </div>
    </div>
  )
}

export function SelectionBubbleMenu({ editor }: SelectionToolbarProps) {
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)

  const updatePosition = useCallback(() => {
    if (!editor || editor.state.selection.empty || !editor.isEditable) {
      setPosition(null)
      return
    }

    const { from, to } = editor.state.selection
    const start = editor.view.coordsAtPos(from)
    const end = editor.view.coordsAtPos(to)

    setPosition({
      left: (start.left + end.right) / 2,
      top: Math.min(start.top, end.top) - 12,
    })
  }, [editor])

  useEffect(() => {
    if (!editor) {
      return undefined
    }

    editor.on('selectionUpdate', updatePosition)
    editor.on('transaction', updatePosition)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      editor.off('selectionUpdate', updatePosition)
      editor.off('transaction', updatePosition)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [editor, updatePosition])

  if (!editor) {
    return null
  }

  if (!position) {
    return null
  }

  return (
    <div className="selection-bubble" style={{ left: position.left, top: position.top }}>
      <InlineButtons editor={editor} />
    </div>
  )
}

function InlineButtons({ editor }: { editor: Editor }) {
  return (
    <>
      <button
        className={editor.isActive('bold') ? 'active' : ''}
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        className={editor.isActive('italic') ? 'active' : ''}
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
      >
        <Italic size={16} />
      </button>
      <button
        className={editor.isActive('code') ? 'active' : ''}
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        aria-label="Code"
      >
        <Code2 size={16} />
      </button>
      <button
        className={editor.isActive('blockquote') ? 'active' : ''}
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Block quote"
      >
        <MessageSquare size={16} />
      </button>
      <button
        className={editor.isActive('link') ? 'active' : ''}
        type="button"
        onClick={() => setLink(editor)}
        aria-label="Link"
      >
        <Link size={16} />
      </button>
    </>
  )
}
