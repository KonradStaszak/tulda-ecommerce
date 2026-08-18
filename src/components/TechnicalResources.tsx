const resources = [
  {
    type: 'PDF',
    title: 'CT90 VHS Clearcoat — Technical Data Sheet',
    description: 'Application instructions, mixing ratios, drying times, and substrate compatibility for CT90.',
    tags: ['Clearcoat', 'TDS'],
    updated: 'Jan 2025',
  },
  {
    type: 'PDF',
    title: 'CT60 Multi-Clear — Product Safety Data Sheet',
    description: 'Full safety data, hazard classifications, handling requirements, and environmental guidance.',
    tags: ['Clearcoat', 'SDS'],
    updated: 'Jan 2025',
  },
  {
    type: 'PDF',
    title: 'PT30 Multiprimer — Technical Data Sheet',
    description: 'Complete application guide for PT30 including 4:1 mixing, overcoat windows, and substrate prep.',
    tags: ['Primer', 'TDS'],
    updated: 'Dec 2024',
  },
  {
    type: 'GUIDE',
    title: 'Clearcoat Application Best Practices',
    description: 'Step-by-step guide to spray gun setup, flash times, and achieving a blemish-free clearcoat finish.',
    tags: ['Application', 'Guide'],
    updated: 'Nov 2024',
  },
  {
    type: 'GUIDE',
    title: 'Sanding Film vs. Paper Discs — When to Use Which',
    description: 'Technical guide comparing Tulda abrasive types across common bodyshop applications and substrates.',
    tags: ['Abrasives', 'Guide'],
    updated: 'Oct 2024',
  },
  {
    type: 'PDF',
    title: 'Mixing Ratio Reference Card — Full Range',
    description: 'Quick-reference card covering mix ratios, pot life, and thinner selection for all Tulda 2K products.',
    tags: ['Reference', 'All Products'],
    updated: 'Jan 2025',
  },
]

const typeColors: Record<string, string> = {
  PDF: '#1c3a5e',
  GUIDE: '#2d4a22',
}

export default function TechnicalResources() {
  return (
    <section
      id="technical"
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
              Resources
            </p>
            <h2
              className="text-4xl md:text-5xl font-black leading-none"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--foreground)' }}
            >
              TECHNICAL
              <br />
              <span style={{ color: 'var(--primary)' }}>DOCUMENTS</span>
            </h2>
          </div>
          <p
            className="text-sm max-w-sm"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}
          >
            Data sheets, safety information, and application guides for the full Tulda product range.
          </p>
        </div>

        {/* Resources grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(r => (
            <a
              key={r.title}
              href="#technical"
              className="group flex flex-col p-5 border rounded-sm transition-all duration-150 hover:border-[var(--foreground)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <span
                  className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-white rounded-sm"
                  style={{
                    backgroundColor: typeColors[r.type] ?? 'var(--graphite)',
                    fontFamily: 'Barlow Condensed, sans-serif',
                    letterSpacing: '0.1em',
                  }}
                >
                  {r.type}
                </span>
                <svg
                  className="w-4 h-4 mt-0.5 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>

              <p
                className="text-sm font-semibold leading-snug mb-2 group-hover:text-[var(--primary)] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', color: 'var(--foreground)' }}
              >
                {r.title}
              </p>
              <p
                className="text-xs leading-relaxed flex-1 mb-4"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}
              >
                {r.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {r.tags.map(t => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 text-[10px] rounded-sm"
                      style={{
                        backgroundColor: 'var(--muted)',
                        color: 'var(--muted-foreground)',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span
                  className="text-[10px]"
                  style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}
                >
                  Updated {r.updated}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 p-6 flex flex-col md:flex-row items-center justify-between gap-4 rounded-sm border"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Need a document not listed here?
            </p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
              Contact our technical team and we will send you the correct documentation within 24 hours.
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-sm border transition-colors hover:bg-[var(--foreground)] hover:text-[var(--background)]"
            style={{
              borderColor: 'var(--foreground)',
              color: 'var(--foreground)',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.06em',
            }}
          >
            CONTACT TECHNICAL SUPPORT
          </a>
        </div>
      </div>
    </section>
  )
}
