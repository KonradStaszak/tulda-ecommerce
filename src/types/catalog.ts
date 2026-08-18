export type CategoryId = 'clearcoat' | 'primer' | 'abrasives' | 'filler' | 'thinner' | 'kits'

export type CategoryName = 'Clearcoats' | 'Primers' | 'Abrasives' | 'Fillers' | 'Thinners' | 'Kits'

export type CategorySlug = 'clearcoats' | 'primers' | 'abrasives' | 'fillers' | 'thinners' | 'kits'

export type ProductCategoryLabel = 'Clearcoat' | 'Primer' | 'Abrasives' | 'Filler' | 'Thinner' | 'Kit'

/** The current storefront displays all catalogue prices in pounds sterling. */
export type CurrencyCode = '£'

export interface ProductVariant {
  label: string
  price: number
}

export interface Product {
  id: string
  code: string
  name: string
  shortName: string
  category: CategoryId
  categoryLabel: ProductCategoryLabel
  priceFrom: number
  priceTo?: number
  currency: CurrencyCode
  description: string
  keySpec: string
  badge?: 'Best Seller' | 'Popular' | 'Versatile'
  isNew?: boolean
  inStock: boolean
  accentColor: string
  bottleColor: string
  sizes: ProductVariant[]
  addedAt: `${number}-${number}-${number}`
}

export interface Category {
  id: CategoryId
  name: CategoryName
  slug: CategorySlug
  description: string
  count: number
  image: string
  color: string
}

export interface CartLine {
  product: Product
  quantity: number
  size: ProductVariant['label']
}

/** Retained while the existing cart implementation still uses this name. */
export type CartItem = CartLine

export type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'newest'

export interface FilterState {
  categories: string[]
  inStockOnly: boolean
  sizes: ProductVariant['label'][]
  search: string
  sort: SortKey
  page: number
}

/** UI-facing catalogue model mapped from Supabase rows. */
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
