import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import type { CatalogueCartLine, CatalogueProduct } from '../types/catalog'

interface WishlistPageProps {
  products: CatalogueProduct[]
  wishlist: string[]
  isAuthenticated: boolean
  onAddToCart: (item: CatalogueCartLine) => void
  onToggleWishlist: (productId: string) => void
}

export default function WishlistPage({ products, wishlist, isAuthenticated, onAddToCart, onToggleWishlist }: WishlistPageProps) {
  if (!isAuthenticated) return <main className="mx-auto max-w-[1400px] px-6 py-20 text-center"><h1 className="text-5xl font-black">YOUR FAVOURITES</h1><p className="mx-auto mt-4 max-w-md text-sm" style={{ color: 'var(--muted-foreground)' }}>Sign in or create a Tulda account to save and view your favourite products.</p><Link to="/account" className="tulda-button mt-7">SIGN IN OR CREATE ACCOUNT</Link></main>

  const favouriteProducts = products.filter((product) => wishlist.includes(product.id))
  return <main className="mx-auto max-w-[1400px] px-6 py-14 md:py-20"><p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--primary)' }}>Your Tulda account</p><h1 className="mt-3 text-5xl font-black leading-none md:text-6xl">FAVOURITE PRODUCTS</h1>{favouriteProducts.length ? <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{favouriteProducts.map((product) => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} isWishlisted onToggleWishlist={() => onToggleWishlist(product.id)} />)}</div> : <section className="mt-10 border p-10 text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}><p className="text-lg font-bold">You have no favourite products yet.</p><p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>Use the heart icon on any Tulda product to save it here.</p><Link to="/products" className="tulda-button mt-6">EXPLORE PRODUCTS</Link></section>}</main>
}
