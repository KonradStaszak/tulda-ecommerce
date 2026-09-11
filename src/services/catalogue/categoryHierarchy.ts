import type { CatalogueCategory } from '../../types/catalog'

export interface CategoryTreeNode {
  category: CatalogueCategory
  children: CategoryTreeNode[]
}

const processOrder = ['abrasives', 'filler', 'primer', 'thinner', 'clearcoat', 'kits', 'industrial']

function compareCategories(left: CategoryTreeNode, right: CategoryTreeNode) {
  const leftIndex = processOrder.indexOf(left.category.slug)
  const rightIndex = processOrder.indexOf(right.category.slug)
  return (leftIndex === -1 ? processOrder.length : leftIndex) - (rightIndex === -1 ? processOrder.length : rightIndex)
    || left.category.name.localeCompare(right.category.name)
}

export function getCategoryTree(categories: CatalogueCategory[]) {
  const nodes = new Map(categories.map((category) => [category.id, { category, children: [] as CategoryTreeNode[] }]))
  const topLevel: CategoryTreeNode[] = []

  for (const node of nodes.values()) {
    const parent = node.category.parentId ? nodes.get(node.category.parentId) : undefined
    if (parent) parent.children.push(node)
    else topLevel.push(node)
  }

  for (const node of nodes.values()) node.children.sort(compareCategories)
  return topLevel.sort(compareCategories)
}

export function getCategoryAncestors(category: CatalogueCategory, categories: CatalogueCategory[]) {
  const byId = new Map(categories.map((candidate) => [candidate.id, candidate]))
  const ancestors: CatalogueCategory[] = []
  let parentId = category.parentId

  while (parentId) {
    const parent = byId.get(parentId)
    if (!parent) break
    ancestors.unshift(parent)
    parentId = parent.parentId
  }

  return ancestors
}
