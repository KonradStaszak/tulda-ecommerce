import { useState } from "react"

import { Route, Routes } from "react-router-dom"

import Header from "./components/Header"

import CartDrawer from "./components/CartDrawer"

import Hero from "./components/Hero"

import ShopByCategory from "./components/ShopByCategory"

import PopularProducts from "./components/PopularProducts"

import BodyshopSection from "./components/BodyshopSection"

import WorkshopGallery from "./components/WorkshopGallery"

import TechnicalResources from "./components/TechnicalResources"

import ContactCTA from "./components/ContactCTA"

import Footer from "./components/Footer"

import ShopPage from "./pages/ShopPage"

import ProductDetailPage from "./pages/ProductDetailPage"

import CartPage from "./pages/CartPage"

import QuoteRequestPage from "./pages/QuoteRequestPage"
import NotFoundPage from "./pages/NotFoundPage"

import AboutPage from "./pages/AboutPage"

import AccountPage from "./pages/AccountPage"

import WishlistPage from "./pages/WishlistPage"

import AdminPage from "./pages/AdminPage"

import ScrollToTop from "./components/ScrollToTop"
import Seo from "./components/Seo"
import { useCatalogue } from "./services/catalogue/useCatalogue"

import { CartProvider, useCart } from "./features/cart/CartContext"

import { useWishlist } from "./features/wishlist/useWishlist"

export default function App() {
  const catalogue = useCatalogue()

  return (
    <CartProvider
      products={catalogue.data?.products ?? []}
      catalogueReady={!catalogue.loading && !catalogue.error}
    >
      <Storefront {...catalogue} />
    </CartProvider>
  )
}

function Storefront({
  data: catalogue,
  loading: catalogueLoading,
  error: catalogueError,
}: ReturnType<typeof useCatalogue>) {
  const [cartOpen, setCartOpen] = useState(false)

  const { addItem, itemCount } = useCart()

  const {
    productIds: wishlist,
    toggle: toggleWishlist,
    isAuthenticated,
  } = useWishlist()

  const [wishlistMessage, setWishlistMessage] = useState("")

  const products = catalogue?.products ?? []

  const categories = catalogue?.categories ?? []

  const addToCart = (item: Parameters<typeof addItem>[0]) => {
    addItem(item)
    setCartOpen(true)
  }

  const handleToggleWishlist = (productId: string) => {
    if (!isAuthenticated) {
      setWishlistMessage(
        "Create a Tulda account or sign in to add products to your favourites.",
      )
      return
    }

    toggleWishlist(productId)
  }

  return (
    <div
      className="tulda-storefront flex min-h-screen flex-col"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <ScrollToTop />
      <Header
        cartCount={itemCount}
        onCartOpen={() => setCartOpen(true)}
        categories={categories}
        products={products}
        isAuthenticated={isAuthenticated}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      {wishlistMessage && (
        <div
          className="fixed inset-x-4 bottom-5 z-50 mx-auto flex max-w-md items-center justify-between gap-4 border bg-white p-4 text-sm shadow-lg"
          role="alert"
          style={{ borderColor: "var(--primary)" }}
        >
          <span>{wishlistMessage}</span>
          <button
            type="button"
            onClick={() => setWishlistMessage("")}
            className="font-bold"
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Seo />
              <Hero />
              <ShopByCategory
                categories={categories}
                products={products}
                loading={catalogueLoading}
              />
              <PopularProducts
                products={products}
                categories={categories}
                loading={catalogueLoading}
                error={catalogueError}
                onAddToCart={addToCart}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
              <BodyshopSection />
              <WorkshopGallery />
              <TechnicalResources limit={6} />
              <ContactCTA />
              <Footer />
            </main>
          }
        />
        <Route
          path="/products/:categorySlug?"
          element={
            <main>
              <ShopPage
                onAddToCart={addToCart}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                products={products}
                categories={categories}
                loading={catalogueLoading}
                error={catalogueError}
              />
              <Footer />
            </main>
          }
        />
        <Route
          path="/product/:productSlug"
          element={
            <>
              <ProductDetailPage
                allProducts={products}
                onAddToCart={addToCart}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
              <Footer />
            </>
          }
        />
        <Route
          path="/wishlist"
          element={
            <>
              <Seo title="Saved Products | Tulda" noIndex />
              <WishlistPage
                products={products}
                wishlist={wishlist}
                isAuthenticated={isAuthenticated}
                onAddToCart={addToCart}
                onToggleWishlist={handleToggleWishlist}
              />
              <Footer />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <>
              <Seo title="Your Enquiry | Tulda" noIndex />
              <CartPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/checkout"
          element={
            <>
              <Seo title="Request a Quote | Tulda" noIndex />
              <QuoteRequestPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/technical-documents"
          element={
            <main>
              <Seo
                title="Technical Data Sheets & Safety Documents | Tulda UK"
                description="Find Tulda technical data sheets and safety data sheets for professional automotive refinishing products."
              />
              <TechnicalResources />
              <Footer />
            </main>
          }
        />
        <Route
          path="/contact"
          element={
            <main>
              <Seo
                title="Contact Tulda | Automotive Refinishing Support UK"
                description="Contact Tulda for professional automotive refinishing product advice, technical support and UK delivery enquiries."
              />
              <ContactCTA />
              <Footer />
            </main>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Seo
                title="About Tulda | Professional Bodyshop Products UK"
                description="Learn about Tulda's professional automotive refinishing range for UK bodyshops."
              />
              <AboutPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/account"
          element={
            <>
              <Seo title="Your Account | Tulda" noIndex />
              <AccountPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <>
              <Seo title="Administration | Tulda" noIndex />
              <AdminPage />
              <Footer />
            </>
          }
        />
        <Route
          path="*"
          element={
            <main>
              <Seo title="Page Not Found | Tulda" noIndex />
              <NotFoundPage />
              <Footer />
            </main>
          }
        />
      </Routes>
    </div>
  )
}
