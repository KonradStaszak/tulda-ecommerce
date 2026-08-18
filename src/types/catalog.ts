export type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'newest'

export interface FilterState {
  categories: string[]
  inStockOnly: boolean
  sizes: string[]
  search: string
  sort: SortKey
  page: number
}

export type GbpCurrencyCode = 'GBP'

export interface CatalogueImage {
  id: string
  path: string
  altText: string | null
  sortOrder: number
  isPrimary: boolean
}

export interface CatalogueVariant {
  id: string
  woocommerceId: number | null
  sku: string | null
  label: string
  priceMinor: number
  currency: GbpCurrencyCode
  stockQuantity: number | null
  isInStock: boolean
  sortOrder: number
}

export interface CatalogueCategory {
  id: string
  woocommerceId: number | null
  slug: string
  name: string
  description: string | null
  parentId: string | null
  productCount: number
  image: string | null
  color: string
}

export interface CatalogueProduct {
  id: string
  woocommerceId: number | null
  slug: string
  code: string | null
  name: string
  shortDescription: string | null
  description: string | null
  categories: CatalogueCategory[]
  variants: CatalogueVariant[]
  minimumPriceMinor: number
  currency: GbpCurrencyCode
  isInStock: boolean
  primaryImage: CatalogueImage | null
  galleryImages: CatalogueImage[]
  createdAt: string
}

export interface CatalogueCartLine {
  product: CatalogueProduct
  variant: CatalogueVariant
  size: string
  quantity: number
}
