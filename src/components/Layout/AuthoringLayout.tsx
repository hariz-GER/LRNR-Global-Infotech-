import { RichTextEditor } from '../Editor/RichTextEditor'
import { TopBar } from '../Navbar/TopBar'
import { TreePanel } from '../Tree/TreePanel'

export function AuthoringLayout() {
  return (
    <div className="app-shell">
      <TopBar />
      <div className="workspace">
        <TreePanel />
        <RichTextEditor />
      </div>
    </div>
  )
}
