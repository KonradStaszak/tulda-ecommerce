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
import NotFoundPage from './pages/NotFoundPage'
import ScrollToTop from './components/ScrollToTop'
import type { CatalogueCartLine } from './types/catalog'
import { useCatalogue } from './services/catalogue/useCatalogue'

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CatalogueCartLine[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])

  const { data: catalogue, loading: catalogueLoading, error: catalogueError } = useCatalogue()

  const addToCart = (item: CatalogueCartLine) => {
    setCartItems(prev => {
      const existing = prev.find((line) => line.product.id === item.product.id && line.variant.id === item.variant.id)
      if (existing) {
        return prev.map((line) =>
          line.product.id === item.product.id && line.variant.id === item.variant.id
            ? { ...line, quantity: line.quantity + item.quantity }
            : line
        )
      }
      return [...prev, item]
    })
    setCartOpen(true)
  }

  const removeFromCart = (productId: string, variantId: string) => {
    setCartItems(prev => prev.filter((line) => !(line.product.id === productId && line.variant.id === variantId)))
  }

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    )
  }

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <ScrollToTop />
      <Header
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        categories={catalogue?.categories ?? []}
      />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
      />

      <Routes>
        <Route path="/" element={<main>
          <Hero />
          <TrustBar />
          <ShopByCategory categories={catalogue?.categories ?? []} loading={catalogueLoading} />
          <PopularProducts
            products={catalogue?.products ?? []}
            categories={catalogue?.categories ?? []}
            loading={catalogueLoading}
            error={catalogueError}
            onAddToCart={addToCart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
          />
          <BodyshopSection />
          <FindProduct />
          <TechnicalResources />
          <ContactCTA />
          <Footer />
        </main>} />
        <Route path="/products/:categorySlug?" element={<main>
          <ShopPage
            onAddToCart={addToCart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            products={catalogue?.products ?? []}
            categories={catalogue?.categories ?? []}
            loading={catalogueLoading}
            error={catalogueError}
          />
          <Footer />
        </main>} />
        <Route path="/product/:productSlug" element={<><ProductDetailPage allProducts={catalogue?.products ?? []} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} /><Footer /></>} />
        <Route path="/technical-documents" element={<main><TechnicalResources /><Footer /></main>} />
        <Route path="/contact" element={<main><ContactCTA /><Footer /></main>} />
        <Route path="*" element={<main><NotFoundPage /><Footer /></main>} />
      </Routes>
    </div>
  )
}
