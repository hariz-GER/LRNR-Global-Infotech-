import { useEffect, useRef, useState } from 'react'
import { PanelLeftOpen } from 'lucide-react'
import { RichTextEditor } from '../Editor/RichTextEditor'
import { TopBar } from '../Navbar/TopBar'
import { TreePanel } from '../Tree/TreePanel'
import { useAuthoringStore } from '../../store/useAuthoringStore'

export function AuthoringLayout() {
  const theme = useAuthoringStore((state) => state.theme)
  const [isTreePanelOpen, setIsTreePanelOpen] = useState(true)
  const treePanelRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isTreePanelOpen) {
      return undefined
    }

    const closeTreePanelOnOutsideClick = (event: PointerEvent) => {
      if (!window.matchMedia('(max-width: 900px)').matches) {
        return
      }

      const target = event.target

      if (target instanceof Node && !treePanelRef.current?.contains(target)) {
        setIsTreePanelOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeTreePanelOnOutsideClick)

    return () => {
      document.removeEventListener('pointerdown', closeTreePanelOnOutsideClick)
    }
  }, [isTreePanelOpen])

  return (
    <div className="app-shell" data-theme={theme}>
      <TopBar />
      <div className={`workspace ${isTreePanelOpen ? '' : 'tree-panel-closed'}`}>
        {isTreePanelOpen ? (
          <TreePanel ref={treePanelRef} onClose={() => setIsTreePanelOpen(false)} />
        ) : (
          <button
            className="tree-panel-open-button"
            type="button"
            onClick={() => setIsTreePanelOpen(true)}
            aria-label="Open tree panel"
            title="Open tree panel"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}
        <RichTextEditor />
      </div>
    </div>
  )
}
