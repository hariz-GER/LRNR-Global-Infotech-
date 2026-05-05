import type { TreeNode } from '../types/node'

const STORAGE_KEY = 'authoring-tree'

export const saveToLocal = (tree: TreeNode[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tree))
}

export const loadFromLocal = (): TreeNode[] => {
  const value = localStorage.getItem(STORAGE_KEY)

  if (!value) {
    return []
  }

  try {
    return JSON.parse(value) as TreeNode[]
  } catch {
    return []
  }
}
