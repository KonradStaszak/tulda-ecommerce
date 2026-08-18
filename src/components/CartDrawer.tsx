import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CartLineItem from '../features/cart/CartLineItem'
import { useCart } from '../features/cart/CartContext'
import { formatMoney } from '../services/catalogue/money'

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, itemCount, subtotalMinor, hasUnavailableItems } = useCart()
  useEffect(() => { const key = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key) }, [onClose])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])
  return <><div className="fixed inset-0 z-50" style={{ backgroundColor: 'rgba(0,0,0,.4)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }} onClick={onClose} aria-hidden="true" /><aside aria-label="Shopping cart" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col transition-transform" style={{ backgroundColor: 'var(--background)', transform: open ? 'translateX(0)' : 'translateX(100%)' }}>
    <header className="flex justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}><div><h2 className="text-xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>YOUR CART</h2><p className="text-xs">{itemCount} items</p></div><button onClick={onClose} aria-label="Close cart">×</button></header>
    <div className="flex-1 overflow-y-auto p-6 space-y-4" aria-live="polite">{lines.length ? lines.map((line) => <CartLineItem key={line.variantId} line={line} compact />) : <div className="text-center py-20"><p>Your cart is empty</p><Link to="/products" onClick={onClose} className="inline-block mt-4 px-4 py-2 rounded-sm" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>SHOP PRODUCTS</Link></div>}</div>
    {lines.length > 0 && <footer className="p-6 border-t" style={{ borderColor: 'var(--border)' }}>{hasUnavailableItems && <p className="text-xs mb-3" style={{ color: '#b45309' }}>Unavailable variants need attention.</p>}<div className="flex justify-between mb-4"><span>Subtotal</span><strong>{formatMoney(subtotalMinor)}</strong></div><Link to="/cart" onClick={onClose} className="block text-center py-3 rounded-sm" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>VIEW CART</Link></footer>}
  </aside></>
}
