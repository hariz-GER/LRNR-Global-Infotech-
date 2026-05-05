import type { Editor } from '@tiptap/react'
import { Bold, Code2, Heading1, Heading2, Heading3, Italic, Link, MessageSquare, Pilcrow } from 'lucide-react'

type EditorToolbarProps = {
  editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="floating-toolbar" aria-label="Text formatting options">
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
      <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} aria-label="Code">
        <Code2 size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} aria-label="Comment">
        <MessageSquare size={16} />
      </button>
      <button type="button" aria-label="Link">
        <Link size={16} />
      </button>
    </div>
  )
}

export function SectionToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="section-toolbar" aria-label="Section formatting options">
      <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} aria-label="Paragraph">
        <Pilcrow size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} aria-label="Heading 1">
        <Heading1 size={17} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} aria-label="Heading 2">
        <Heading2 size={17} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} aria-label="Heading 3">
        <Heading3 size={17} />
      </button>
      <button type="button" aria-label="Link">
        <Link size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} aria-label="Comment">
        <MessageSquare size={16} />
      </button>
    </div>
  )
}
