import { useState } from 'react'

const contactDetails = [
  { label: 'Phone', value: '+44 (0) 2088 193278', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /> },
  { label: 'Email', value: 'contact@tulda.co.uk', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
  { label: 'Address', value: 'Unit 5B, Tomo Industrial Estate, Cowley, London UB8 2JP', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></> },
]

export default function ContactCTA() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' })
  const inputClassName = 'w-full rounded-lg border border-[#dde5e9] bg-[#f8fafb] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-all placeholder:text-[#89949d] focus:border-[var(--primary)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(24,174,229,0.12)]'

  return (
    <section id="contact" className="bg-[#fbfcfd] py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:py-4">
            <h2 className="mb-6 text-4xl font-black leading-none text-[var(--foreground)] md:text-5xl" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              BOOK A DEMO.<br />WE&apos;LL COME<br /><span className="text-[var(--primary)]">TO YOUR SHOP.</span>
            </h2>
            <p className="mb-10 max-w-xl text-base font-normal leading-relaxed text-[var(--muted-foreground)]">
              Our technical team visits bodyshops across the UK to demonstrate the Tulda range in your own environment. No obligation — just a real-world look at what our products can do for your workflow.
            </p>
            <div className="space-y-5">
              {contactDetails.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="mt-0.5 text-[var(--primary)]"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>{item.icon}</svg></div>
                  <div><p className="mb-0.5 text-xs font-semibold tracking-[0.08em] text-[var(--muted-foreground)]">{item.label.toUpperCase()}</p><p className="text-sm text-[var(--foreground)]">{item.value}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#e3e9ed] bg-white p-6 shadow-[0_20px_50px_rgba(15,26,32,0.07)] sm:p-9">
            <div className="absolute inset-x-0 top-0 h-1 bg-[var(--primary)]" aria-hidden="true" />
            {submitted ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]"><svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                <h3 className="mb-2 text-2xl font-black text-[var(--foreground)]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>REQUEST RECEIVED</h3>
                <p className="text-sm text-[var(--muted-foreground)]">We&apos;ll be in touch within one business day to arrange your demo.</p>
              </div>
            ) : (
              <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }} className="space-y-4">
                <p className="mb-6 text-lg font-bold text-[var(--foreground)]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>BOOK A DEMO OR SEND ENQUIRY</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-medium text-[var(--muted-foreground)]">Full Name *<input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className={`mt-1.5 ${inputClassName}`} placeholder="James Carter" /></label>
                  <label className="block text-xs font-medium text-[var(--muted-foreground)]">Company<input value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} className={`mt-1.5 ${inputClassName}`} placeholder="Carter Bodyshop Ltd" /></label>
                </div>
                <label className="block text-xs font-medium text-[var(--muted-foreground)]">Email Address *<input type="email" required value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className={`mt-1.5 ${inputClassName}`} placeholder="james@carterbodyshop.co.uk" /></label>
                <label className="block text-xs font-medium text-[var(--muted-foreground)]">Phone Number<input type="tel" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className={`mt-1.5 ${inputClassName}`} placeholder="+44 7700 900123" /></label>
                <label className="block text-xs font-medium text-[var(--muted-foreground)]">Message<textarea rows={4} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} className={`mt-1.5 resize-none ${inputClassName}`} placeholder="Tell us about your bodyshop and what you'd like to know about Tulda products…" /></label>
                <button type="submit" className="tulda-button w-full justify-center rounded-lg py-3.5">SEND REQUEST</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
