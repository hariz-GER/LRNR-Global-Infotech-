import { memo, useState, type CSSProperties } from 'react'
import { ChevronRight, FileText, Folder, FolderPlus, MoreVertical, Plus, Trash2 } from 'lucide-react'
import { useAuthoringStore } from '../../store/useAuthoringStore'
import type { TreeNode } from '../../types/node'

type TreeItemProps = {
  node: TreeNode
  depth: number
}

function TreeItemComponent({ node, depth }: TreeItemProps) {
  const [isOpen, setIsOpen] = useState(true)
  const activeNodeId = useAuthoringStore((state) => state.activeNodeId)
  const setActiveNode = useAuthoringStore((state) => state.setActiveNode)
  const addNode = useAuthoringStore((state) => state.addNode)
  const deleteNode = useAuthoringStore((state) => state.deleteNode)
  const isContainer = node.type === 'container'
  const hasChildren = Boolean(node.children?.length)

  const handleLabelClick = () => {
    setActiveNode(node.id)

    if (isContainer && hasChildren) {
      setIsOpen((value) => !value)
    }
  }

  return (
    <div className="tree-item-group">
      <div
        className={`tree-item ${activeNodeId === node.id ? 'active' : ''}`}
        style={{ '--depth': depth } as CSSProperties}
      >
        <button
          className="tree-label"
          type="button"
          onClick={handleLabelClick}
          aria-current={activeNodeId === node.id ? 'page' : undefined}
          aria-expanded={isContainer && hasChildren ? isOpen : undefined}
        >
          {isContainer ? (
            <ChevronRight className={isOpen ? 'expanded' : ''} size={14} />
          ) : (
            <span className="tree-indent" />
          )}
          {isContainer ? <Folder size={15} /> : <FileText size={15} />}
          <span>{node.label}</span>
        </button>

        <div className="tree-actions">
          {isContainer ? (
            <>
              <button
                className="icon-button tiny has-tooltip"
                type="button"
                onClick={() => {
                  setIsOpen(true)
                  addNode(node.id, 'leaf')
                }}
                aria-label={`Add item to ${node.label}`}
                data-tooltip="Create item"
                title="Create item"
              >
                <Plus size={15} />
              </button>
              <button
                className="icon-button tiny has-tooltip"
                type="button"
                onClick={() => {
                  setIsOpen(true)
                  addNode(node.id, 'container')
                }}
                aria-label={`Add container to ${node.label}`}
                data-tooltip="Create container"
                title="Create container"
              >
                <FolderPlus size={15} />
              </button>
            </>
          ) : null}
          <button
            className="icon-button tiny has-tooltip"
            type="button"
            onClick={() => {
              const shouldDelete = window.confirm(`Delete "${node.label}" and any nested content?`)

              if (shouldDelete) {
                deleteNode(node.id)
              }
            }}
            aria-label={`Delete ${node.label}`}
            data-tooltip="Remove"
            title="Remove"
          >
            <Trash2 size={15} />
          </button>
          <button className="icon-button tiny" type="button" aria-label="More item options">
            <MoreVertical size={15} />
          </button>
        </div>
      </div>

      {hasChildren ? (
        <div className={`tree-children ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
          <div className="tree-children-inner">
            {node.children?.map((child) => (
              <TreeItem key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export const TreeItem = memo(TreeItemComponent)
