import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export function useWishlist() {
  const [productIds, setProductIds] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUserId(session?.user.id ?? null))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!userId) return
    const customerDb = supabase as unknown as { from: (table: string) => any }
    customerDb.from('customer_favorites').select('product_id').eq('user_id', userId)
      .then(({ data }: { data: Array<{ product_id: string }> | null }) => {
        if (data) setProductIds(data.map((favorite) => favorite.product_id))
      })
  }, [userId])

  const toggle = (productId: string) => setProductIds((current) => {
    const isFavorite = current.includes(productId)
    if (!userId) return current
    const customerDb = supabase as unknown as { from: (table: string) => any }
    if (isFavorite) void customerDb.from('customer_favorites').delete().eq('user_id', userId).eq('product_id', productId)
    else void customerDb.from('customer_favorites').insert({ user_id: userId, product_id: productId })
    return isFavorite ? current.filter((id) => id !== productId) : [...current, productId]
  })
  return { productIds, toggle, isAuthenticated: Boolean(userId) }
}
