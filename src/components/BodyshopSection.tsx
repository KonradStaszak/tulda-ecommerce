const features = [
  {
    number: '01',
    title: 'Formulated for Daily Volume',
    body: 'Tulda products are engineered for high-throughput bodyshop environments — fast curing times, consistent results, and simplified application mean more cars through your bay each week.',
  },
  {
    number: '02',
    title: '2K Technology Throughout',
    body: 'Our 2-component system ensures maximum durability, chemical resistance, and colour retention across every product in the range — from primer to clearcoat.',
  },
  {
    number: '03',
    title: 'Technical Support On-Site',
    body: 'We offer on-site demonstrations and direct technical assistance. When you need help with application, mixing, or substrate compatibility, we are a call away.',
  },
  {
    number: '04',
    title: 'Consistent Supply Chain',
    body: 'Stocked and shipped from our London distribution centre. Free next-day delivery on orders over £50 means your team never runs short mid-job.',
  },
]

export default function BodyshopSection() {
  return (
    <section
      id="about"
      className="py-20 md:py-28"
      style={{ backgroundColor: 'var(--surface-dark)' }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: image */}
          <div className="relative">
            <div
              className="aspect-[3/2] overflow-hidden rounded-sm"
              style={{ backgroundColor: '#1a1a1a' }}
            >
            <img
          src="/assets/campaign/tulda-abrasives-in-use.jpg"
          alt="Tulda abrasives prepared for professional bodyshop work"
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ opacity: 0.85 }}
            />
            </div>

            {/* Floating stat card */}
            <div
              className="absolute -right-4 md:-right-8 bottom-8 p-5 rounded-sm"
              style={{ backgroundColor: 'var(--primary)', minWidth: '180px' }}
            >
              <p
                className="text-white text-4xl font-black leading-none"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                15+
              </p>
              <p
                className="text-white/80 text-xs mt-1"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Professional products<br />in the Tulda range
              </p>
            </div>

            {/* Accent line */}
            <div
              className="absolute -left-4 top-8 w-1 h-24"
              style={{ backgroundColor: 'var(--primary)' }}
            />
          </div>

          {/* Right: content */}
          <div>
            <h2
              className="text-4xl md:text-5xl font-black leading-none mb-6"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--surface-dark-foreground)' }}
            >
              MADE FOR
              <br />
              THE BODYSHOP
            </h2>
            <p
              className="text-base leading-relaxed mb-10"
              style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
            >
              Tulda is a professional refinish brand built around the real demands of the automotive bodyshop. Our products are tested and proven in working environments — not just in a lab.
            </p>

            {/* Features list */}
            <div className="space-y-8">
              {features.map(f => (
                <div key={f.number} className="flex gap-5">
                  <span
                    className="text-xs font-black mt-1 shrink-0 w-8"
                    style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.04em' }}
                  >
                    {f.number}
                  </span>
                  <div>
                    <p
                      className="text-base font-semibold mb-1.5"
                      style={{ color: 'var(--surface-dark-foreground)', fontFamily: 'Inter, sans-serif' }}
                    >
                      {f.title}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                    >
                      {f.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
