import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CartLineItem from '../features/cart/CartLineItem'
import { useCart } from '../features/cart/CartContext'
import { createQuoteRequest, type QuoteRequestForm } from '../services/orders/createQuoteRequest'
import { supabase } from '../lib/supabase'

const blank: QuoteRequestForm = { fullName: '', company: '', email: '', phone: '', notes: '' }

export default function QuoteRequestPage() {
  const { lines, itemCount, clearCart } = useCart()
  const [form, setForm] = useState(blank)
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const prefillAccountDetails = async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) return
      const { data: profile } = await supabase.from('customer_profiles').select('full_name,phone,company').eq('user_id', auth.user.id).maybeSingle()
      if (!active) return
      setForm((current) => ({
        ...current,
        fullName: current.fullName || profile?.full_name || String(auth.user?.user_metadata.full_name ?? ''),
        email: current.email || auth.user?.email || '',
        phone: current.phone || profile?.phone || '',
        company: current.company || profile?.company || String(auth.user?.user_metadata.company ?? ''),
      }))
    }
    void prefillAccountDetails()
    return () => { active = false }
  }, [])

  const update = (key: keyof QuoteRequestForm, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError('')
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) { setError('Please provide your name, email address and phone number.'); return }
    setBusy(true)
    try { const result = await createQuoteRequest(form, lines); setSuccess(result.request_number); clearCart() } catch { setError('We could not send your enquiry. Please try again or contact us directly.') } finally { setBusy(false) }
  }
  if (success) return <main className="mx-auto max-w-3xl px-6 py-24 text-center"><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--primary)]">Enquiry received</p><h1 className="mt-3 text-5xl font-black">THANK YOU.</h1><p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">Your enquiry #{success} has been sent to the Tulda team. We will contact you to discuss availability, pricing and the right offer for your requirements.</p><Link to="/products" className="tulda-button mt-8">VIEW PRODUCTS</Link></main>
  if (!lines.length) return <main className="mx-auto max-w-4xl px-6 py-20 text-center"><h1 className="text-4xl font-black">YOUR ENQUIRY IS EMPTY</h1><p className="mt-3 text-sm text-[var(--muted-foreground)]">Choose products and quantities, then send us your request.</p><Link to="/products" className="tulda-button mt-7">BROWSE PRODUCTS</Link></main>
  return <main className="mx-auto max-w-6xl px-6 py-10"><nav className="text-xs text-[var(--muted-foreground)]"><Link to="/">Home</Link> / Enquiry</nav><div className="mt-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--primary)]">No online payment</p><h1 className="mt-2 text-5xl font-black">REQUEST A QUOTE</h1><p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">Send your selected products and quantities. Our team will contact you with an individual offer.</p></div><div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]"><form onSubmit={submit} className="border p-6 md:p-8" style={{ borderColor: 'var(--border)' }}><div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><Field label="Full name" value={form.fullName} onChange={(value) => update('fullName', value)} required autoComplete="name" /></div><Field label="Email address" type="email" value={form.email} onChange={(value) => update('email', value)} required autoComplete="email" /><Field label="Phone number" type="tel" value={form.phone} onChange={(value) => update('phone', value)} required autoComplete="tel" /><div className="sm:col-span-2"><Field label="Company (optional)" value={form.company} onChange={(value) => update('company', value)} autoComplete="organization" /></div></div><label className="mt-6 block text-sm font-semibold">Tell us about your requirements (optional)<textarea value={form.notes} onChange={(event) => update('notes', event.target.value)} rows={5} className="tulda-field mt-2 w-full p-3" placeholder="Delivery requirements, preferred contact time or any other details..." /></label>{error && <p role="alert" className="mt-5 text-sm text-[var(--color-danger)]">{error}</p>}<button disabled={busy} className="tulda-button mt-7 w-full">{busy ? 'SENDING ENQUIRY...' : 'SEND ENQUIRY'}</button><p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">This is a request for an offer, not an order or payment.</p></form><aside className="h-fit border bg-[var(--muted)] p-6" style={{ borderColor: 'var(--border)' }}><h2 className="text-2xl font-black">YOUR PRODUCTS</h2><p className="mt-1 text-xs text-[var(--muted-foreground)]">{itemCount} units requested</p><div className="mt-5 space-y-5">{lines.map((line) => <CartLineItem key={line.variantId} line={line} />)}</div><Link to="/products" className="tulda-button-secondary mt-6 w-full">ADD MORE PRODUCTS</Link></aside></div></main>
}

function Field({ label, value, onChange, required = false, type = 'text', autoComplete }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string; autoComplete?: string }) { return <label className="block text-sm font-semibold">{label}<input required={required} type={type} value={value} autoComplete={autoComplete} onChange={(event) => onChange(event.target.value)} className="tulda-field mt-2 w-full px-3" /></label> }
