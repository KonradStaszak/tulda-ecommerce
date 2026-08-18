import { useEffect } from 'react'
import type { CartItem } from '../types/catalog'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  items: CartItem[]
  onRemove: (productId: string, size: string) => void
}

export default function CartDrawer({ open, onClose, items, onRemove }: CartDrawerProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const total = items.reduce((sum, i) => sum + i.product.priceFrom * i.quantity, 0)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(0,0,0,0.4)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full max-w-[420px] transition-transform duration-300"
        style={{
          backgroundColor: 'var(--background)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: '-4px 0 32px rgba(0,0,0,0.12)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div>
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.02em' }}
            >
              YOUR CART
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
              {items.length === 0 ? 'No items' : `${items.reduce((s, i) => s + i.quantity, 0)} items`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-sm transition-colors hover:bg-[var(--muted)]"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <svg className="w-12 h-12 mb-4" style={{ color: 'var(--muted-foreground)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p className="text-sm font-medium mb-1">Your cart is empty</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
                Browse our professional range to get started
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2 text-sm font-medium rounded-sm transition-colors"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', fontFamily: 'Inter, sans-serif' }}
              >
                Shop Products
              </button>
            </div>
          ) : (
            items.map(item => (
              <div
                key={`${item.product.id}-${item.size}`}
                className="flex gap-4 pb-4 border-b"
                style={{ borderColor: 'var(--border)' }}
              >
                {/* Product color swatch */}
                <div
                  className="w-16 h-16 rounded-sm shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: item.product.accentColor }}
                >
                  <span
                    className="text-white text-xs font-bold"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    {item.product.code}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold leading-snug truncate"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.product.shortName}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.size} · Qty {item.quantity}
                  </p>
                  <p
                    className="text-sm font-semibold mt-1"
                    style={{ color: 'var(--primary)', fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.product.currency}{(item.product.priceFrom * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(item.product.id, item.size)}
                  className="p-1 self-start transition-colors hover:text-[var(--primary)]"
                  style={{ color: 'var(--muted-foreground)' }}
                  aria-label="Remove item"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Subtotal</span>
              <span
                className="text-lg font-bold"
                style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.01em' }}
              >
                £{total.toFixed(2)}
              </span>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
              Shipping calculated at checkout. Free delivery on orders over £50.
            </p>
            <button
              className="w-full py-3.5 text-sm font-semibold rounded-sm transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.04em',
              }}
            >
              PROCEED TO CHECKOUT
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-sm font-medium mt-2 rounded-sm transition-colors hover:bg-[var(--muted)]"
              style={{ fontFamily: 'Inter, sans-serif', color: 'var(--foreground)' }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
