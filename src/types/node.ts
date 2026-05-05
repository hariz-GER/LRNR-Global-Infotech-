export type NodeType = 'container' | 'leaf'

export type ContentBlock = {
  title: string
  body: string
  widgets: string[]
}

export type TreeNode = {
  id: string
  label: string
  type: NodeType
  content: ContentBlock
  children?: TreeNode[]
}
