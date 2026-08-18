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
import type { CartItem, CategoryId } from './data/products'

type Page = 'home' | 'shop'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [shopCategory, setShopCategory] = useState<CategoryId | undefined>()
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])

  const navigateToShop = (category?: CategoryId) => {
    setShopCategory(category)
    setPage('shop')
    window.scrollTo({ top: 0 })
  }

  const navigateHome = () => {
    setPage('home')
    window.scrollTo({ top: 0 })
  }

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === item.product.id && i.size === item.size)
      if (existing) {
        return prev.map(i =>
          i.product.id === item.product.id && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
    setCartOpen(true)
  }

  const removeFromCart = (productId: string, size: string) => {
    setCartItems(prev => prev.filter(i => !(i.product.id === productId && i.size === size)))
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
          <ShopByCategory onCategoryClick={id => navigateToShop(id as CategoryId)} />
          <PopularProducts
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
          />
          <Footer onNavigateShop={() => navigateToShop()} />
        </main>
      )}
    </div>
  )
}
