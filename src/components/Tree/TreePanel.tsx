import { forwardRef } from 'react'
import { ChevronLeft, ChevronsLeft, Plus } from 'lucide-react'
import { TREE_ROOT_ACTIONS } from '../../constants/authoring'
import { useAuthoringStore } from '../../store/useAuthoringStore'
import { TreeItem } from './TreeItem'

type TreePanelProps = {
  isOpen: boolean
  onClose: () => void
}

export const TreePanel = forwardRef<HTMLElement, TreePanelProps>(function TreePanel(
  { isOpen, onClose },
  ref,
) {
  const tree = useAuthoringStore((state) => state.tree)
  const addNode = useAuthoringStore((state) => state.addNode)

  return (
    <aside className="tree-panel" ref={ref} aria-hidden={!isOpen}>
      <div className="tree-heading">
        <div>
          <span>DFIN</span>
          <strong>Course outline</strong>
        </div>
        <div className="tree-heading-actions">
          {TREE_ROOT_ACTIONS.map((action) => {
            const Icon = action.icon

            return (
              <button
                className="icon-button tiny has-tooltip"
                key={action.type}
                type="button"
                onClick={() => addNode(null, action.type)}
                aria-label={action.label}
                data-tooltip={action.label}
                title={action.label}
              >
                <Icon size={16} />
              </button>
            )
          })}
          <button className="icon-button tiny" type="button" aria-label="Expand workspace">
            <ChevronLeft size={16} />
          </button>
          <button
            className="icon-button tiny"
            type="button"
            onClick={onClose}
            aria-label="Collapse workspace"
          >
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
})
