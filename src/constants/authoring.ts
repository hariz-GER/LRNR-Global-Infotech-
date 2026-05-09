import { ClipboardCheck, FilePlus2, FolderPlus, Grid2X2, Image, ListTree, PlaySquare } from 'lucide-react'

export const VIEW_MODES = [
  { id: 'all', label: 'All', icon: ListTree },
  { id: 'board', label: 'Board', icon: ListTree },
  { id: 'graph', label: 'Graph', icon: Grid2X2 },
  { id: 'recent', label: 'Recent', icon: ListTree },
] as const

export const MEDIA_WIDGETS = [
  { id: 'image', label: 'Image', icon: Image, accept: 'image/*' },
  { id: 'video', label: 'Video', icon: PlaySquare, accept: 'video/*' },
] as const

export const TREE_ROOT_ACTIONS = [
  { type: 'container', label: 'Create container', icon: FolderPlus },
  { type: 'leaf', label: 'Create item', icon: FilePlus2 },
] as const

export const ASSESSMENT_WIDGET = {
  id: 'assessment',
  label: 'Assessment item',
  icon: ClipboardCheck,
} as const

export const EDITOR_SAVE_DELAY_MS = 450
