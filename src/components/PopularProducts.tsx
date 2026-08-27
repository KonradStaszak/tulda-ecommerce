import { useState } from 'react'
import ProductCard from './ProductCard'
import type { CatalogueCartLine, CatalogueCategory, CatalogueProduct } from '../types/catalog'
import { Link } from 'react-router-dom'

interface PopularProductsProps {
  products: CatalogueProduct[]
  categories: CatalogueCategory[]
  loading: boolean
  error: Error | null
  onAddToCart: (item: CatalogueCartLine) => void
  wishlist: string[]
  onToggleWishlist: (id: string) => void
}

export default function PopularProducts({ products, categories, loading, error, onAddToCart, wishlist, onToggleWishlist }: PopularProductsProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const mainCategories = categories.filter((category) => category.parentId === null)

  const filtered = activeFilter === 'all'
    ? products
    : products.filter((product) => product.categories.some((category) => category.id === activeFilter))
  const featuredProducts = filtered.slice(0, 4)

  return (
    <section
      id="products"
      className="py-20 md:py-28"
      style={{ backgroundColor: 'var(--muted)' }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2
              className="text-4xl md:text-5xl font-black leading-none"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--foreground)' }}
            >
              POPULAR
              <br />
              <span style={{ color: 'var(--primary)' }}>PRODUCTS</span>
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {[{ id: 'all', name: 'All' }, ...mainCategories].map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className="px-4 py-2 text-xs font-semibold rounded-sm border transition-all"
                style={{
                  borderColor: activeFilter === category.id ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: activeFilter === category.id ? 'var(--primary)' : 'var(--background)',
                  color: activeFilter === category.id ? 'var(--primary-foreground)' : 'var(--foreground)',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                {category.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading && Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-[370px] animate-pulse rounded-sm border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }} />)}
          {!loading && featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={() => onToggleWishlist(product.id)}
            />
          ))}
        </div>
        {!loading && error && <p className="mt-5 text-sm" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>The product range could not be loaded. Please try again shortly.</p>}

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <Link
            to="/products"
            className="flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-sm border transition-colors hover:bg-[var(--foreground)] hover:text-[var(--background)]"
            style={{
              borderColor: 'var(--foreground)',
              color: 'var(--foreground)',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.04em',
            }}
          >
            VIEW ALL PRODUCTS
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
