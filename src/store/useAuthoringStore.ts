import { create } from 'zustand'
import type { ContentBlock, NodeType, TreeNode } from '../types/node'
import {
  addChildNode,
  createNode,
  deleteNodeById,
  findNode,
  firstNodeId,
  initialTree,
  updateNodeContent,
} from '../utils/tree'
import { loadFromLocal, saveToLocal } from '../utils/localStorage'

type AuthoringState = {
  tree: TreeNode[]
  activeNodeId: string | null
  isDrawerOpen: boolean
  theme: 'light' | 'dark'
  viewMode: 'all' | 'board' | 'graph' | 'recent'
  setActiveNode: (id: string) => void
  setViewMode: (mode: AuthoringState['viewMode']) => void
  toggleDrawer: () => void
  toggleTheme: () => void
  addNode: (parentId: string | null, type: NodeType) => void
  deleteNode: (nodeId: string) => void
  updateContent: (nodeId: string, content: Partial<ContentBlock>) => void
}

const savedTree = loadFromLocal()
const tree = savedTree.length ? savedTree : initialTree
const savedTheme =
  typeof localStorage !== 'undefined' && localStorage.getItem('authoring-theme') === 'dark'
    ? 'dark'
    : 'light'

export const useAuthoringStore = create<AuthoringState>((set, get) => ({
  tree,
  activeNodeId: firstNodeId(tree),
  isDrawerOpen: false,
  theme: savedTheme,
  viewMode: 'all',
  setActiveNode: (id) => set({ activeNodeId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === 'dark' ? 'light' : 'dark'

      localStorage.setItem('authoring-theme', theme)
      return { theme }
    }),
  addNode: (parentId, type) => {
    const parent = findNode(get().tree, parentId)
    const siblingCount = parentId ? (parent?.children?.length ?? 0) : get().tree.length
    const newNode = createNode(type, siblingCount)
    const nextTree = addChildNode(get().tree, parentId, newNode)

    saveToLocal(nextTree)
    set({ tree: nextTree, activeNodeId: newNode.id })
  },
  deleteNode: (nodeId) => {
    const nextTree = deleteNodeById(get().tree, nodeId)
    const nextActiveNodeId =
      get().activeNodeId === nodeId ? firstNodeId(nextTree) : get().activeNodeId

    saveToLocal(nextTree)
    set({ tree: nextTree, activeNodeId: nextActiveNodeId })
  },
  updateContent: (nodeId, content) => {
    const nextTree = updateNodeContent(get().tree, nodeId, content)

    saveToLocal(nextTree)
    set({ tree: nextTree })
  },
}))

export const useActiveNode = () =>
  useAuthoringStore((state) => findNode(state.tree, state.activeNodeId))
