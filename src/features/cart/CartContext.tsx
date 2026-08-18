import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { CatalogueProduct } from '../../types/catalog'
import type { AddCartItemInput, CartLine, PersistedCartPayload } from './types'

const CART_STORAGE_KEY = 'tulda.cart'
const CART_STORAGE_VERSION = 1 as const

interface CartContextValue {
  lines: CartLine[]
  itemCount: number
  subtotalMinor: number
  hasUnavailableItems: boolean
  addItem: (item: AddCartItemInput) => void
  removeLine: (variantId: string) => void
  increaseQuantity: (variantId: string) => void
  decreaseQuantity: (variantId: string) => void
  setQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== 'object') return false
  const line = value as Partial<CartLine>
  return typeof line.productId === 'string'
    && typeof line.productSlug === 'string'
    && typeof line.productName === 'string'
    && typeof line.variantId === 'string'
    && typeof line.variantLabel === 'string'
    && typeof line.priceMinor === 'number'
    && Number.isInteger(line.priceMinor)
    && line.currency === 'GBP'
    && typeof line.quantity === 'number'
    && Number.isInteger(line.quantity)
    && line.quantity >= 1
    && (typeof line.imagePath === 'string' || line.imagePath === null)
    && typeof line.isInStock === 'boolean'
}

function readStoredCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const payload = JSON.parse(raw) as Partial<PersistedCartPayload>
    if (payload.version !== CART_STORAGE_VERSION || !Array.isArray(payload.lines)) return []
    return payload.lines.filter(isCartLine)
  } catch {
    return []
  }
}

function toCartLine({ product, variant, quantity }: AddCartItemInput): CartLine {
  return {
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    variantId: variant.id,
    variantLabel: variant.label,
    priceMinor: variant.priceMinor,
    currency: variant.currency,
    quantity: Math.max(1, Math.floor(quantity)),
    imagePath: product.primaryImage?.path ?? null,
    isInStock: variant.isInStock,
    unavailableReason: variant.isInStock ? null : 'out_of_stock',
  }
}

interface CartProviderProps extends PropsWithChildren {
  products: CatalogueProduct[]
  catalogueReady: boolean
}

export function CartProvider({ children, products, catalogueReady }: CartProviderProps) {
  const [lines, setLines] = useState<CartLine[]>(readStoredCart)

  useEffect(() => {
    try {
      const payload: PersistedCartPayload = { version: CART_STORAGE_VERSION, lines }
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // Storage can be unavailable (private browsing/quota); keep the in-memory cart usable.
    }
  }, [lines])

  useEffect(() => {
    if (!catalogueReady) return
    setLines((currentLines) => currentLines.map((line) => {
      const product = products.find((candidate) => candidate.id === line.productId)
      const variant = product?.variants.find((candidate) => candidate.id === line.variantId)
      if (!product || !variant) return { ...line, isInStock: false, unavailableReason: 'missing_variant' }
      return {
        ...line,
        productSlug: product.slug,
        productName: product.name,
        variantLabel: variant.label,
        priceMinor: variant.priceMinor,
        currency: variant.currency,
        imagePath: product.primaryImage?.path ?? null,
        isInStock: variant.isInStock,
        unavailableReason: variant.isInStock ? null : 'out_of_stock',
      }
    }))
  }, [catalogueReady, products])

  const addItem = useCallback((item: AddCartItemInput) => {
    const nextLine = toCartLine(item)
    setLines((currentLines) => {
      const existing = currentLines.find((line) => line.variantId === nextLine.variantId)
      if (!existing) return [...currentLines, nextLine]
      return currentLines.map((line) => line.variantId === nextLine.variantId
        ? { ...nextLine, quantity: line.quantity + nextLine.quantity }
        : line)
    })
  }, [])

  const removeLine = useCallback((variantId: string) => setLines((currentLines) => currentLines.filter((line) => line.variantId !== variantId)), [])
  const setQuantity = useCallback((variantId: string, quantity: number) => setLines((currentLines) => currentLines.map((line) => line.variantId === variantId ? { ...line, quantity: Math.max(1, Math.floor(quantity) || 1) } : line)), [])
  const increaseQuantity = useCallback((variantId: string) => setQuantity(variantId, (lines.find((line) => line.variantId === variantId)?.quantity ?? 1) + 1), [lines, setQuantity])
  const decreaseQuantity = useCallback((variantId: string) => setQuantity(variantId, Math.max(1, (lines.find((line) => line.variantId === variantId)?.quantity ?? 1) - 1)), [lines, setQuantity])
  const clearCart = useCallback(() => setLines([]), [])

  const value = useMemo<CartContextValue>(() => ({
    lines,
    itemCount: lines.reduce((total, line) => total + line.quantity, 0),
    subtotalMinor: lines.reduce((total, line) => total + line.priceMinor * line.quantity, 0),
    hasUnavailableItems: lines.some((line) => !line.isInStock),
    addItem,
    removeLine,
    increaseQuantity,
    decreaseQuantity,
    setQuantity,
    clearCart,
  }), [addItem, clearCart, decreaseQuantity, increaseQuantity, lines, removeLine, setQuantity])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider.')
  return context
}
