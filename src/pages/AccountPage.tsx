import { FormEvent, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type Mode = 'login' | 'register'
const customerDb = supabase as unknown as { from: (table: string) => any }

type CustomerProfile = { full_name: string; phone: string; company: string; address_line_1: string; address_line_2: string; city: string; region: string; postcode: string; country: string }
const emptyProfile: CustomerProfile = { full_name: '', phone: '', company: '', address_line_1: '', address_line_2: '', city: '', region: '', postcode: '', country: '' }

export default function AccountPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [session, setSession] = useState<Session | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode)
    setMessage('')
    setError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (mode === 'register' && password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    setSubmitting(true)
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: window.location.origin + '/account',
          },
        })
    setSubmitting(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    if (mode === 'register' && !result.data.session) {
      setMessage('Check your inbox to confirm your email address, then return here to sign in.')
      setPassword('')
    }
  }

  const handleSignOut = async () => {
    setError('')
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) setError(signOutError.message)
  }

  if (session) {
    return <CustomerDashboard user={session.user} onSignOut={handleSignOut} />
  }

  return (
    <main className="mx-auto grid max-w-[1400px] gap-10 px-6 py-16 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <section className="flex flex-col justify-between bg-[var(--surface-dark)] p-8 text-white md:p-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--primary)' }}>Tulda customer account</p>
          <h1 className="mt-5 text-5xl font-black leading-[0.92] md:text-6xl">
            PRODUCTS FOR<br />
            <span style={{ color: 'var(--primary)' }}>PROFESSIONALS.</span>
          </h1>
        </div>
        <p className="mt-16 max-w-md text-base leading-relaxed" style={{ color: 'var(--surface-dark-muted)' }}>
          Sign in to keep your customer details ready for checkout and manage your orders as the account area expands.
        </p>
      </section>

      <section className="max-w-xl lg:pt-4">
        <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
          <button type="button" onClick={() => switchMode('login')} className={'min-h-11 border-b-2 px-1 pr-6 text-sm font-bold transition-colors ' + (mode === 'login' ? 'border-[var(--primary)] text-[var(--foreground)]' : 'border-transparent text-[var(--muted-foreground)]')}>
            SIGN IN
          </button>
          <button type="button" onClick={() => switchMode('register')} className={'min-h-11 border-b-2 px-1 text-sm font-bold transition-colors ' + (mode === 'register' ? 'border-[var(--primary)] text-[var(--foreground)]' : 'border-transparent text-[var(--muted-foreground)]')}>
            CREATE ACCOUNT
          </button>
        </div>

        <h2 className="mt-10 text-4xl font-black leading-[0.92] md:text-5xl">{mode === 'login' ? 'SIGN IN TO YOUR ACCOUNT.' : 'CREATE YOUR ACCOUNT.'}</h2>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          {mode === 'login' ? 'Use the email address and password linked to your Tulda account.' : 'Create an account to save time when ordering professional products.'}
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {mode === 'register' && <label className="block text-sm font-semibold">Full name<input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" className="tulda-field mt-2 w-full px-3" /></label>}
          <label className="block text-sm font-semibold">Email address<input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" autoComplete="email" className="tulda-field mt-2 w-full px-3" /></label>
          <label className="block text-sm font-semibold">Password<input value={password} onChange={(event) => setPassword(event.target.value)} required type="password" minLength={mode === 'register' ? 8 : undefined} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className="tulda-field mt-2 w-full px-3" /></label>
          {mode === 'register' && <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Use at least 8 characters.</p>}
          {error && <p className="border p-3 text-sm" role="alert" style={{ borderColor: 'var(--color-danger)', backgroundColor: 'var(--color-danger-soft)', color: 'var(--color-danger)' }}>{error}</p>}
          {message && <p className="border p-3 text-sm" role="status" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--color-brand-soft)' }}>{message}</p>}
          <button type="submit" disabled={submitting} className="tulda-button w-full disabled:opacity-60">{submitting ? 'PLEASE WAIT...' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</button>
        </form>
      </section>
    </main>
  )
}

function CustomerDashboard({ user, onSignOut }: { user: User; onSignOut: () => Promise<void> }) {
  const [profile, setProfile] = useState<CustomerProfile>(emptyProfile)
  const [orders, setOrders] = useState<Array<{ id: string; order_number: number; created_at: string; order_status: string; payment_status: string; subtotal_minor: number; currency: string }>>([])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [profileResult, orderResult] = await Promise.all([
        customerDb.from('customer_profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('orders').select('id, order_number, created_at, order_status, payment_status, subtotal_minor, currency').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])
      if (profileResult.data) setProfile({ ...emptyProfile, ...profileResult.data })
      if (orderResult.data) setOrders(orderResult.data)
    }
    void load()
  }, [user.id])

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError(''); setStatus('')
    const { error: saveError } = await customerDb.from('customer_profiles').upsert({ user_id: user.id, ...profile })
    setSaving(false)
    if (saveError) setError('We could not save your details. Please try again.')
    else setStatus('Your account details and delivery address have been saved.')
  }

  const deleteAccount = async () => {
    if (!window.confirm('Delete your Tulda account permanently? This cannot be undone.')) return
    setError('')
    const { error: deletionError } = await supabase.functions.invoke('delete-customer-account')
    if (deletionError) { setError('We could not delete your account. Please try again.'); return }
    await onSignOut()
  }

  const update = (field: keyof CustomerProfile, value: string) => setProfile((current) => ({ ...current, [field]: value }))
  const customerName = profile.full_name || String(user.user_metadata.full_name || user.email || 'Customer')
  return <main className="mx-auto max-w-[1400px] px-6 py-16 md:py-24">
    <div className="flex flex-wrap items-end justify-between gap-5 border-b pb-8" style={{ borderColor: 'var(--border)' }}><div><p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--primary)' }}>Customer dashboard</p><h1 className="mt-3 text-5xl font-black leading-[0.92] md:text-6xl">WELCOME, {customerName.toUpperCase()}.</h1><p className="mt-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>{user.email}</p></div><button type="button" onClick={onSignOut} className="tulda-button-secondary">SIGN OUT</button></div>
    <div className="mt-12 grid gap-12 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="space-y-12"><section><h2 className="text-3xl font-black">YOUR ORDERS</h2>{orders.length ? <div className="mt-6 divide-y border" style={{ borderColor: 'var(--border)' }}>{orders.map((order) => <article key={order.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><p className="font-bold">ORDER #{order.order_number}</p><p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>{new Date(order.created_at).toLocaleDateString('en-GB')} · {order.order_status.replace('_', ' ')}</p></div><strong>£{(order.subtotal_minor / 100).toFixed(2)}</strong></article>)}</div> : <p className="mt-5 border p-5 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>No orders are linked to this account yet.</p>}</section>
      </div>
      <div><section className="border p-6 md:p-8" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}><h2 className="text-3xl font-black">ACCOUNT & DELIVERY</h2><p className="mt-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>Your saved address can be used at checkout.</p><form className="mt-7 grid gap-4 sm:grid-cols-2" onSubmit={saveProfile}>{([['full_name', 'Full name'], ['phone', 'Phone'], ['company', 'Company'], ['address_line_1', 'Address line 1'], ['address_line_2', 'Address line 2'], ['city', 'City'], ['region', 'County / region'], ['postcode', 'Postcode'], ['country', 'Country']] as Array<[keyof CustomerProfile, string]>).map(([field, label]) => <label key={field} className={field === 'address_line_1' || field === 'address_line_2' ? 'sm:col-span-2 text-sm font-semibold' : 'text-sm font-semibold'}>{label}<input value={profile[field]} onChange={(event) => update(field, event.target.value)} className="tulda-field mt-2 w-full px-3" /></label>)}<button type="submit" disabled={saving} className="tulda-button mt-2 sm:col-span-2">{saving ? 'SAVING...' : 'SAVE DETAILS'}</button></form>{status && <p className="mt-4 text-sm" role="status" style={{ color: 'var(--color-brand-hover)' }}>{status}</p>}{error && <p className="mt-4 text-sm" role="alert" style={{ color: 'var(--color-danger)' }}>{error}</p>}</section><section className="mt-8 border p-6" style={{ borderColor: 'var(--color-danger)', backgroundColor: 'var(--color-danger-soft)' }}><h2 className="text-2xl font-black">DELETE ACCOUNT</h2><p className="mt-3 text-sm leading-relaxed">This permanently removes your account, saved address and favourites. Existing order records are retained for operational and legal purposes.</p><button type="button" onClick={deleteAccount} className="mt-5 border px-5 py-3 text-sm font-bold" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>DELETE MY ACCOUNT</button></section></div>
    </div>
  </main>
}
