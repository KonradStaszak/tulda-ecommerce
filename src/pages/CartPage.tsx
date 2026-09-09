import { Link } from 'react-router-dom'
import CartLineItem from '../features/cart/CartLineItem'
import { useCart } from '../features/cart/CartContext'

export default function CartPage() {
  const { lines, itemCount, clearCart } = useCart()
  return <main className="mx-auto max-w-6xl px-6 py-10"><nav className="text-xs text-[var(--muted-foreground)]"><Link to="/">Home</Link> / Enquiry</nav><div className="mt-6 flex items-end justify-between"><div><h1 className="text-4xl font-black">YOUR ENQUIRY</h1><p className="text-sm text-[var(--muted-foreground)]">{itemCount} units selected</p></div>{lines.length > 0 && <button onClick={clearCart} className="text-xs underline">Clear enquiry</button>}</div>{lines.length === 0 ? <section className="mt-8 border bg-[var(--muted)] py-20 text-center"><h2 className="text-xl font-bold">YOUR ENQUIRY IS EMPTY</h2><Link to="/products" className="tulda-button mt-5">VIEW PRODUCTS</Link></section> : <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]"><section className="space-y-5">{lines.map((line) => <CartLineItem key={line.variantId} line={line} />)}</section><aside className="h-fit border bg-[var(--muted)] p-6"><h2 className="text-xl font-bold">REQUEST AN OFFER</h2><p className="mt-3 text-sm text-[var(--muted-foreground)]">We will review your list and contact you with pricing and availability.</p><Link to="/checkout" className="tulda-button mt-6 w-full">SEND ENQUIRY</Link><Link to="/products" className="tulda-button-secondary mt-3 w-full">ADD MORE PRODUCTS</Link></aside></div>}</main>
}
