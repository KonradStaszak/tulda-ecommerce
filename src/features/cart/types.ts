import type { CatalogueProduct, CatalogueVariant, GbpCurrencyCode } from '../../types/catalog'

export interface CartLine {
  productId: string
  productSlug: string
  productName: string
  variantId: string
  variantLabel: string
  priceMinor: number
  currency: GbpCurrencyCode
  quantity: number
  imagePath: string | null
  isInStock: boolean
  unavailableReason: 'missing_variant' | 'out_of_stock' | null
}

export interface AddCartItemInput {
  product: CatalogueProduct
  variant: CatalogueVariant
  quantity: number
}

export interface PersistedCartPayload {
  version: 1
  lines: CartLine[]
}
