import { supabase } from '../../lib/supabase'
import type {
  CatalogueCategory,
  CatalogueImage,
  CatalogueProduct,
  CatalogueVariant,
  GbpCurrencyCode,
} from '../../types/catalog'
import type { CategoryRow, ProductCategoryRow, ProductImageRow, ProductRow, ProductVariantRow, TechnicalDocumentRow } from './types'

export interface CatalogueData {
  categories: CatalogueCategory[]
  products: CatalogueProduct[]
}

export interface CatalogueTechnicalDocument {
  id: string
  productId: string
  productName: string
  productSlug: string
  title: string
  documentType: string
  externalUrl: string | null
  storagePath: string | null
  version: string | null
  publishedAt: string | null
}

export interface CatalogueTechnicalDocument {
  id: string
  title: string
  documentType: string
  externalUrl: string | null
  storagePath: string | null
  version: string | null
  publishedAt: string | null
}

let cataloguePromise: Promise<CatalogueData> | null = null

function requireData<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(`Unable to load the Tulda catalogue: ${error.message}`)
  if (data === null) throw new Error('Unable to load the Tulda catalogue: Supabase returned no data.')
  return data
}

function toCurrency(value: string): GbpCurrencyCode {
  if (value !== 'GBP') throw new Error(`Unsupported catalogue currency: ${value}`)
  return value
}

const namedHtmlEntities: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  hellip: '…',
  lt: '<',
  nbsp: ' ',
  ndash: '–',
  quot: '"',
  rsquo: '’',
}

function decodeHtmlEntities(value: string) {
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, token: string) => {
    const normalized = token.toLowerCase()
    if (normalized.startsWith('#x')) {
      const codePoint = Number.parseInt(normalized.slice(2), 16)
      return Number.isNaN(codePoint) ? entity : String.fromCodePoint(codePoint)
    }
    if (normalized.startsWith('#')) {
      const codePoint = Number.parseInt(normalized.slice(1), 10)
      return Number.isNaN(codePoint) ? entity : String.fromCodePoint(codePoint)
    }
    return namedHtmlEntities[normalized] ?? entity
  })
}

function plainText(value: string | null) {
  const stripped = value?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return stripped ? decodeHtmlEntities(stripped) : null
}

function categoryColor(slug: string) {
  const palette = ['#1c3a5e', '#2d4a22', '#3d2020', '#3d2a18', '#1a2d3d', '#1c1c1e']
  return palette[[...slug].reduce((total, character) => total + character.charCodeAt(0), 0) % palette.length]
}

function displayCategoryName(name: string, slug: string) {
  return slug === 'thinner' ? 'Thinner' : decodeHtmlEntities(name)
}

function mapCatalogue(
  categoryRows: CategoryRow[],
  productRows: ProductRow[],
  productCategoryRows: ProductCategoryRow[],
  variantRows: ProductVariantRow[],
  imageRows: ProductImageRow[],
): CatalogueData {
  const categoriesById = new Map(categoryRows.map((category) => [category.id, category]))
  const categoryIdsByProductId = new Map<string, string[]>()
  for (const relationship of productCategoryRows) {
    const ids = categoryIdsByProductId.get(relationship.product_id) ?? []
    ids.push(relationship.category_id)
    categoryIdsByProductId.set(relationship.product_id, ids)
  }
  const productCounts = new Map<string, number>()
  for (const relationship of productCategoryRows) {
    productCounts.set(relationship.category_id, (productCounts.get(relationship.category_id) ?? 0) + 1)
  }
  const variantsByProductId = new Map<string, CatalogueVariant[]>()
  for (const variant of variantRows) {
    const mapped: CatalogueVariant = {
      id: variant.id,
      woocommerceId: variant.woocommerce_id,
      sku: variant.sku,
      label: decodeHtmlEntities(variant.label),
      priceMinor: variant.price_minor,
      currency: toCurrency(variant.currency),
      stockQuantity: variant.stock_quantity,
      isInStock: variant.is_in_stock,
      sortOrder: variant.sort_order,
    }
    const variants = variantsByProductId.get(variant.product_id) ?? []
    variants.push(mapped)
    variantsByProductId.set(variant.product_id, variants)
  }
  const imagesByProductId = new Map<string, CatalogueImage[]>()
  for (const image of imageRows) {
    const images = imagesByProductId.get(image.product_id) ?? []
    images.push({ id: image.id, path: image.storage_path, altText: image.alt_text, sortOrder: image.sort_order, isPrimary: image.is_primary })
    imagesByProductId.set(image.product_id, images)
  }

  const products = productRows.map((product) => {
    const variants = (variantsByProductId.get(product.id) ?? []).sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label))
    if (variants.length === 0) throw new Error(`Catalogue product ${product.slug} has no variants.`)
    const galleryImages = (imagesByProductId.get(product.id) ?? []).sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)
    const categoryList = (categoryIdsByProductId.get(product.id) ?? [])
      .map((categoryId) => categoriesById.get(categoryId))
      .filter((category): category is CategoryRow => Boolean(category))
      .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
      .map((category) => ({
        id: category.id,
        woocommerceId: category.woocommerce_id,
        slug: category.slug,
        name: displayCategoryName(category.name, category.slug),
        description: plainText(category.description),
        parentId: category.parent_id,
        productCount: productCounts.get(category.id) ?? 0,
        image: null,
        color: categoryColor(category.slug),
      }))
    return {
      id: product.id,
      woocommerceId: product.woocommerce_id,
      slug: product.slug,
      code: product.code ?? variants.find((variant) => variant.sku)?.sku ?? null,
      name: decodeHtmlEntities(product.name),
      shortDescription: plainText(product.short_description),
      description: plainText(product.description),
      categories: categoryList,
      variants,
      minimumPriceMinor: Math.min(...variants.map((variant) => variant.priceMinor)),
      currency: variants[0].currency,
      isInStock: variants.some((variant) => variant.isInStock),
      primaryImage: galleryImages.find((image) => image.isPrimary) ?? galleryImages[0] ?? null,
      galleryImages,
      createdAt: product.created_at,
    } satisfies CatalogueProduct
  }).sort((a, b) => a.name.localeCompare(b.name))

  const firstProductImageByCategoryId = new Map<string, string>()
  for (const product of products) {
    for (const category of product.categories) {
      if (product.primaryImage && !firstProductImageByCategoryId.has(category.id)) {
        firstProductImageByCategoryId.set(category.id, product.primaryImage.path)
      }
    }
  }
  const categories = categoryRows.map((category) => ({
    id: category.id,
    woocommerceId: category.woocommerce_id,
    slug: category.slug,
    name: displayCategoryName(category.name, category.slug),
    description: plainText(category.description),
    parentId: category.parent_id,
    productCount: productCounts.get(category.id) ?? 0,
    image: firstProductImageByCategoryId.get(category.id) ?? null,
    color: categoryColor(category.slug),
  })).sort((a, b) => a.name.localeCompare(b.name))

  return { categories, products }
}

export async function getCatalogue(): Promise<CatalogueData> {
  if (!cataloguePromise) {
    cataloguePromise = (async () => {
      const [categoriesResult, productsResult, relationshipsResult, variantsResult, imagesResult] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('products').select('*').eq('is_active', true).order('name'),
        supabase.from('product_categories').select('*'),
        supabase.from('product_variants').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('product_images').select('*').order('sort_order'),
      ])
      return mapCatalogue(
        requireData(categoriesResult.data, categoriesResult.error),
        requireData(productsResult.data, productsResult.error),
        requireData(relationshipsResult.data, relationshipsResult.error),
        requireData(variantsResult.data, variantsResult.error),
        requireData(imagesResult.data, imagesResult.error),
      )
    })().catch((error) => {
      cataloguePromise = null
      throw error
    })
  }
  return cataloguePromise
}

export async function getProducts() {
  return (await getCatalogue()).products
}

export async function getCategories() {
  return (await getCatalogue()).categories
}

export async function getProductBySlug(slug: string) {
  return (await getCatalogue()).products.find((product) => product.slug === slug) ?? null
}

export async function getTechnicalDocumentsByProductId(productId: string): Promise<CatalogueTechnicalDocument[]> {
  const result = await supabase.from('technical_documents').select('*').eq('product_id', productId).order('published_at', { ascending: false })
  const product = (await getCatalogue()).products.find((candidate) => candidate.id === productId)
  return requireData(result.data, result.error).map((document: TechnicalDocumentRow) => ({
    id: document.id,
    productId: document.product_id ?? productId,
    productName: product?.name ?? 'Tulda product',
    productSlug: product?.slug ?? '',
    title: document.title,
    documentType: document.document_type,
    externalUrl: document.external_url,
    storagePath: document.storage_path,
    version: document.version,
    publishedAt: document.published_at,
  }))
}

export async function getTechnicalDocuments(): Promise<CatalogueTechnicalDocument[]> {
  const [catalogue, result] = await Promise.all([getCatalogue(), supabase.from('technical_documents').select('*').order('title')])
  const productsById = new Map(catalogue.products.map((product) => [product.id, product]))
  return requireData(result.data, result.error).flatMap((document: TechnicalDocumentRow) => {
    const product = document.product_id ? productsById.get(document.product_id) : undefined
    if (!product) return []
    return [{
      id: document.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      title: document.title,
      documentType: document.document_type,
      externalUrl: document.external_url,
      storagePath: document.storage_path,
      version: document.version,
      publishedAt: document.published_at,
    }]
  })
}

export async function getProductsByCategory(slug: string) {
  return (await getCatalogue()).products.filter((product) => product.categories.some((category) => category.slug === slug))
}

export async function searchProducts(query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  if (!normalizedQuery) return getProducts()
  return (await getCatalogue()).products.filter((product) => [
    product.name,
    product.code,
    product.shortDescription,
    ...product.categories.map((category) => category.name),
    ...product.variants.map((variant) => variant.sku),
  ].some((value) => value?.toLocaleLowerCase().includes(normalizedQuery)))
}

export function filterProducts(products: CatalogueProduct[], filters: { categories: string[]; inStockOnly: boolean; sizes: string[]; search: string; sort: string }) {
  const query = filters.search.trim().toLocaleLowerCase()
  const filtered = products.filter((product) => {
    const searchMatches = !query || [product.name, product.code, product.shortDescription, ...product.categories.map((category) => category.name), ...product.variants.map((variant) => variant.sku)]
      .some((value) => value?.toLocaleLowerCase().includes(query))
    const categoryMatches = filters.categories.length === 0 || product.categories.some((category) => filters.categories.includes(category.id))
    const stockMatches = !filters.inStockOnly || product.isInStock
    const sizeMatches = filters.sizes.length === 0 || product.variants.some((variant) => filters.sizes.some((size) => variant.label.includes(size)))
    return searchMatches && categoryMatches && stockMatches && sizeMatches
  })
  return filtered.sort((a, b) => {
    if (filters.sort === 'price-asc') return a.minimumPriceMinor - b.minimumPriceMinor
    if (filters.sort === 'price-desc') return b.minimumPriceMinor - a.minimumPriceMinor
    if (filters.sort === 'newest') return b.createdAt.localeCompare(a.createdAt)
    return a.name.localeCompare(b.name)
  })
}
