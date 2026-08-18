import { categories } from '../data/products'
import type { CategoryId } from '../data/products'

interface ShopByCategoryProps {
  onCategoryClick?: (id: CategoryId) => void
}

export default function ShopByCategory({ onCategoryClick }: ShopByCategoryProps) {
  return (
    <section id="categories" className="py-20 md:py-28" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.18em' }}
            >
              Product Range
            </p>
            <h2
              className="text-4xl md:text-5xl font-black leading-none"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--foreground)' }}
            >
              SHOP BY
              <br />
              <span style={{ color: 'var(--primary)' }}>CATEGORY</span>
            </h2>
          </div>
          <a
            href="#products"
            className="hidden md:flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--primary)]"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}
          >
            View all products
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Categories grid — asymmetric layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <a
              key={cat.id}
              href="#"
              onClick={e => { e.preventDefault(); onCategoryClick?.(cat.id as CategoryId) }}
              className={`group relative overflow-hidden rounded-sm cursor-pointer ${
                i === 0 ? 'col-span-2 row-span-2 md:col-span-2' : ''
              }`}
              style={{ aspectRatio: i === 0 ? 'auto' : '3/4', minHeight: i === 0 ? '280px' : '200px' }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to top, ${cat.color}ee 0%, ${cat.color}88 40%, transparent 100%)`,
                }}
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: 'rgba(200,22,29,0.12)' }}
              />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-white font-black leading-none mb-1"
                      style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontSize: i === 0 ? '1.6rem' : '1.15rem',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {cat.name.toUpperCase()}
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontFamily: 'Inter, sans-serif',
                        display: i === 0 ? 'block' : 'none',
                      }}
                    >
                      {cat.count} products
                    </p>
                  </div>
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
