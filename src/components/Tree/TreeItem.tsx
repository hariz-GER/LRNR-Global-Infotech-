import { memo, useState } from 'react'
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

  return (
    <div className="tree-item-group">
      <div
        className={`tree-item ${activeNodeId === node.id ? 'active' : ''}`}
        style={{ '--depth': depth } as React.CSSProperties}
      >
        <button
          className="tree-label"
          type="button"
          onClick={() => setActiveNode(node.id)}
          aria-current={activeNodeId === node.id ? 'page' : undefined}
        >
          {isContainer ? (
            <ChevronRight
              className={isOpen ? 'expanded' : ''}
              size={14}
              onClick={(event) => {
                event.stopPropagation()
                setIsOpen((value) => !value)
              }}
            />
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
                onClick={() => addNode(node.id, 'leaf')}
                aria-label={`Add item to ${node.label}`}
                data-tooltip="Create item"
              >
                <Plus size={15} />
              </button>
              <button
                className="icon-button tiny has-tooltip"
                type="button"
                onClick={() => addNode(node.id, 'container')}
                aria-label={`Add container to ${node.label}`}
                data-tooltip="Create container"
              >
                <FolderPlus size={15} />
              </button>
            </>
          ) : null}
          <button
            className="icon-button tiny has-tooltip"
            type="button"
            onClick={() => deleteNode(node.id)}
            aria-label={`Delete ${node.label}`}
            data-tooltip="Remove"
          >
            <Trash2 size={15} />
          </button>
          <button className="icon-button tiny" type="button" aria-label="More item options">
            <MoreVertical size={15} />
          </button>
        </div>
      </div>

      {isOpen && hasChildren ? (
        <div>
          {node.children?.map((child) => (
            <TreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export const TreeItem = memo(TreeItemComponent)
