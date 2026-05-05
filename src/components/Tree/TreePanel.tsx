import { ChevronLeft, ChevronsLeft, FilePlus2, FolderPlus, Plus } from 'lucide-react'
import { useAuthoringStore } from '../../store/useAuthoringStore'
import { TreeItem } from './TreeItem'

export function TreePanel() {
  const tree = useAuthoringStore((state) => state.tree)
  const addNode = useAuthoringStore((state) => state.addNode)

  return (
    <aside className="tree-panel">
      <div className="tree-heading">
        <span>DFIN</span>
        <div className="tree-heading-actions">
          <button
            className="icon-button tiny has-tooltip"
            type="button"
            onClick={() => addNode(null, 'container')}
            aria-label="Create root container"
            data-tooltip="Create container"
          >
            <FolderPlus size={16} />
          </button>
          <button
            className="icon-button tiny has-tooltip"
            type="button"
            onClick={() => addNode(null, 'leaf')}
            aria-label="Create root item"
            data-tooltip="Create item"
          >
            <FilePlus2 size={16} />
          </button>
          <button className="icon-button tiny" type="button" aria-label="Expand workspace">
            <ChevronLeft size={16} />
          </button>
          <button className="icon-button tiny" type="button" aria-label="Collapse workspace">
            <ChevronsLeft size={16} />
          </button>
        </div>
      </div>

      <div className="tree-scroll">
        {tree.map((node) => (
          <TreeItem key={node.id} node={node} depth={0} />
        ))}
      </div>

      <button className="mobile-add-button" type="button" onClick={() => addNode(null, 'leaf')}>
        <Plus size={18} />
      </button>
    </aside>
  )
}
