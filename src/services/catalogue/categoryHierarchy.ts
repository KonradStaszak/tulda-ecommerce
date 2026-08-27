import type { CatalogueCategory } from '../../types/catalog'

export interface CategoryTreeNode {
  category: CatalogueCategory
  children: CategoryTreeNode[]
}

export function getCategoryTree(categories: CatalogueCategory[]) {
  const nodes = new Map(categories.map((category) => [category.id, { category, children: [] as CategoryTreeNode[] }]))
  const topLevel: CategoryTreeNode[] = []

  for (const node of nodes.values()) {
    const parent = node.category.parentId ? nodes.get(node.category.parentId) : undefined
    if (parent) parent.children.push(node)
    else topLevel.push(node)
  }

  const byName = (left: CategoryTreeNode, right: CategoryTreeNode) => left.category.name.localeCompare(right.category.name)
  for (const node of nodes.values()) node.children.sort(byName)
  return topLevel.sort(byName)
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
