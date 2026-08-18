interface HeroProps {
  onShopNow: () => void
}

const packshots = [
  { code: 'CT90', label: 'VHS Clearcoat', color: '#1c3a5e', height: 'h-52' },
  { code: 'CT60', label: 'Multi-Clear', color: '#243352', height: 'h-44' },
  { code: 'PT30', label: 'Multiprimer', color: '#2d4a22', height: 'h-48' },
  { code: 'ST10', label: 'Thinner', color: '#3a3a3a', height: 'h-36' },
]

export default function Hero({ onShopNow }: HeroProps) {
  return (
    <section
      style={{
        backgroundColor: '#f7f7f7',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center" style={{ minHeight: '460px' }}>

          {/* Left: copy */}
          <div className="py-12 lg:py-16 pr-0 lg:pr-16">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-5 h-px" style={{ backgroundColor: 'var(--primary)' }} />
              <span
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.2em' }}
              >
                Professional Automotive Refinishing
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-black leading-none mb-5"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                color: 'var(--foreground)',
                letterSpacing: '-0.01em',
                lineHeight: 0.97,
              }}
            >
              Professional Products.
              <br />
              <span style={{ color: 'var(--primary)' }}>Built for Better</span>
              <br />
              Finishes.
            </h1>

            {/* Sub */}
            <p
              className="text-sm leading-relaxed mb-8 max-w-[400px]"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}
            >
              Clearcoats, primers, abrasives and fillers for professional bodyshops. 2K technology, consistent results, free UK delivery over £50.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onShopNow}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.03em',
                }}
              >
                Shop Products
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <a
                href="#categories"
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm border transition-colors hover:border-[var(--foreground)]"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'var(--background)',
                  letterSpacing: '0.03em',
                }}
              >
                Explore Categories
              </a>
            </div>

            {/* Trust micro-bar */}
            <div className="flex flex-wrap gap-5 mt-8 pt-7 border-t" style={{ borderColor: 'var(--border)' }}>
              {[
                { icon: '✓', text: 'Free delivery over £50' },
                { icon: '✓', text: '2K professional grade' },
                { icon: '✓', text: 'Technical support' },
              ].map(t => (
                <span key={t.text} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{t.icon}</span>
                  {t.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right: product visual */}
          <div className="hidden lg:flex items-end justify-center gap-4 pb-0 pt-10 relative overflow-hidden" style={{ minHeight: '460px' }}>
            {/* Faint background image — bodyshop context */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1786489785813-8057d678d91e?w=800&h=600&fit=crop&auto=format"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover object-center"
                style={{ opacity: 0.07 }}
              />
            </div>

            {/* Packshot group */}
            <div className="relative z-10 flex items-end gap-3 pb-8">
              {packshots.map((p, i) => (
                <div
                  key={p.code}
                  className="flex flex-col items-center gap-0 group cursor-pointer"
                  style={{
                    transform: i === 0 ? 'translateY(0)' : i === 1 ? 'translateY(12px)' : i === 2 ? 'translateY(4px)' : 'translateY(20px)',
                  }}
                >
                  {/* Bottle shape */}
                  <div
                    className={`relative w-16 ${p.height} rounded-t-full rounded-b-sm flex flex-col items-center justify-end pb-4 shadow-lg transition-transform duration-200 group-hover:-translate-y-1`}
                    style={{ backgroundColor: p.color }}
                  >
                    {/* Cap */}
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full"
                      style={{ backgroundColor: 'var(--primary)' }}
                    />
                    {/* Label area */}
                    <div className="w-full px-2 text-center">
                      <p
                        className="text-white font-black text-xs leading-tight"
                        style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.65rem', letterSpacing: '0.04em' }}
                      >
                        {p.code}
                      </p>
                      <p
                        className="text-white/50 leading-tight mt-0.5"
                        style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.5rem' }}
                      >
                        {p.label}
                      </p>
                    </div>
                    {/* Tulda brand stripe */}
                    <div
                      className="absolute left-0 right-0 h-0.5"
                      style={{ top: '55%', backgroundColor: 'rgba(255,255,255,0.15)' }}
                    />
                  </div>

                  {/* Shadow under bottle */}
                  <div
                    className="w-12 h-1.5 rounded-full mt-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                  />
                </div>
              ))}
            </div>

            {/* Floating product badge */}
            <div
              className="absolute top-12 right-10 p-3 rounded-sm shadow-md"
              style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
              }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
                style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.12em' }}
              >
                New in
              </p>
              <p
                className="text-sm font-bold"
                style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--foreground)', lineHeight: 1.2 }}
              >
                CT90 VHS
                <br />Speedline
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: 'var(--primary)', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                From £35.34
              </p>
            </div>

            {/* Accent rule left edge */}
            <div
              className="absolute left-0 top-12 bottom-8 w-px"
              style={{ backgroundColor: 'var(--border)' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
