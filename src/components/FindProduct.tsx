import { useState } from 'react'

const substrates = [
  'Bare Metal', 'Aluminium', 'Galvanised Steel', 'Polyester / GRP',
  'Existing Paint', 'Plastic / Bumpers',
]
const applications = [
  'Full Respray', 'Panel Repair', 'Spot Repair', 'Primer & Prep',
  'Filling & Levelling', 'Industrial / Fleet',
]

interface Result {
  title: string
  products: string[]
  description: string
}

const recommendations: Record<string, Result> = {
  'Bare Metal_Full Respray': {
    title: 'Bare Metal → Full Respray',
    products: ['PT30 Multiprimer', 'CT90 VHS Clearcoat'],
    description: 'Start with PT30 Multiprimer (4:1) for maximum adhesion and corrosion resistance on bare metal. Topcoat with CT90 VHS Clearcoat for a premium gloss finish with long-term durability.',
  },
  'Aluminium_Panel Repair': {
    title: 'Aluminium → Panel Repair',
    products: ['BT01 Bodyfiller', 'PT30 Multiprimer', 'CT60 Multi-Clear'],
    description: 'Apply BT01 Bodyfiller for levelling — excellent adhesion on aluminium. Prime with PT30, finish with CT60 for UV-resistant high gloss.',
  },
  'Existing Paint_Spot Repair': {
    title: 'Existing Paint → Spot Repair',
    products: ['CT50 ECOCLEAR', 'ST10 Universal Thinner'],
    description: 'CT50 ECOCLEAR is ideal for fast-turnaround spot repairs — rapid cure with easy application. Use ST10 thinner to adjust viscosity for spray gun application.',
  },
  default: {
    title: 'Recommended Starting Point',
    products: ['PT30 Multiprimer', 'CT60 Multi-Clear'],
    description: 'For most bodyshop applications, PT30 Multiprimer with CT60 Multi-Clear provides a versatile, proven combination. Contact our technical team for substrate-specific advice.',
  },
}

export default function FindProduct() {
  const [substrate, setSubstrate] = useState('')
  const [application, setApplication] = useState('')
  const result = substrate && application
    ? (recommendations[`${substrate}_${application}`] ?? recommendations.default)
    : null

  return (
    <section
      id="find-product"
      className="py-20 md:py-28"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: selector */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.18em' }}
            >
              Product Selector
            </p>
            <h2
              className="text-4xl md:text-5xl font-black leading-none mb-4"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--foreground)' }}
            >
              FIND THE RIGHT
              <br />
              <span style={{ color: 'var(--primary)' }}>PRODUCT</span>
              <br />
              FOR THE JOB
            </h2>
            <p
              className="text-sm leading-relaxed mb-10"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}
            >
              Tell us what you are working with and we will recommend the correct Tulda products for your application.
            </p>

            {/* Step 1: Substrate */}
            <div className="mb-8">
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: 'var(--foreground)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}
              >
                1. What is the substrate?
              </p>
              <div className="flex flex-wrap gap-2">
                {substrates.map(s => (
                  <button
                    key={s}
                    onClick={() => setSubstrate(s)}
                    className="px-3 py-2 text-xs font-medium rounded-sm border transition-all"
                    style={{
                      borderColor: substrate === s ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: substrate === s ? 'var(--primary)' : 'var(--background)',
                      color: substrate === s ? 'var(--primary-foreground)' : 'var(--foreground)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Application */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: 'var(--foreground)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}
              >
                2. What is the application?
              </p>
              <div className="flex flex-wrap gap-2">
                {applications.map(a => (
                  <button
                    key={a}
                    onClick={() => setApplication(a)}
                    className="px-3 py-2 text-xs font-medium rounded-sm border transition-all"
                    style={{
                      borderColor: application === a ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: application === a ? 'var(--primary)' : 'var(--background)',
                      color: application === a ? 'var(--primary-foreground)' : 'var(--foreground)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: result */}
          <div className="lg:pt-20">
            {result ? (
              <div
                className="p-8 border rounded-sm"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
              >
                <div
                  className="w-12 h-1 mb-6 rounded-full"
                  style={{ backgroundColor: 'var(--primary)' }}
                />
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.14em' }}
                >
                  Recommended Products
                </p>
                <h3
                  className="text-2xl font-black mb-4"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--foreground)' }}
                >
                  {result.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}
                >
                  {result.description}
                </p>
                <div className="space-y-2 mb-8">
                  {result.products.map(p => (
                    <div
                      key={p}
                      className="flex items-center gap-3 p-3 rounded-sm border"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: 'var(--primary)' }}
                      />
                      <span
                        className="text-sm font-semibold"
                        style={{ fontFamily: 'Inter, sans-serif', color: 'var(--foreground)' }}
                      >
                        {p}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-3 text-xs font-semibold rounded-sm transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      fontFamily: 'Inter, sans-serif',
                      letterSpacing: '0.06em',
                    }}
                  >
                    SHOP THESE PRODUCTS
                  </button>
                  <button
                    onClick={() => { setSubstrate(''); setApplication('') }}
                    className="px-4 py-3 text-xs font-semibold rounded-sm border transition-colors hover:bg-[var(--muted)]"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="p-8 border rounded-sm border-dashed flex flex-col items-center justify-center text-center"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', minHeight: '360px' }}
              >
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'var(--border)' }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--muted-foreground)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: 'var(--foreground)', fontFamily: 'Inter, sans-serif' }}
                >
                  Select substrate and application
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}
                >
                  We'll match you with the right Tulda products for the job.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
