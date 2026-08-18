import { useState } from 'react'

export default function ContactCTA() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      id="contact"
      className="py-20 md:py-28"
      style={{ backgroundColor: 'var(--surface-dark)' }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: info */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.18em' }}
            >
              Get in Touch
            </p>
            <h2
              className="text-4xl md:text-5xl font-black leading-none mb-6"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--surface-dark-foreground)' }}
            >
              BOOK A DEMO.
              <br />
              WE'LL COME
              <br />
              <span style={{ color: 'var(--primary)' }}>TO YOUR SHOP.</span>
            </h2>
            <p
              className="text-base leading-relaxed mb-10"
              style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
            >
              Our technical team visits bodyshops across the UK to demonstrate the Tulda range in your own environment. No obligation — just a real-world look at what our products can do for your workflow.
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                  label: 'Phone',
                  value: '+44 (0) 2088 193278',
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  label: 'Email',
                  value: 'contact@tulda.co.uk',
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  label: 'Address',
                  value: 'Unit 5B, Tomo Industrial Estate, Cowley, London UB8 2JP',
                },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div style={{ color: 'var(--primary)' }}>{item.icon}</div>
                  <div>
                    <p
                      className="text-xs font-semibold mb-0.5"
                      style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em' }}
                    >
                      {item.label.toUpperCase()}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: 'var(--surface-dark-foreground)', fontFamily: 'Inter, sans-serif' }}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div
            className="p-8 rounded-sm"
            style={{ backgroundColor: 'var(--surface-dark-secondary)' }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3
                  className="text-2xl font-black mb-2"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--surface-dark-foreground)' }}
                >
                  Request Received
                </h3>
                <p
                  className="text-sm"
                  style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif' }}
                >
                  We'll be in touch within one business day to arrange your demo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p
                  className="text-lg font-bold mb-6"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--surface-dark-foreground)', letterSpacing: '0.02em' }}
                >
                  Book a Demo or Send Enquiry
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm rounded-sm border outline-none transition-colors focus:border-[var(--primary)]"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        borderColor: 'rgba(255,255,255,0.12)',
                        color: 'var(--surface-dark-foreground)',
                        fontFamily: 'Inter, sans-serif',
                      }}
                      placeholder="James Carter"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif' }}>
                      Company
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm rounded-sm border outline-none transition-colors focus:border-[var(--primary)]"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        borderColor: 'rgba(255,255,255,0.12)',
                        color: 'var(--surface-dark-foreground)',
                        fontFamily: 'Inter, sans-serif',
                      }}
                      placeholder="Carter Bodyshop Ltd"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-sm border outline-none transition-colors focus:border-[var(--primary)]"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      borderColor: 'rgba(255,255,255,0.12)',
                      color: 'var(--surface-dark-foreground)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    placeholder="james@carterbodyshop.co.uk"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-sm border outline-none transition-colors focus:border-[var(--primary)]"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      borderColor: 'rgba(255,255,255,0.12)',
                      color: 'var(--surface-dark-foreground)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    placeholder="+44 7700 900123"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif' }}>
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-sm border outline-none transition-colors focus:border-[var(--primary)] resize-none"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      borderColor: 'rgba(255,255,255,0.12)',
                      color: 'var(--surface-dark-foreground)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    placeholder="Tell us about your bodyshop and what you'd like to know about Tulda products…"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 text-sm font-semibold rounded-sm transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.06em',
                  }}
                >
                  SEND REQUEST
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
