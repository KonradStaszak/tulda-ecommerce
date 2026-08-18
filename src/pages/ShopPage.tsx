import { useState, useMemo } from 'react'
import { products, applyFilters, categories } from '../data/products'
import type { FilterState, CartItem, CategoryId, SortKey } from '../types/catalog'
import ProductCard from '../components/ProductCard'
import FilterSidebar from '../components/FilterSidebar'
import MobileFilterDrawer from '../components/MobileFilterDrawer'

const PAGE_SIZE = 12

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
]

const defaultFilters: FilterState = {
  categories: [],
  inStockOnly: false,
  sizes: [],
  search: '',
  sort: 'recommended',
  page: 1,
}

interface ShopPageProps {
  onNavigateHome: () => void
  onAddToCart: (item: CartItem) => void
  wishlist: string[]
  onToggleWishlist: (id: string) => void
  initialCategory?: CategoryId
}

export default function ShopPage({ onNavigateHome, onAddToCart, wishlist, onToggleWishlist, initialCategory }: ShopPageProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    categories: initialCategory ? [initialCategory] : [],
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtered = useMemo(() => applyFilters(products, filters), [filters])
  const paginated = filtered.slice(0, filters.page * PAGE_SIZE)
  const hasMore = paginated.length < filtered.length

  const activeFilterChips: { label: string; remove: () => void }[] = [
    ...filters.categories.map(c => ({
      label: categories.find(x => x.id === c)?.name ?? c,
      remove: () => setFilters(f => ({ ...f, categories: f.categories.filter(x => x !== c), page: 1 })),
    })),
    ...(filters.inStockOnly ? [{ label: 'In stock', remove: () => setFilters(f => ({ ...f, inStockOnly: false, page: 1 })) }] : []),
    ...filters.sizes.map(s => ({
      label: s,
      remove: () => setFilters(f => ({ ...f, sizes: f.sizes.filter(x => x !== s), page: 1 })),
    })),
  ]

  const hasActiveFilters = activeFilterChips.length > 0

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      {/* Page header bar */}
      <div style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 mb-4" aria-label="Breadcrumb">
            <button onClick={onNavigateHome}
              className="text-[12px] transition-colors hover:text-[var(--primary)]"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
              Home
            </button>
            <svg className="w-3 h-3" style={{ color: 'var(--muted-foreground)' }} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
            </svg>
            <span className="text-[12px] font-medium" style={{ color: 'var(--foreground)', fontFamily: 'Inter, sans-serif' }}>
              Products
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-black leading-none mb-1.5"
                style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '2.4rem', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>
                Products
              </h1>
              <p className="text-[13px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
                Professional automotive refinishing — clearcoats, primers, abrasives, fillers &amp; more.
              </p>
            </div>

            {/* Category nav pills — horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto pb-1 shrink-0" style={{ scrollbarWidth: 'none' }}>
              <button
                onClick={() => setFilters(f => ({ ...f, categories: [], page: 1 }))}
                className="shrink-0 px-3.5 py-1.5 text-[12px] font-semibold rounded-sm border transition-all"
                style={{
                  borderColor: filters.categories.length === 0 ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: filters.categories.length === 0 ? 'var(--primary)' : 'var(--background)',
                  color: filters.categories.length === 0 ? '#fff' : 'var(--foreground)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                All
              </button>
              {categories.map(cat => {
                const active = filters.categories.includes(cat.id)
                return (
                  <button key={cat.id}
                    onClick={() => {
                      setFilters(f => ({
                        ...f,
                        categories: active ? f.categories.filter(c => c !== cat.id) : [cat.id],
                        page: 1,
                      }))
                    }}
                    className="shrink-0 px-3.5 py-1.5 text-[12px] font-semibold rounded-sm border transition-all"
                    style={{
                      borderColor: active ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: active ? 'var(--primary)' : 'var(--background)',
                      color: active ? '#fff' : 'var(--foreground)',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Toolbar row */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-medium rounded-sm border transition-colors hover:border-[var(--foreground)]"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)', fontFamily: 'Inter, sans-serif' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
              {hasActiveFilters && (
                <span className="w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold text-white"
                  style={{ backgroundColor: 'var(--primary)' }}>
                  {activeFilterChips.length}
                </span>
              )}
            </button>

            {/* Search */}
            <div className="relative flex items-center">
              <svg className="absolute left-3 w-3.5 h-3.5 pointer-events-none" style={{ color: 'var(--muted-foreground)' }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M20 20l-3.5-3.5" />
              </svg>
              <input
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
                placeholder="Search products…"
                className="pl-8 pr-8 py-2 text-[12px] rounded-sm border outline-none transition-colors focus:border-[var(--primary)]"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  fontFamily: 'Inter, sans-serif',
                  width: '220px',
                }}
              />
              {filters.search && (
                <button onClick={() => setFilters(f => ({ ...f, search: '', page: 1 }))}
                  className="absolute right-2.5"
                  style={{ color: 'var(--muted-foreground)' }}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Result count */}
            <span className="text-[12px] hidden sm:inline" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-[12px] hidden sm:inline whitespace-nowrap" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
              Sort by
            </label>
            <div className="relative">
              <select
                value={filters.sort}
                onChange={e => setFilters(f => ({ ...f, sort: e.target.value as SortKey, page: 1 }))}
                className="appearance-none pl-3 pr-8 py-2 text-[12px] rounded-sm border outline-none cursor-pointer transition-colors focus:border-[var(--primary)]"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
                style={{ color: 'var(--muted-foreground)' }} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-5 pb-5 border-b" style={{ borderColor: 'var(--border)' }}>
            {activeFilterChips.map(chip => (
              <span key={chip.label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-medium border"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)', fontFamily: 'Inter, sans-serif' }}>
                {chip.label}
                <button onClick={chip.remove} className="transition-colors hover:text-[var(--primary)]"
                  aria-label={`Remove ${chip.label} filter`}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 2l8 8M10 2l-8 8" />
                  </svg>
                </button>
              </span>
            ))}
            <button
              onClick={() => setFilters(f => ({ ...f, categories: [], inStockOnly: false, sizes: [], page: 1 }))}
              className="text-[11px] font-medium transition-colors hover:text-[var(--primary)]"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
              Clear all
            </button>
          </div>
        )}

        {/* Main content — sidebar + grid */}
        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <div className="hidden lg:block shrink-0" style={{ width: 220 }}>
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              totalCount={products.length}
              filteredCount={filtered.length}
            />
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <EmptyState onClear={() => setFilters(defaultFilters)} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginated.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={onAddToCart}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={() => onToggleWishlist(product.id)}
                    />
                  ))}
                </div>

                {/* Load more / pagination */}
                {hasMore ? (
                  <div className="flex flex-col items-center mt-10 gap-3">
                    <button
                      onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                      className="px-8 py-3 text-[13px] font-semibold rounded-sm border transition-colors hover:bg-[var(--foreground)] hover:text-[var(--background)]"
                      style={{ borderColor: 'var(--foreground)', color: 'var(--foreground)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em' }}>
                      Load More Products
                    </button>
                    <p className="text-[11px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
                      Showing {paginated.length} of {filtered.length}
                    </p>
                  </div>
                ) : filtered.length > PAGE_SIZE && (
                  <p className="text-center mt-10 text-[12px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
                    All {filtered.length} products shown
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onChange={setFilters}
        totalCount={products.length}
        filteredCount={filtered.length}
      />
    </div>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-sm flex items-center justify-center mb-5"
        style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
        <svg className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M20 20l-3.5-3.5" />
        </svg>
      </div>
      <p className="text-base font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        No products found
      </p>
      <p className="text-[13px] mb-6 max-w-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
        Try adjusting your filters or search term to find what you're looking for.
      </p>
      <button onClick={onClear}
        className="px-6 py-2.5 text-[13px] font-semibold rounded-sm transition-colors"
        style={{ backgroundColor: 'var(--primary)', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
        Clear Filters
      </button>
    </div>
  )
}
