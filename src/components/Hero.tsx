import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface HeroSlide {
  id: string
  eyebrow: string
  title: string
  description: string
  href: string
  cta: string
  src: string
  alt: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 'professional-range',
    eyebrow: 'Professional refinishing range',
    title: 'Everything for a better finish',
    description:
      'A complete professional range for preparation, repair and a consistent final finish.',
    href: '/products',
    cta: 'Explore the range',
    src: '/assets/campaign/tulda-workshop-range.jpg',
    alt: 'Tulda professional refinishing range in front of a vehicle',
  },
  {
    id: 'clearcoat-systems',
    eyebrow: 'Clearcoat systems',
    title: 'Clearcoats & hardeners',
    description:
      'Professional 2K systems designed for durable, consistent high-gloss finishes.',
    href: '/products/clearcoat',
    cta: 'Explore clearcoats',
    src: '/assets/campaign/tulda-ct60-application.jpg',
    alt: 'Tulda clearcoat system in a professional automotive refinishing workshop',
  },
  {
    id: 'surface-preparation',
    eyebrow: 'Surface preparation',
    title: 'Abrasives for every stage',
    description:
      'Professional discs and strips for efficient shaping, sanding and surface preparation.',
    href: '/products/abrasives',
    cta: 'Explore abrasives',
    src: '/assets/campaign/tulda-abrasives-range.jpg',
    alt: 'Tulda professional abrasives range',
  },
]

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSlide = heroSlides[activeIndex]

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % heroSlides.length)
    }, 6000)

    return () => window.clearInterval(interval)
  }, [])

  const showPrevious = () => {
    setActiveIndex(
      (currentIndex) => (currentIndex - 1 + heroSlides.length) % heroSlides.length,
    )
  }

  const showNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % heroSlides.length)
  }

  const navigationButtonClassName =
    'relative flex h-9 w-9 items-center justify-center overflow-hidden border border-white/70 bg-black/15 text-[0px] text-transparent transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--color-brand)]'

  return (
    <section className="bg-[var(--color-surface)]">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 px-6 py-14 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="flex min-h-[340px] items-center lg:min-h-[430px]">
          <div className="max-w-xl">
            <h1 className="text-5xl font-black leading-[0.92] tracking-tight text-[var(--foreground)] md:text-7xl">
              Professional Products.
              <br />
              <span className="text-[var(--color-brand)]">Built for Better</span>
              <br />
              Finishes.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: 'var(--muted-foreground)' }}>
              Clearcoats, primers, abrasives and fillers for professional bodyshops.
              2K technology, consistent results, free UK delivery over £50.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="tulda-button"
              >
                Shop Products <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/products"
                className="tulda-button-secondary"
              >
                Explore Categories
              </Link>
            </div>
          </div>
        </div>

        <div
          className="relative min-h-[320px] overflow-hidden bg-[#071218] md:min-h-[430px]"
          aria-label="Tulda product range"
        >
          <div className="absolute inset-0" key={activeSlide.id}>
            <img
              src={activeSlide.src}
              alt={activeSlide.alt}
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,13,22,0.92)_0%,rgba(2,13,22,0.62)_50%,rgba(2,13,22,0.1)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(0deg,rgba(2,13,22,0.95)_0%,rgba(2,13,22,0.48)_52%,transparent_100%)]" />
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-brand)]">
              {activeSlide.eyebrow}
            </p>
            <h2 className="mt-3 max-w-[430px] text-4xl font-black leading-[0.92] tracking-tight text-white md:text-6xl">
              {activeSlide.title}
            </h2>
            <p className="mt-3 max-w-[430px] text-sm leading-6 text-slate-200">
              {activeSlide.description}
            </p>
            <Link
              to={activeSlide.href}
              className="mt-5 inline-flex items-center gap-2 border-b border-[var(--color-brand)] pb-1 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:text-[var(--color-brand)]"
            >
              {activeSlide.cta} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="absolute right-5 top-5 z-10 flex gap-2 sm:right-6 sm:top-6">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Show previous range"
              className={navigationButtonClassName}
            >
              <svg aria-hidden="true" className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
              ←
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Show next range"
              className={navigationButtonClassName}
            >
              <svg aria-hidden="true" className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
              →
            </button>
          </div>

          <div className="absolute bottom-6 right-6 z-10 flex gap-2 sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-10">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={'Show ' + slide.title}
                aria-current={index === activeIndex ? 'true' : undefined}
                className={
                  'h-1.5 w-5 transition-colors ' +
                  (index === activeIndex
                    ? 'bg-[var(--color-brand)]'
                    : 'bg-white/55 hover:bg-white')
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
