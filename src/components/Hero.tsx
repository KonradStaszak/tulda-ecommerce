import { useState } from 'react'
import { Link } from 'react-router-dom'
import TrustBar from './TrustBar'

export default function Hero() {
  const [isVideoReady, setIsVideoReady] = useState(false)

  return (
    <section className="relative isolate flex h-[640px] flex-col overflow-hidden bg-[#071218] text-white md:block md:h-auto">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onCanPlay={() => setIsVideoReady(true)}
        className={`absolute inset-0 z-0 transition-opacity duration-300 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }}
      >
        <source src="/assets/campaign/hero-workshop.mp4" type="video/mp4" />
      </video>
      <div className="hero-video-overlay absolute inset-0 z-[1]" />

      <div className="relative z-[2] mx-auto flex w-full max-w-[1400px] flex-1 items-start px-6 pb-4 pt-20 md:min-h-[590px] md:pb-20 md:pt-36">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-black leading-[0.86] tracking-tight sm:text-7xl md:text-8xl">
            Professional Products.<br />
            <span className="text-[var(--color-brand)]">Built for Better</span><br />
            Finishes.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:mt-7 md:text-lg">
            Clearcoats, primers, abrasives and fillers for professional bodyshops. 2K technology, consistent results, free UK delivery over £50.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
            <Link to="/products" className="tulda-button">Shop Products <span aria-hidden="true">→</span></Link>
            <Link to="/products" className="inline-flex min-h-11 items-center justify-center border border-white/60 bg-white/10 px-5 text-xs font-bold text-white transition-colors hover:bg-white hover:text-[#071218]">Explore Categories</Link>
          </div>
        </div>
      </div>

      <div className="relative z-[2] mt-auto"><TrustBar overlay /></div>
    </section>
  )
}
