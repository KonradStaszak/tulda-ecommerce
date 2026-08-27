import { Link } from 'react-router-dom'
import CartLineItem from '../features/cart/CartLineItem'
import { useCart } from '../features/cart/CartContext'
import { formatMoney } from '../services/catalogue/money'

export default function CartPage() {
  const { lines, itemCount, subtotalMinor, hasUnavailableItems, clearCart } = useCart()
  return <main className="max-w-[1400px] mx-auto px-6 py-10"><nav className="text-xs" style={{ color: 'var(--muted-foreground)' }}><Link to="/">Home</Link> / Cart</nav><div className="mt-6 flex justify-between items-end"><div><h1 className="text-4xl font-black" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>YOUR CART</h1><p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{itemCount} items</p></div>{lines.length > 0 && <button onClick={clearCart} className="text-xs">Clear cart</button>}</div>
    {lines.length === 0 ? <section className="mt-8 py-20 text-center border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}><h2 className="text-xl font-bold">YOUR CART IS EMPTY</h2><Link to="/products" className="tulda-button mt-5">CONTINUE SHOPPING</Link></section> : <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10"><section className="space-y-5">{lines.map((line) => <CartLineItem key={line.variantId} line={line} />)}</section><aside className="h-fit border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}><h2 className="text-xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>ORDER SUMMARY</h2><div className="mt-5 flex justify-between"><span>Subtotal</span><strong>{formatMoney(subtotalMinor)}</strong></div>{hasUnavailableItems && <p className="mt-4 text-xs" role="status" style={{ color: '#b45309' }}>Unavailable variants must be removed before checkout.</p>}<Link to="/checkout" aria-disabled={hasUnavailableItems} className="tulda-button mt-6 w-full" style={hasUnavailableItems ? { backgroundColor: '#aaa', pointerEvents: 'none' } : undefined}>PROCEED TO CHECKOUT</Link><Link to="/products" className="tulda-button-secondary mt-3 w-full">CONTINUE SHOPPING</Link></aside></div>}
  </main>
}
