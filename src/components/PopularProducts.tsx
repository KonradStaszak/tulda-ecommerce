import { useState } from 'react'
import { products } from '../data/products'
import ProductCard from './ProductCard'
import type { CartItem } from '../types/catalog'

const FILTERS = ['All', 'Clearcoat', 'Primer', 'Abrasives', 'Filler', 'Thinner']

interface PopularProductsProps {
  onAddToCart: (item: CartItem) => void
  wishlist: string[]
  onToggleWishlist: (id: string) => void
  onViewAll?: () => void
}

export default function PopularProducts({ onAddToCart, wishlist, onToggleWishlist, onViewAll }: PopularProductsProps) {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? products
    : products.filter(p => p.category.toLowerCase() === activeFilter.toLowerCase())

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
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.18em' }}
            >
              Our Range
            </p>
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
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-4 py-2 text-xs font-semibold rounded-sm border transition-all"
                style={{
                  borderColor: activeFilter === f ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: activeFilter === f ? 'var(--primary)' : 'var(--background)',
                  color: activeFilter === f ? 'var(--primary-foreground)' : 'var(--foreground)',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={() => onToggleWishlist(product.id)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <button
            onClick={onViewAll}
            className="flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-sm border transition-colors hover:bg-[var(--foreground)] hover:text-[var(--background)]"
            style={{
              borderColor: 'var(--foreground)',
              color: 'var(--foreground)',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.04em',
            }}
          >
            VIEW FULL CATALOGUE
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
