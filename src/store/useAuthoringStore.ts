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
  isAuthenticated: boolean
  userName: string
  userEmail: string
  theme: 'light' | 'dark'
  viewMode: 'all' | 'board' | 'graph' | 'recent'
  login: (email: string, password: string) => boolean
  logout: () => void
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
const savedSession =
  typeof localStorage !== 'undefined' ? localStorage.getItem('authoring-session') : null
const parsedSession = savedSession ? JSON.parse(savedSession) as { name?: string; email?: string } : null

export const useAuthoringStore = create<AuthoringState>((set, get) => ({
  tree,
  activeNodeId: firstNodeId(tree),
  isDrawerOpen: false,
  isAuthenticated: Boolean(parsedSession?.email),
  userName: parsedSession?.name ?? 'Fathima Lal',
  userEmail: parsedSession?.email ?? 'fathima.lal@example.com',
  theme: savedTheme,
  viewMode: 'all',
  login: (email, password) => {
    if (!email.trim() || !password.trim()) {
      return false
    }

    const normalizedEmail = email.trim()
    const [namePart] = normalizedEmail.split('@')
    const name = namePart
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
      .join(' ') || 'Course Creator'

    localStorage.setItem('authoring-session', JSON.stringify({ name, email: normalizedEmail }))
    set({ isAuthenticated: true, userName: name, userEmail: normalizedEmail })
    return true
  },
  logout: () => {
    localStorage.removeItem('authoring-session')
    set({ isAuthenticated: false, isDrawerOpen: false })
  },
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
