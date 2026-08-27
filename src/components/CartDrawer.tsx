import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CartLineItem from '../features/cart/CartLineItem'
import { useCart } from '../features/cart/CartContext'
import { formatMoney } from '../services/catalogue/money'

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, itemCount, subtotalMinor, hasUnavailableItems } = useCart()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return <>
    <div className="fixed inset-0 z-50 transition-opacity duration-200" style={{ backgroundColor: 'rgba(0,0,0,.42)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }} onClick={onClose} aria-hidden="true" />
    <aside aria-label="Shopping cart" aria-hidden={!open} className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] min-w-0 flex-col overflow-x-hidden transition-transform duration-200" style={{ backgroundColor: 'var(--background)', transform: open ? 'translateX(0)' : 'translateX(100%)', boxShadow: '-12px 0 32px rgba(0,0,0,.12)' }}>
      <header className="flex justify-between p-5 sm:p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div><h2 className="text-2xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>YOUR CART</h2><p className="mt-0.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>{itemCount} items</p></div>
        <button onClick={onClose} className="min-w-11 min-h-11 -mr-2 flex items-center justify-center text-xl" aria-label="Close cart">×</button>
      </header>
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5" aria-live="polite">
        {lines.length ? lines.map((line) => <CartLineItem key={line.variantId} line={line} compact />) : <div className="text-center py-20"><p className="font-semibold">Your cart is empty</p><Link to="/products" onClick={onClose} className="tulda-button mt-5">SHOP PRODUCTS</Link></div>}
      </div>
      {lines.length > 0 && <footer className="p-5 sm:p-6 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
        {hasUnavailableItems && <p className="text-xs mb-3" style={{ color: '#b45309' }}>Unavailable variants need attention.</p>}
        <div className="flex justify-between mb-4 text-sm"><span>Subtotal</span><strong className="text-lg" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{formatMoney(subtotalMinor)}</strong></div>
        <Link to="/cart" onClick={onClose} className="tulda-button w-full">VIEW CART</Link>
        <button type="button" onClick={onClose} className="tulda-button-secondary mt-3 w-full">CONTINUE SHOPPING</button>
      </footer>}
    </aside>
  </>
}
