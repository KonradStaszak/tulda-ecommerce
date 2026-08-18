import { useState } from 'react'
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
import type { CatalogueCartLine } from './types/catalog'
import { useCatalogue } from './services/catalogue/useCatalogue'

type Page = 'home' | 'shop'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [shopCategory, setShopCategory] = useState<string | undefined>()
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CatalogueCartLine[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])

  const { data: catalogue, loading: catalogueLoading, error: catalogueError } = useCatalogue()

  const navigateToShop = (category?: string) => {
    setShopCategory(category)
    setPage('shop')
    window.scrollTo({ top: 0 })
  }

  const navigateHome = () => {
    setPage('home')
    window.scrollTo({ top: 0 })
  }

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
      <Header
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        onNavigateShop={() => navigateToShop()}
        onNavigateHome={navigateHome}
        categories={catalogue?.categories ?? []}
      />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
      />

      {page === 'home' && (
        <main>
          <Hero onShopNow={() => navigateToShop()} />
          <TrustBar />
          <ShopByCategory categories={catalogue?.categories ?? []} loading={catalogueLoading} onCategoryClick={navigateToShop} />
          <PopularProducts
            products={catalogue?.products ?? []}
            categories={catalogue?.categories ?? []}
            loading={catalogueLoading}
            error={catalogueError}
            onAddToCart={addToCart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onViewAll={() => navigateToShop()}
          />
          <BodyshopSection />
          <FindProduct />
          <TechnicalResources />
          <ContactCTA />
          <Footer onNavigateShop={() => navigateToShop()} />
        </main>
      )}

      {page === 'shop' && (
        <main>
          <ShopPage
            onNavigateHome={navigateHome}
            onAddToCart={addToCart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            initialCategory={shopCategory}
            products={catalogue?.products ?? []}
            categories={catalogue?.categories ?? []}
            loading={catalogueLoading}
            error={catalogueError}
          />
          <Footer onNavigateShop={() => navigateToShop()} />
        </main>
      )}
    </div>
  )
}
