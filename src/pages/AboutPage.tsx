import { Link } from 'react-router-dom'

const workflow = [
  {
    number: '01',
    title: 'Prepare with precision',
    description: 'Abrasives, fillers and preparation products that help create a dependable foundation for every repair.',
    href: '/products/abrasives',
    linkLabel: 'Explore preparation'
  },
  {
    number: '02',
    title: 'Build the system',
    description: 'Professional primers, hardeners and clearcoats designed to work together through the refinishing process.',
    href: '/products/primer',
    linkLabel: 'Explore primers'
  },
  {
    number: '03',
    title: 'Finish with confidence',
    description: 'Practical product support and on-site demonstrations to help bodyshops get the best from every system.',
    href: '/contact',
    linkLabel: 'Talk to Tulda'
  }
]

const commitments = [
  {
    title: 'Made for the working day',
    description: 'The range is built around the needs of busy bodyshops: clear product choices, efficient application and reliable results.'
  },
  {
    title: 'A complete refinishing range',
    description: 'From surface preparation to final clearcoat, Tulda brings the essential stages of professional refinishing together.'
  },
  {
    title: 'Real technical support',
    description: 'Our team can support product selection, system demonstrations and day-to-day application questions.'
  }
]

export default function AboutPage() {
  return (
    <main>
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 py-14 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="max-w-xl">
            <h1 className="text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
              PRODUCTS BUILT
              <br />
              FOR THE <span style={{ color: 'var(--primary)' }}>BODYSHOP.</span>
            </h1>
            <p className="mt-7 text-base leading-relaxed md:text-lg" style={{ color: 'var(--muted-foreground)' }}>
              Tulda is a professional automotive refinishing brand focused on helping bodyshops work efficiently, repair with confidence and deliver a consistent finish.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="tulda-button px-6">EXPLORE PRODUCTS</Link>
              <Link to="/contact" className="tulda-button-secondary px-6">BOOK A DEMO</Link>
            </div>
          </div>

          <figure className="relative min-h-[320px] overflow-hidden bg-[#071519] md:min-h-[430px]">
            <img
              src="/assets/campaign/tulda-workshop-range.jpg"
              alt="Tulda professional refinishing products in a working bodyshop"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,21,27,0.42),rgba(7,21,27,0.04)_65%)]" aria-hidden="true" />
            <figcaption className="absolute bottom-0 left-0 max-w-[280px] border-t border-r border-white/25 bg-[#071519]/90 px-5 py-4 text-sm leading-relaxed text-white">
              Professional products, developed for the pace and precision of real refinishing work.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <h2 className="text-4xl font-black leading-[0.92] tracking-tight md:text-6xl">
            A BETTER FINISH
            <br />
            STARTS WITH A <span style={{ color: 'var(--primary)' }}>BETTER SYSTEM.</span>
          </h2>
          <p className="max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: 'var(--muted-foreground)' }}>
            We see refinishing as one connected process. That is why the Tulda range brings together the products used before, during and after every repair — with practical support behind them.
          </p>
        </div>

        <div className="mt-12 grid gap-px border md:grid-cols-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--border)' }}>
          {workflow.map((step) => (
            <article key={step.number} className="group bg-white p-7 md:p-8">
              <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{step.number}</span>
              <h3 className="mt-8 text-2xl font-black leading-tight">{step.title}</h3>
              <p className="mt-4 max-w-lg text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{step.description}</p>
              <Link
                to={step.href}
                className="mt-7 inline-flex items-center gap-2 border-b pb-1 text-sm font-bold transition-colors hover:text-[#18AEE5]"
                style={{ borderColor: 'var(--primary)' }}
              >
                {step.linkLabel} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--surface-dark)' }}>
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-16">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black leading-[0.92] text-white md:text-6xl">
                MADE FOR THE
                <br />
                <span style={{ color: 'var(--primary)' }}>WORKSHOP FLOOR.</span>
              </h2>
              <p className="mt-7 text-base leading-relaxed md:text-lg" style={{ color: 'var(--surface-dark-muted)' }}>
                Great products need to perform beyond the specification sheet. Tulda is made to support the practical work that happens in busy bodyshops, every day.
              </p>
            </div>

            <figure className="aspect-[3/2] overflow-hidden bg-[#071519]">
              <img
                src="/assets/campaign/tulda-ct60-application.jpg"
                alt="Tulda CT60 HS being used in a professional refinishing environment"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </figure>
          </div>

          <div className="mt-12 grid gap-px border border-white/15 bg-white/15 md:grid-cols-3">
            {commitments.map((commitment, index) => (
              <article key={commitment.title} className="bg-[var(--surface-dark)] p-7 md:p-8">
                <span className="text-sm font-black" style={{ color: 'var(--primary)' }}>0{index + 1}</span>
                <h3 className="mt-8 text-xl font-bold text-white">{commitment.title}</h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--surface-dark-muted)' }}>{commitment.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <figure className="relative min-h-[300px] overflow-hidden md:min-h-[430px]">
            <img
              src="/assets/campaign/tulda-abrasives-range.jpg"
              alt="Tulda abrasives and sanding products prepared for professional use"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </figure>
          <div className="flex flex-col justify-between border p-8 md:p-10" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
            <div>
              <h2 className="text-4xl font-black leading-[0.92]">
                READY TO BUILD
                <br />
                YOUR <span style={{ color: 'var(--primary)' }}>SYSTEM?</span>
              </h2>
              <p className="mt-6 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Explore the range, find products for your process or speak with our team about an on-site product demonstration.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/products" className="tulda-button px-5">VIEW PRODUCTS</Link>
              <Link to="/contact" className="tulda-button-secondary px-5">CONTACT TULDA</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
