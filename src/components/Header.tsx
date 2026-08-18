import { useState, useRef, useEffect } from 'react'
import { categories } from '../data/products'

interface HeaderProps {
  cartCount: number
  onCartOpen: () => void
  onNavigateShop: () => void
  onNavigateHome: () => void
}

const navLinks = [
  { label: 'Products', hasMega: true },
  { label: 'Technical Docs', href: '#technical' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Header({ cartCount, onCartOpen, onNavigateShop, onNavigateHome }: HeaderProps) {
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const openMega = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current)
    setMegaOpen(true)
  }
  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 120)
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
        className="sticky top-0 z-50"
        style={{
          backgroundColor: 'var(--background)',
          borderBottom: '1px solid var(--border)',
          transition: 'box-shadow 0.2s',
          boxShadow: scrolled ? '0 1px 16px rgba(0,0,0,0.07)' : 'none',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-[58px]">

            {/* Logo */}
            <button onClick={onNavigateHome} className="flex items-center gap-2.5 shrink-0 mr-8">
              <div
                className="w-7 h-7 flex items-center justify-center font-black text-white rounded-sm text-sm"
                style={{ backgroundColor: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                T
              </div>
              <span
                className="text-[1.2rem] font-black tracking-tight"
                style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '-0.01em', color: 'var(--foreground)' }}
              >
                TULDA
              </span>
            </button>

            {/* Nav */}
            <nav className="hidden lg:flex items-center flex-1">
              {navLinks.map(link => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={link.hasMega ? openMega : undefined}
                  onMouseLeave={link.hasMega ? closeMega : undefined}
                >
                  <a
                    href={link.hasMega ? '#' : link.href}
                    className="flex items-center gap-1 px-3.5 py-1.5 text-[13px] font-medium rounded-sm transition-colors hover:text-[var(--primary)]"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      color: megaOpen && link.hasMega ? 'var(--primary)' : 'var(--foreground)',
                      letterSpacing: '0.005em',
                    }}
                    onClick={e => { if (link.hasMega) { e.preventDefault(); onNavigateShop() } }}
                  >
                    {link.label}
                    {link.hasMega && (
                      <svg
                        className="w-3 h-3"
                        style={{ transition: 'transform 0.15s', transform: megaOpen ? 'rotate(180deg)' : 'none' }}
                        fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
                      </svg>
                    )}
                  </a>
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setSearchOpen(v => !v)}
                className="p-2 rounded-sm transition-colors hover:bg-[var(--muted)]"
                aria-label="Search"
              >
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M20 20l-3.5-3.5" />
                </svg>
              </button>
              <button className="hidden md:flex p-2 rounded-sm transition-colors hover:bg-[var(--muted)]" aria-label="Account">
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <circle cx="12" cy="8" r="4" /><path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </button>
              <button className="hidden md:flex p-2 rounded-sm transition-colors hover:bg-[var(--muted)]" aria-label="Wishlist">
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 3 14.5 3 8.5a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 12.5-9 12.5z" />
                </svg>
              </button>

              {/* Cart */}
              <button
                onClick={onCartOpen}
                className="relative flex items-center gap-1.5 px-3 py-1.5 ml-1 rounded-sm transition-colors hover:bg-[var(--muted)]"
                aria-label={`Cart — ${cartCount} items`}
              >
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 ? (
                  <span
                    className="flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full"
                    style={{ backgroundColor: 'var(--primary)', color: '#fff' }}
                  >
                    {cartCount}
                  </span>
                ) : (
                  <span className="text-[13px] font-medium hidden md:inline" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Cart
                  </span>
                )}
              </button>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="lg:hidden p-2 ml-1 rounded-sm transition-colors hover:bg-[var(--muted)]"
                aria-label="Menu"
              >
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="max-w-[1400px] mx-auto px-6 h-11 flex items-center gap-3">
              <svg className="w-4 h-4 shrink-0" style={{ color: 'var(--muted-foreground)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M20 20l-3.5-3.5" />
              </svg>
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, codes, categories…"
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--muted-foreground)]"
                style={{ fontFamily: 'Inter, sans-serif', color: 'var(--foreground)' }}
                onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
              />
              <button onClick={() => setSearchOpen(false)} className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Esc
              </button>
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
                  <a href="#products" className="inline-flex items-center gap-1.5 text-xs font-semibold mt-5 transition-opacity hover:opacity-80"
                    style={{ color: 'var(--primary)', fontFamily: 'Inter, sans-serif' }}>
                    View all products
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>

                {/* Categories */}
                <div className="col-span-5 grid grid-cols-3 gap-2.5">
                  {categories.map(cat => (
                    <a key={cat.id} href={`#${cat.slug}`}
                      className="group flex items-start gap-3 p-3.5 rounded-sm border transition-all hover:border-[var(--primary)]"
                      style={{ borderColor: 'var(--border)' }}>
                      <div className="w-9 h-9 rounded-sm shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: cat.color, fontFamily: 'Barlow Condensed, sans-serif' }}>
                        {cat.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold mb-0.5 group-hover:text-[var(--primary)] transition-colors"
                          style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.01em' }}>
                          {cat.name}
                        </p>
                        <p className="text-[11px] leading-snug" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
                          {cat.count} products
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="px-6 py-4 space-y-1">
              {navLinks.map(link => (
                <a key={link.label} href={link.href ?? '#'}
                  className="block py-2.5 text-[13px] font-medium border-b"
                  style={{ borderColor: 'var(--border)', fontFamily: 'Inter, sans-serif' }}
                  onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              ))}
              <div className="pt-3 space-y-1">
                {categories.map(cat => (
                  <a key={cat.id} href={`#${cat.slug}`}
                    className="block py-2 pl-3 text-[13px] border-l-2"
                    style={{ borderColor: 'var(--primary)', color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}
                    onClick={() => setMobileOpen(false)}>
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
