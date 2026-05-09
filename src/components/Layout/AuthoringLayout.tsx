import { RichTextEditor } from '../Editor/RichTextEditor'
import { TopBar } from '../Navbar/TopBar'
import { TreePanel } from '../Tree/TreePanel'
import { useAuthoringStore } from '../../store/useAuthoringStore'

export function AuthoringLayout() {
  const theme = useAuthoringStore((state) => state.theme)

  return (
    <div className="app-shell" data-theme={theme}>
      <TopBar />
      <div className="workspace">
        <TreePanel />
        <RichTextEditor />
      </div>
    </div>
  )
}
