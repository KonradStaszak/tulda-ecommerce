import { useState, useRef, useEffect, useMemo } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import tuldaLogo from '../assets/brand/tulda-logo.png'
import type { CatalogueCategory, CatalogueProduct } from '../types/catalog'
import { formatMoney } from '../services/catalogue/money'
import { getCategoryTree } from '../services/catalogue/categoryHierarchy'
import type { CategoryTreeNode } from '../services/catalogue/categoryHierarchy'
import { getProductCardImage } from '../lib/productImages'

interface HeaderProps {
  cartCount: number
  onCartOpen: () => void
  categories: CatalogueCategory[]
  products: CatalogueProduct[]
  isAuthenticated: boolean
}

const navLinks = [
  { label: 'Products', hasMega: true },
  { label: 'Technical Docs', to: '/technical-documents' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Header({ cartCount, onCartOpen, categories, products, isAuthenticated }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const mobileMenuRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuWasOpen = useRef(false)
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus({ preventScroll: true })
  }, [searchOpen])

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Element && !event.target.closest('[data-header-search]')) {
        setSearchFocused(false)
        setActiveSuggestion(-1)
      }
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => mobileMenuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true }))
    return () => { document.body.style.overflow = previousOverflow }
  }, [mobileOpen])

  useEffect(() => {
    if (mobileOpen) {
      mobileMenuWasOpen.current = true
      return
    }
    if (mobileMenuWasOpen.current) {
      menuButtonRef.current?.focus()
      mobileMenuWasOpen.current = false
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [mobileOpen])

  const openMega = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current)
    setMegaOpen(true)
  }
  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 120)
  }
  const closeMobileOverlays = () => {
    setMobileOpen(false)
    setSearchOpen(false)
    setSearchFocused(false)
    setActiveSuggestion(-1)
  }
  const toggleMobileSearch = () => {
    setMobileOpen(false)
    setSearchOpen((open) => !open)
  }
  const toggleMobileMenu = () => {
    setSearchOpen(false)
    setSearchFocused(false)
    setActiveSuggestion(-1)
    setMobileOpen((open) => !open)
  }
  const submitSearch = () => {
    const query = searchQuery.trim()
    if (!query) return
    navigate('/products?search=' + encodeURIComponent(query))
    setSearchOpen(false)
    setSearchFocused(false)
    setActiveSuggestion(-1)
  }
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase()
  const categoryTree = useMemo(() => getCategoryTree(categories), [categories])
  const productsActive = location.pathname.startsWith('/products') || location.pathname.startsWith('/product/')
  const suggestions = useMemo(() => {
    if (normalizedQuery.length < 2) return []
    return products.filter((product) => [
      product.name,
      product.code,
      ...product.categories.map((category) => category.name),
      ...product.variants.map((variant) => variant.sku),
      ...product.variants.map((variant) => variant.label),
    ].some((value) => value?.toLocaleLowerCase().includes(normalizedQuery))).slice(0, 5)
  }, [normalizedQuery, products])
  const shouldShowSuggestions = searchFocused && normalizedQuery.length >= 2
  const updateSearchQuery = (value: string) => {
    setSearchQuery(value)
    setActiveSuggestion(-1)
  }
  const openProduct = (product: CatalogueProduct) => {
    navigate('/product/' + product.slug)
    setSearchFocused(false)
    setSearchOpen(false)
    setActiveSuggestion(-1)
  }
  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setSearchFocused(false)
      setSearchOpen(false)
      setActiveSuggestion(-1)
      return
    }
    if (event.key === 'ArrowDown' && suggestions.length > 0) {
      event.preventDefault()
      setActiveSuggestion((current) => Math.min(current + 1, suggestions.length - 1))
      return
    }
    if (event.key === 'ArrowUp' && suggestions.length > 0) {
      event.preventDefault()
      setActiveSuggestion((current) => current <= 0 ? suggestions.length - 1 : current - 1)
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      if (activeSuggestion >= 0) openProduct(suggestions[activeSuggestion])
      else submitSearch()
    }
  }

  return (
    <>
      {/* Utility bar */}
      <div style={{ backgroundColor: 'var(--surface-dark)', color: 'rgba(255,255,255,0.5)' }} className="hidden md:block">
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center h-8">
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px' }}>
            Free UK delivery on orders over £50
          </span>
          <div className="flex gap-5" style={{ fontSize: '11px' }}>
            <a href="tel:+442088193278" className="hover:text-white transition-colors">+44 (0) 2088 193278</a>
            <a href="mailto:contact@tulda.co.uk" className="hover:text-white transition-colors">contact@tulda.co.uk</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className="sticky top-0 z-50 max-md:fixed max-md:inset-x-0 max-md:top-0"
        style={{
          backgroundColor: 'var(--background)',
          borderBottom: '1px solid var(--border)',
          transition: 'box-shadow 0.2s',
          boxShadow: scrolled ? '0 1px 16px rgba(0,0,0,0.07)' : 'none',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex min-w-0 items-center justify-between h-[62px]">

            {/* Logo */}
            <Link to="/" className="mr-2 flex shrink-0 items-center gap-2.5 sm:mr-4 lg:mr-8">
              <img src={tuldaLogo} alt="Tulda" className="h-auto w-[clamp(120px,36vw,145px)] object-contain md:h-7 md:w-auto" />
            </Link>

            {/* Nav */}
            <nav className="hidden lg:flex items-center flex-1">
              {navLinks.map(link => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={link.hasMega ? openMega : undefined}
                  onMouseLeave={link.hasMega ? closeMega : undefined}
                >
                  {link.hasMega ? (
                    <Link to="/products" className={'flex items-center gap-1 rounded-sm px-3.5 py-1.5 text-[13px] transition-colors hover:text-[var(--primary)] ' + (productsActive ? 'font-semibold text-[var(--primary)]' : 'font-medium')}
                      style={{ fontFamily: 'Inter, sans-serif', color: productsActive || megaOpen ? 'var(--primary)' : 'var(--foreground)', letterSpacing: '0.005em' }}>
                      {link.label}
                      <svg
                        className="w-3 h-3"
                        style={{ transition: 'transform 0.15s', transform: megaOpen ? 'rotate(180deg)' : 'none' }}
                        fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
                      </svg>
                    </Link>
                  ) : link.to ? (
                    <NavLink to={link.to} className={({ isActive }) => 'flex items-center gap-1 rounded-sm px-3.5 py-1.5 text-[13px] transition-colors hover:text-[var(--primary)] ' + (isActive ? 'font-semibold text-[var(--primary)]' : 'font-medium')}
                      style={({ isActive }) => ({ fontFamily: 'Inter, sans-serif', color: isActive ? 'var(--primary)' : 'var(--foreground)', letterSpacing: '0.005em' })}>
                      {link.label}
                    </NavLink>
                  ) : (
                    <Link to="/products" className="flex items-center gap-1 px-3.5 py-1.5 text-[13px] font-medium rounded-sm transition-colors hover:text-[var(--primary)]"
                      style={{ fontFamily: 'Inter, sans-serif', color: 'var(--foreground)', letterSpacing: '0.005em' }}>
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div data-header-search className="relative ml-4 hidden w-[260px] shrink-0 lg:block xl:w-[340px] 2xl:w-[390px]">
              <form role="search" onSubmit={(event) => { event.preventDefault(); submitSearch() }}>
                <label className="relative block">
                  <span className="sr-only">Search products</span>
                  <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M20 20l-3.5-3.5" />
                  </svg>
                  <input
                    value={searchQuery}
                    onChange={(event) => updateSearchQuery(event.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search products..."
                    aria-label="Search products"
                    aria-expanded={shouldShowSuggestions}
                    aria-controls="desktop-search-results"
                    aria-activedescendant={activeSuggestion >= 0 ? 'desktop-search-result-' + activeSuggestion : undefined}
                    className="tulda-header-search h-11 w-full rounded-none border pl-10 pr-4 text-[13px] outline-none"
                  />
                </label>
              </form>
              {shouldShowSuggestions && (
                <SearchSuggestions
                  query={searchQuery.trim()}
                  results={suggestions}
                  activeIndex={activeSuggestion}
                  onHighlight={setActiveSuggestion}
                  onSelect={openProduct}
                  onViewAll={submitSearch}
                  id="desktop-search-results"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-0">
              <button
                onClick={toggleMobileSearch}
                className="lg:hidden w-11 h-11 flex items-center justify-center rounded-sm transition-colors hover:bg-[var(--muted)] focus-visible:bg-[var(--muted)]"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M20 20l-3.5-3.5" />
                </svg>
              </button>
              <Link to="/account" className="hidden md:flex w-11 h-11 items-center justify-center rounded-sm transition-colors hover:bg-[var(--muted)] focus-visible:bg-[var(--muted)]" aria-label="Account">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <circle cx="12" cy="8" r="4" /><path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </Link>
              <Link to={isAuthenticated ? "/wishlist" : "/account"} className="hidden md:flex w-11 h-11 items-center justify-center rounded-sm transition-colors hover:bg-[var(--muted)] focus-visible:bg-[var(--muted)]" aria-label={isAuthenticated ? "Favourite products" : "Sign in to view favourite products"}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 3 14.5 3 8.5a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 12.5-9 12.5z" />
                </svg>
              </Link>

              {/* Cart */}
              <button
                onClick={() => { closeMobileOverlays(); onCartOpen() }}
                className="relative flex w-11 h-11 items-center justify-center rounded-sm transition-colors hover:bg-[var(--muted)] focus-visible:bg-[var(--muted)] lg:ml-1"
                aria-label={`Cart — ${cartCount} items`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 ? (
                  <span
                    className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center text-[10px] font-bold rounded-full"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    {cartCount}
                  </span>
                ) : null}
              </button>

              {/* Mobile toggle */}
              <button
                ref={menuButtonRef}
                onClick={toggleMobileMenu}
                className="lg:hidden flex w-11 h-11 items-center justify-center rounded-sm transition-colors hover:bg-[var(--muted)] focus-visible:bg-[var(--muted)]"
                aria-label="Menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search overlay */}
        {searchOpen && (
          <div data-mobile-search className="lg:hidden max-md:fixed max-md:inset-x-0 max-md:top-[62px] max-md:z-40 border-t shadow-[0_8px_18px_rgba(0,0,0,0.08)]" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
            <div data-header-search className="relative max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-3">
              <svg className="w-4 h-4 shrink-0" style={{ color: 'var(--muted-foreground)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M20 20l-3.5-3.5" />
              </svg>
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => updateSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                aria-label="Search products"
                aria-expanded={shouldShowSuggestions}
                  aria-controls="mobile-search-results"
                  aria-activedescendant={activeSuggestion >= 0 ? 'mobile-search-result-' + activeSuggestion : undefined}
                placeholder="Search products, codes, categories…"
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--muted-foreground)]"
                style={{ fontFamily: 'Inter, sans-serif', color: 'var(--foreground)' }}
              />
              <button onClick={() => { setSearchOpen(false); setSearchFocused(false); setActiveSuggestion(-1) }} className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Esc
              </button>
              {shouldShowSuggestions && (
                <SearchSuggestions
                  query={searchQuery.trim()}
                  results={suggestions}
                  activeIndex={activeSuggestion}
                  onHighlight={setActiveSuggestion}
                  onSelect={openProduct}
                  onViewAll={submitSearch}
                  id="mobile-search-results"
                  mobile
                />
              )}
            </div>
          </div>
        )}

        {/* Mega menu */}
        {megaOpen && (
          <div
            className="absolute left-0 right-0 border-t z-40"
            style={{
              top: '100%',
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
          >
            <div className="max-w-[1400px] mx-auto px-6 py-7">
              <div className="grid grid-cols-7 gap-5">
                {/* Promo column */}
                <div className="col-span-2 flex flex-col justify-between p-5 rounded-sm"
                  style={{ backgroundColor: 'var(--surface-dark)' }}>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-2.5"
                      style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.16em' }}>
                      Tulda Professional Range
                    </p>
                    <h3 className="text-xl font-bold leading-tight mb-2.5"
                      style={{ color: 'var(--surface-dark-foreground)', fontFamily: 'Barlow Condensed, sans-serif' }}>
                      Engineered for the Bodyshop
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif' }}>
                      Every Tulda product is formulated for professional results — consistent, reliable, and built for daily use in demanding environments.
                    </p>
                  </div>
                  <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-semibold mt-5 transition-opacity hover:opacity-80"
                    style={{ color: 'var(--primary)', fontFamily: 'Inter, sans-serif' }}>
                    View all products
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Categories */}
                <div className="col-span-5 grid grid-cols-2 gap-8 px-2 py-1">
                  <div>
                    <Link to="/products" className="inline-flex mb-4 text-[13px] font-semibold transition-colors hover:text-[var(--primary)]" style={{ color: 'var(--foreground)', fontFamily: 'Inter, sans-serif' }}>
                      All Products
                    </Link>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>Bodyshop</p>
                    <div className="space-y-0.5">
                      {categoryTree.filter((node) => node.category.slug !== 'industrial').map((node) => (
                        <CategoryMenuLink key={node.category.id} node={node} onNavigate={() => setMegaOpen(false)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 pt-8 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>Industrial</p>
                    <div className="space-y-0.5">
                      {categoryTree.filter((node) => node.category.slug === 'industrial').map((node) => (
                        <CategoryMenuLink key={node.category.id} node={node} onNavigate={() => setMegaOpen(false)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile nav */}
        <nav ref={mobileMenuRef} id="mobile-navigation" aria-label="Mobile navigation" aria-hidden={!mobileOpen} className={'lg:hidden fixed inset-x-0 top-[62px] z-40 h-[calc(100dvh-62px)] overflow-y-auto border-t shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-[opacity,transform,visibility] duration-200 ease-out ' + (mobileOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-2 opacity-0 invisible pointer-events-none')} style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
            <div className="px-6 py-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>Products</p>
              <div className="space-y-1">
                <Link to="/products" className="block min-h-11 py-3 pl-3 text-[14px] font-medium border-l-2" style={{ borderColor: 'var(--primary)', color: 'var(--foreground)', fontFamily: 'Inter, sans-serif' }} onClick={() => setMobileOpen(false)}>
                  All Products
                </Link>
                {categoryTree.map((node) => (
                  <MobileCategoryLink key={node.category.id} node={node} onNavigate={() => setMobileOpen(false)} />
                ))}
              </div>
              <div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                {navLinks.filter((link) => !link.hasMega).map((link) => (
                  <NavLink key={link.label} to={link.to ?? '/'} className="block min-h-11 py-3 text-[14px] font-medium border-b" style={{ borderColor: 'var(--border)', color: 'var(--foreground)', fontFamily: 'Inter, sans-serif' }} onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
        </nav>
      </header>
      <div className="h-[62px] md:hidden" aria-hidden="true" />
    </>
  )
}

interface SearchSuggestionsProps {
  id: string
  query: string
  results: CatalogueProduct[]
  activeIndex: number
  mobile?: boolean
  onHighlight: (index: number) => void
  onSelect: (product: CatalogueProduct) => void
  onViewAll: () => void
}

function CategoryMenuLink({ node, onNavigate }: { node: CategoryTreeNode; onNavigate: () => void }) {
  return (
    <div>
      <Link to={'/products/' + node.category.slug} onClick={onNavigate} className="flex items-center justify-between rounded-sm px-2 py-1.5 text-[13px] font-medium transition-colors hover:bg-[var(--color-brand-soft)] hover:text-[var(--primary)]" style={{ color: 'var(--foreground)', fontFamily: 'Inter, sans-serif' }}>
        <span>{node.category.name}</span>
        <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{node.category.productCount}</span>
      </Link>
      {node.children.map((child) => (
        <Link key={child.category.id} to={'/products/' + child.category.slug} onClick={onNavigate} className="ml-3 flex items-center gap-1 rounded-sm px-2 py-1.5 text-[12px] transition-colors hover:bg-[var(--color-brand-soft)] hover:text-[var(--primary)]" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
          <span aria-hidden="true">↳</span>{child.category.name}
          <span className="ml-auto text-[10px]">{child.category.productCount}</span>
        </Link>
      ))}
    </div>
  )
}

function MobileCategoryLink({ node, onNavigate }: { node: CategoryTreeNode; onNavigate: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center">
        <Link to={'/products/' + node.category.slug} className="flex-1 min-h-11 py-3 pl-3 text-[13px]" style={{ color: 'var(--foreground)', fontFamily: 'Inter, sans-serif' }} onClick={onNavigate}>
          {node.category.name}
        </Link>
        {node.children.length > 0 && (
          <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-11 w-11 items-center justify-center" aria-label={'Show ' + node.category.name + ' subcategories'} aria-expanded={open}>
            <svg className="h-3.5 w-3.5 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none', color: 'var(--muted-foreground)' }} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
            </svg>
          </button>
        )}
      </div>
      {open && node.children.map((child) => (
        <Link key={child.category.id} to={'/products/' + child.category.slug} className="block min-h-10 py-2.5 pl-7 text-[12px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }} onClick={onNavigate}>
          ↳ {child.category.name}
        </Link>
      ))}
    </div>
  )
}

function SearchSuggestions({
  id,
  query,
  results,
  activeIndex,
  mobile = false,
  onHighlight,
  onSelect,
  onViewAll,
}: SearchSuggestionsProps) {
  const resultLabel = results.length === 0 ? 'View all products' : 'View all results for "' + query + '"'

  return (
    <div
      id={id}
      role="listbox"
      aria-label="Product search results"
      className={'absolute left-0 right-0 top-[calc(100%+6px)] z-[60] overflow-hidden border bg-[var(--background)] shadow-[0_12px_28px_rgba(0,0,0,0.12)] ' + (mobile ? 'max-h-[min(60vh,440px)] overflow-y-auto' : '')}
      style={{ borderColor: 'var(--border)' }}
    >
      {results.length > 0 ? (
        <div className="py-1.5">
          {results.map((product, index) => {
            const metadata = product.code || product.categories[0]?.name || 'Tulda product'
            const price = (product.variants.length > 1 ? 'From ' : '') + formatMoney(product.minimumPriceMinor, product.currency)
            const isActive = activeIndex === index

            return (
              <button
                key={product.id}
                id={id.slice(0, -1) + '-' + index}
                type="button"
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => onHighlight(index)}
                onClick={() => onSelect(product)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors"
                style={{ backgroundColor: isActive ? 'var(--color-brand-soft)' : 'transparent' }}
              >
                <img
                  src={getProductCardImage(product)?.path}
                  alt=""
                  className="h-12 w-12 shrink-0 object-contain"
                  loading="lazy"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold" style={{ color: 'var(--foreground)', fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {product.name}
                  </span>
                  <span className="block truncate text-[11px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
                    {metadata} · {price}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <p className="px-3 py-4 text-[13px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
          No products found
        </p>
      )}
      <button
        type="button"
        onClick={onViewAll}
        className="flex min-h-11 w-full items-center border-t px-3 text-left text-[12px] font-semibold transition-colors hover:bg-[var(--color-brand-soft)] focus-visible:bg-[var(--color-brand-soft)]"
        style={{ borderColor: 'var(--border)', color: 'var(--primary)', fontFamily: 'Inter, sans-serif' }}
      >
        {resultLabel} <span aria-hidden="true" className="ml-1">→</span>
      </button>
    </div>
  )
}
