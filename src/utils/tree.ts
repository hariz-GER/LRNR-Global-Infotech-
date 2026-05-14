import type { ContentBlock, NodeType, TreeNode } from '../types/node'

const paragraph =
  '<p><strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit. Donec aliquet sagittis ex, vel euismod odio rutrum iaculis. Donec massa leo, elementum non tempus sit amet, tempor et magna.</p><h2>Topic name</h2><p>Fusce sapien lacus, posuere in tempor vel, fringilla id ipsum. Donec varius, ante quis accumsan viverra, quam mi accumsan urna, sed tempor ante ex efficitur ipsum.</p>'

export const createContent = (title: string): ContentBlock => ({
  title,
  body: paragraph,
  widgets: [],
})

export const initialTree: TreeNode[] = [
  {
    id: 'collection-1-1',
    label: 'collection.1.1',
    type: 'container',
    content: createContent('collection.1.1'),
    children: [
      {
        id: 'collection-1-1-1',
        label: 'collection.1.1.1',
        type: 'container',
        content: createContent('collection.1.1.1'),
        children: [
          {
            id: 'content-page-1-1-1-1',
            label: 'Content Page 1.1.1.1',
            type: 'leaf',
            content: createContent('Content Page 1.1.1.1'),
          },
          {
            id: 'quiz',
            label: 'Quiz',
            type: 'leaf',
            content: {
              title: 'Quiz',
              body: '<h2>Quiz</h2><p>Add question prompts, options, and feedback notes here.</p>',
              widgets: ['Assessment item'],
            },
          },
          {
            id: 'videos',
            label: 'Videos',
            type: 'leaf',
            content: {
              title: 'Videos',
              body: '<h2>Videos</h2><p>Use the widget controls to add supporting media and notes.</p>',
              widgets: ['Video'],
            },
          },
          {
            id: 'wysiwyg-editor',
            label: 'WYSIWYG Editor',
            type: 'leaf',
            content: createContent('WYSIWYG Editor'),
          },
        ],
      },
      {
        id: 'collection-1-2',
        label: 'collection.1.2',
        type: 'container',
        content: createContent('collection.1.2'),
        children: [],
      },
    ],
  },

  
  {
    id: 'collection-2',
    label: 'collection.2',
    type: 'container',
    content: createContent('collection.2'),
    children: [
      {
        id: 'collection-2-1',
        label: 'collection.2.1',
        type: 'container',
        content: createContent('collection.2.1'),
        children: [],
      },
    ],
  },
  ...[3, 4, 5].map((index) => ({
    id: `collection-${index}`,
    label: `collection.${index}`,
    type: 'container' as const,
    content: createContent(`collection.${index}`),
    children: [],
  })),
]

export const createNode = (type: NodeType, siblingCount = 0): TreeNode => {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  const labelPrefix = type === 'container' ? 'collection' : 'Content Page'
  const label = `${labelPrefix} ${siblingCount + 1}`

  return {
    id,
    label,
    type,
    content: createContent(label),
    children: type === 'container' ? [] : undefined,
  }
}

export const addChildNode = (
  nodes: TreeNode[],
  parentId: string | null,
  newNode: TreeNode,
): TreeNode[] => {
  if (!parentId) {
    return [...nodes, newNode]
  }

  return nodes.map((node) => {
    if (node.id === parentId && node.type === 'container') {
      return {
        ...node,
        children: [...(node.children ?? []), newNode],
      }
    }

    return {
      ...node,
      children: node.children ? addChildNode(node.children, parentId, newNode) : node.children,
    }
  })
}

export const deleteNodeById = (nodes: TreeNode[], nodeId: string): TreeNode[] =>
  nodes
    .filter((node) => node.id !== nodeId)
    .map((node) => ({
      ...node,
      children: node.children ? deleteNodeById(node.children, nodeId) : node.children,
    }))

export const updateNodeContent = (
  nodes: TreeNode[],
  nodeId: string,
  content: Partial<ContentBlock>,
): TreeNode[] =>
  nodes.map((node) => {
    if (node.id === nodeId) {
      return {
        ...node,
        label: content.title ?? node.label,
        content: {
          ...node.content,
          ...content,
        },
      }
    }

    return {
      ...node,
      children: node.children ? updateNodeContent(node.children, nodeId, content) : node.children,
    }
  })

export const findNode = (nodes: TreeNode[], id: string | null): TreeNode | null => {
  if (!id) {
    return null
  }

  for (const node of nodes) {
    if (node.id === id) {
      return node
    }

    const child = findNode(node.children ?? [], id)

    if (child) {
      return child
    }
  }

  return null
}

export const firstNodeId = (nodes: TreeNode[]): string | null => {
  const [node] = nodes

  if (!node) {
    return null
  }

  if (node.children?.length) {
    return firstNodeId(node.children) ?? node.id
  }

  return node.id
}
