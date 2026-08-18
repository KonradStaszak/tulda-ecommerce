import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import ShopByCategory from './components/ShopByCategory'
import PopularProducts from './components/PopularProducts'
import BodyshopSection from './components/BodyshopSection'
import FindProduct from './components/FindProduct'
import TechnicalResources from './components/TechnicalResources'
import ContactCTA from './components/ContactCTA'
import Footer from './components/Footer'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import NotFoundPage from './pages/NotFoundPage'
import ScrollToTop from './components/ScrollToTop'
import { useCatalogue } from './services/catalogue/useCatalogue'
import { CartProvider, useCart } from './features/cart/CartContext'
import { useWishlist } from './features/wishlist/useWishlist'

export default function App() {
  const catalogue = useCatalogue()
  return <CartProvider products={catalogue.data?.products ?? []} catalogueReady={!catalogue.loading && !catalogue.error}><Storefront {...catalogue} /></CartProvider>
}

function Storefront({ data: catalogue, loading: catalogueLoading, error: catalogueError }: ReturnType<typeof useCatalogue>) {
  const [cartOpen, setCartOpen] = useState(false)
  const { addItem, itemCount } = useCart()
  const { productIds: wishlist, toggle: toggleWishlist } = useWishlist()
  const products = catalogue?.products ?? []
  const categories = catalogue?.categories ?? []
  const addToCart = (item: Parameters<typeof addItem>[0]) => { addItem(item); setCartOpen(true) }
  return <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
    <ScrollToTop />
    <Header cartCount={itemCount} onCartOpen={() => setCartOpen(true)} categories={categories} />
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    <Routes>
      <Route path="/" element={<main><Hero /><TrustBar /><ShopByCategory categories={categories} loading={catalogueLoading} /><PopularProducts products={products} categories={categories} loading={catalogueLoading} error={catalogueError} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} /><BodyshopSection /><FindProduct /><TechnicalResources /><ContactCTA /><Footer /></main>} />
      <Route path="/products/:categorySlug?" element={<main><ShopPage onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} products={products} categories={categories} loading={catalogueLoading} error={catalogueError} /><Footer /></main>} />
      <Route path="/product/:productSlug" element={<><ProductDetailPage allProducts={products} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} /><Footer /></>} />
      <Route path="/cart" element={<><CartPage /><Footer /></>} />
      <Route path="/technical-documents" element={<main><TechnicalResources /><Footer /></main>} />
      <Route path="/contact" element={<main><ContactCTA /><Footer /></main>} />
      <Route path="*" element={<main><NotFoundPage /><Footer /></main>} />
    </Routes>
  </div>
}
