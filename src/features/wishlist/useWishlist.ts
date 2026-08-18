import { useEffect, useState } from 'react'

const WISHLIST_STORAGE_KEY = 'tulda.wishlist'
const WISHLIST_STORAGE_VERSION = 1

function readWishlist() {
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY)
    const payload = raw ? JSON.parse(raw) : null
    return payload?.version === WISHLIST_STORAGE_VERSION && Array.isArray(payload.productIds)
      ? payload.productIds.filter((id: unknown): id is string => typeof id === 'string')
      : []
  } catch {
    return []
  }
}

export function useWishlist() {
  const [productIds, setProductIds] = useState<string[]>(readWishlist)

  useEffect(() => {
    try { window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify({ version: WISHLIST_STORAGE_VERSION, productIds })) } catch { /* Keep the in-memory wishlist available. */ }
  }, [productIds])

  const toggle = (productId: string) => setProductIds((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId])
  return { productIds, toggle }
}
