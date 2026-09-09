import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatMoney } from '../services/catalogue/money'

type Section = 'requests' | 'products' | 'users'
type Variant = { id: string; label: string; price_minor: number; currency: string }
type Product = { id: string; name: string; slug: string; code: string | null; product_variants: Variant[] }
type Category = { id: string; name: string }
type QuoteRequest = { id: string; request_number: number; first_name: string; last_name: string; company: string | null; email: string; phone: string; notes: string | null; status: 'new' | 'contacted' | 'quoted' | 'closed' | 'cancelled'; admin_notes: string | null; created_at: string; quote_request_items: Array<{ id: string; product_name: string; product_code: string | null; variant_label: string; quantity: number }> }
type AdminUser = { id: string; email: string | null; created_at: string; last_sign_in_at: string | null; full_name: string | null; is_admin: boolean }
const adminDb = supabase as unknown as { from: (table: string) => any }

export default function AdminPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [section, setSection] = useState<Section>('requests')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [requests, setRequests] = useState<QuoteRequest[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', code: '', variantLabel: 'Standard', price: '', categoryId: '' })
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) { setAllowed(false); return }
    const { data: membership } = await adminDb.from('admin_users').select('user_id').eq('user_id', auth.user.id).maybeSingle()
    if (!membership) { setAllowed(false); return }
    const { data: sessionData } = await supabase.auth.getSession()
    const [productsResult, categoriesResult, requestsResult, usersResult] = await Promise.all([
      adminDb.from('products').select('id,name,slug,code,product_variants(id,label,price_minor,currency)').order('name'),
      adminDb.from('categories').select('id,name').eq('is_active', true).order('name'),
      adminDb.from('quote_requests').select('id,request_number,first_name,last_name,company,email,phone,notes,status,admin_notes,created_at,quote_request_items(id,product_name,product_code,variant_label,quantity)').order('created_at', { ascending: false }),
      supabase.functions.invoke<AdminUser[]>('admin-list-users', { headers: sessionData.session ? { Authorization: 'Bearer ' + sessionData.session.access_token } : undefined }),
    ])
    setProducts(productsResult.data ?? [])
    setCategories(categoriesResult.data ?? [])
    setRequests(requestsResult.data ?? [])
    if (usersResult.error) setError(`User list could not be loaded: ${usersResult.error.message}`)
    setUsers(usersResult.data ?? [])
    setAllowed(true)
  }

  useEffect(() => { void load() }, [])

  const updateRequest = async (request: QuoteRequest, changes: Partial<Pick<QuoteRequest, 'status' | 'admin_notes'>>) => {
    const { error: updateError } = await adminDb.from('quote_requests').update(changes).eq('id', request.id)
    if (updateError) { setError('The enquiry could not be updated.'); return }
    setRequests((current) => current.map((item) => item.id === request.id ? { ...item, ...changes } : item))
  }

  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(''); setStatus('')
    const priceMinor = Math.round(Number(form.price) * 100)
    if (!form.name.trim() || !form.slug.trim() || !form.categoryId || !Number.isFinite(priceMinor) || priceMinor < 0) {
      setError('Complete the product name, URL slug, category and a valid price.')
      return
    }
    const { data: product, error: productError } = await adminDb.from('products').insert({
      name: form.name.trim(), slug: form.slug.trim(), code: form.code.trim() || null,
    }).select('id').single()
    if (productError || !product) { setError(productError?.message ?? 'The product could not be created.'); return }
    const [variant, category] = await Promise.all([
      adminDb.from('product_variants').insert({ product_id: product.id, label: form.variantLabel.trim() || 'Standard', price_minor: priceMinor, currency: 'GBP', is_in_stock: true }),
      adminDb.from('product_categories').insert({ product_id: product.id, category_id: form.categoryId }),
    ])
    if (variant.error || category.error) { setError('Product created, but its variant or category could not be saved.'); return }
    setForm({ name: '', slug: '', code: '', variantLabel: 'Standard', price: '', categoryId: '' })
    setStatus('Product added to the catalogue.')
    void load()
  }

  if (allowed === null) return <main className="mx-auto max-w-[1400px] px-6 py-20"><p>Checking administrator access...</p></main>
  if (!allowed) return <main className="mx-auto max-w-[1400px] px-6 py-20"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary)]">Restricted area</p><h1 className="mt-3 text-5xl font-black">ADMIN ACCESS REQUIRED.</h1><Link to="/account" className="tulda-button mt-7">SIGN IN</Link></main>

  return <div className="mx-auto max-w-[1400px] px-6 py-10 md:py-14">
    <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,_1fr)]">
      <AdminSidebar active={section} onChange={setSection} newRequests={requests.filter((item) => item.status === 'new').length} />
      <main>
        <header className="flex flex-wrap items-end justify-between gap-5 border-b pb-7" style={{ borderColor: 'var(--border)' }}>
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">Administrator panel</p><h1 className="mt-3 text-5xl font-black leading-[0.92]">{section === 'requests' ? 'CUSTOMER ENQUIRIES.' : section === 'products' ? 'MANAGE PRODUCTS.' : 'USER ACCOUNTS.'}</h1></div>
          <span className="text-sm text-[var(--muted-foreground)]">{products.length} products · {users.length} users</span>
        </header>
        {status && <p className="mt-6 border border-[var(--primary)] bg-[var(--color-brand-soft)] p-4 text-sm" role="status">{status}</p>}
        {error && <p className="mt-6 border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-4 text-sm text-[var(--color-danger)]" role="alert">{error}</p>}
        {section === 'requests' && <RequestsTable requests={requests} expanded={expandedRequest} onToggle={setExpandedRequest} onSave={updateRequest} />}
        {section === 'products' && <ProductsSection products={products} categories={categories} form={form} setForm={setForm} onSubmit={addProduct} onRefresh={load} />}
        {section === 'users' && <UsersTable users={users} />}
      </main>
    </div>
  </div>
}

function AdminSidebar({ active, onChange, newRequests }: { active: Section; onChange: (section: Section) => void; newRequests: number }) {
  const item = (id: Section, label: string, badge?: number) => <button type="button" onClick={() => onChange(id)} className={'flex w-full items-center justify-between border-l-2 px-4 py-3 text-left text-sm font-bold transition-colors ' + (active === id ? 'border-[var(--primary)] bg-[var(--color-brand-soft)] text-[var(--primary)]' : 'border-transparent hover:bg-[var(--muted)]')}><span>{label}</span>{badge ? <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-xs text-white">{badge}</span> : null}</button>
  return <aside className="h-fit border bg-white p-3 lg:sticky lg:top-28" style={{ borderColor: 'var(--border)' }}><p className="px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Management</p>{item('requests', 'Enquiries', newRequests)}{item('products', 'Products')}{item('users', 'Users')}</aside>
}

function RequestsTable({ requests, expanded, onToggle, onSave }: { requests: QuoteRequest[]; expanded: string | null; onToggle: (id: string | null) => void; onSave: (request: QuoteRequest, changes: Partial<Pick<QuoteRequest, 'status' | 'admin_notes'>>) => void }) {
  if (!requests.length) return <p className="mt-8 border p-6 text-sm text-[var(--muted-foreground)]">No customer enquiries yet.</p>
  return <section className="mt-8 overflow-x-auto border"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-[var(--muted)] text-xs uppercase tracking-wider text-[var(--muted-foreground)]"><tr><th className="p-4">No.</th><th className="p-4">Customer</th><th className="p-4">Received</th><th className="p-4">Status</th><th className="p-4 text-right">Action</th></tr></thead><tbody>{requests.map((request) => <RequestRow key={request.id} request={request} expanded={expanded === request.id} onToggle={() => onToggle(expanded === request.id ? null : request.id)} onSave={onSave} />)}</tbody></table></section>
}

function RequestRow({ request, expanded, onToggle, onSave }: { request: QuoteRequest; expanded: boolean; onToggle: () => void; onSave: (request: QuoteRequest, changes: Partial<Pick<QuoteRequest, 'status' | 'admin_notes'>>) => void }) {
  const [notes, setNotes] = useState(request.admin_notes ?? '')
  return <><tr className="border-t"><td className="p-4 font-bold">#{request.request_number}</td><td className="p-4"><strong>{request.first_name} {request.last_name}</strong><span className="mt-1 block text-xs text-[var(--muted-foreground)]">{request.email}</span></td><td className="p-4">{new Date(request.created_at).toLocaleDateString('en-GB')}</td><td className="p-4"><select value={request.status} onChange={(event) => onSave(request, { status: event.target.value as QuoteRequest['status'] })} className="border bg-white px-2 py-1"><option value="new">New</option><option value="contacted">Contacted</option><option value="quoted">Quoted</option><option value="closed">Closed</option><option value="cancelled">Cancelled</option></select></td><td className="p-4 text-right"><button type="button" onClick={onToggle} className="font-bold text-[var(--primary)] underline">{expanded ? 'Hide details' : 'View details'}</button></td></tr>{expanded && <tr className="border-t bg-[var(--muted)]"><td colSpan={5} className="p-5"><div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"><div><div className="flex items-center justify-between"><p className="font-bold">Requested products</p><span className="text-xs text-[var(--muted-foreground)]">{request.quote_request_items.length} items</span></div><div className="mt-3 overflow-hidden border bg-white">{request.quote_request_items.map((item) => <article key={item.id} className="flex items-start gap-4 border-b p-4 last:border-b-0"><span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-sm font-black text-[var(--primary)]">{item.quantity}×</span><div className="min-w-0"><h3 className="font-bold leading-snug">{decodeText(item.product_name)}</h3><p className="mt-1 text-xs text-[var(--muted-foreground)]">{item.product_code ? decodeText(item.product_code) + ' · ' : ''}{decodeText(item.variant_label)}</p></div></article>)}</div>{request.notes && <div className="mt-5 border-l-2 border-[var(--primary)] bg-white p-4 text-sm"><strong>Customer note</strong><p className="mt-1">{request.notes}</p></div>}<p className="mt-4 text-sm"><a className="font-bold underline" href={'tel:' + request.phone}>{request.phone}</a>{request.company ? ' · ' + request.company : ''}</p></div><div><label className="block text-sm font-bold">Internal notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={6} className="tulda-field mt-2 w-full p-3" /></label><button type="button" onClick={() => onSave(request, { admin_notes: notes })} className="tulda-button mt-3">SAVE NOTES</button></div></div></td></tr>}</>
}

function decodeText(value: string) {
  const element = document.createElement('textarea')
  element.innerHTML = value
  element.innerHTML = element.value
  return element.value
}

function ProductsSection({ products, categories, form, setForm, onSubmit, onRefresh }: { products: Product[]; categories: Category[]; form: { name: string; slug: string; code: string; variantLabel: string; price: string; categoryId: string }; setForm: (value: { name: string; slug: string; code: string; variantLabel: string; price: string; categoryId: string }) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onRefresh: () => Promise<void> }) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const change = (key: keyof typeof form, value: string) => setForm({ ...form, [key]: value })
  return <><section className="mt-8 overflow-hidden border"><div className="bg-[var(--surface-dark)] px-6 py-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--primary)]">New catalogue item</p><h2 className="mt-2 text-3xl font-black">ADD A PRODUCT</h2></div><form onSubmit={onSubmit} className="grid gap-5 bg-[var(--muted)] p-6 md:grid-cols-2"><Field label="Product name" value={form.name} onChange={(value) => change('name', value)} /><Field label="URL slug" value={form.slug} onChange={(value) => change('slug', value)} /><Field label="Product code (optional)" value={form.code} onChange={(value) => change('code', value)} optional /><Field label="Variant / size" value={form.variantLabel} onChange={(value) => change('variantLabel', value)} /><Field label="Price (GBP)" value={form.price} onChange={(value) => change('price', value)} type="number" /><label className="text-sm font-bold">Category<select required value={form.categoryId} onChange={(event) => change('categoryId', event.target.value)} className="tulda-field mt-2 w-full px-3"><option value="">Choose a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><button className="tulda-button md:col-span-2">ADD PRODUCT TO CATALOGUE</button></form></section><section className="mt-12"><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--primary)]">Catalogue</p><h2 className="mt-2 text-3xl font-black">CURRENT PRODUCTS</h2></div><span className="text-sm text-[var(--muted-foreground)]">{products.length} products</span></div><div className="mt-6 grid gap-4 md:grid-cols-2">{products.map((product) => <article key={product.id} className="border bg-white p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">{product.code || 'Product'}</p><h3 className="mt-2 text-lg font-black leading-tight">{decodeText(product.name)}</h3><p className="mt-1 text-xs text-[var(--muted-foreground)]">/{product.slug}</p></div><button type="button" onClick={() => setEditingProduct(product)} className="border px-3 py-2 text-xs font-bold hover:bg-[var(--muted)]">EDIT PRICES</button></div><div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--border)' }}>{product.product_variants.map((variant) => <div key={variant.id} className="flex items-center justify-between gap-3 py-1.5 text-sm"><span className="text-[var(--muted-foreground)]">{decodeText(variant.label)}</span><strong>{formatMoney(variant.price_minor, variant.currency)}</strong></div>)}</div></article>)}</div></section>{editingProduct && <PriceModal product={editingProduct} onClose={() => setEditingProduct(null)} onSaved={() => { setEditingProduct(null); void onRefresh() }} />}</>
  return <><section className="mt-8 overflow-hidden border"><div className="bg-[var(--surface-dark)] px-6 py-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--primary)]">New catalogue item</p><h2 className="mt-2 text-3xl font-black">ADD A PRODUCT</h2></div><form onSubmit={onSubmit} className="grid gap-5 bg-[var(--muted)] p-6 md:grid-cols-2"><Field label="Product name" value={form.name} onChange={(value) => change('name', value)} /><Field label="URL slug" value={form.slug} onChange={(value) => change('slug', value)} /><Field label="Product code (optional)" value={form.code} onChange={(value) => change('code', value)} optional /><Field label="Variant / size" value={form.variantLabel} onChange={(value) => change('variantLabel', value)} /><Field label="Price (GBP)" value={form.price} onChange={(value) => change('price', value)} type="number" /><label className="text-sm font-bold">Category<select required value={form.categoryId} onChange={(event) => change('categoryId', event.target.value)} className="tulda-field mt-2 w-full px-3"><option value="">Choose a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><button className="tulda-button md:col-span-2">ADD PRODUCT TO CATALOGUE</button></form></section><section className="mt-12"><h2 className="text-3xl font-black">CURRENT PRODUCTS</h2><div className="mt-6 overflow-x-auto border"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-[var(--muted)] text-xs uppercase tracking-wider text-[var(--muted-foreground)]"><tr><th className="p-4">Product</th><th className="p-4">Code</th><th className="p-4">Variants</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-t"><td className="p-4"><strong>{product.name}</strong><span className="mt-1 block text-xs text-[var(--muted-foreground)]">/{product.slug}</span></td><td className="p-4">{product.code || '—'}</td><td className="p-4">{product.product_variants.map((variant) => <div key={variant.id}>{variant.label} · {formatMoney(variant.price_minor, variant.currency)}</div>)}</td><td className="p-4 text-right"><ProductActions product={product} onRefresh={onRefresh} /></td></tr>)}</tbody></table></div></section></>
}

function ProductActions({ product, onRefresh }: { product: Product; onRefresh: () => Promise<void> }) {
  const updatePrice = async () => {
    const variant = product.product_variants[0]
    if (!variant) return
    const value = window.prompt('New price in GBP', (variant.price_minor / 100).toFixed(2))
    if (value === null) return
    const priceMinor = Math.round(Number(value) * 100)
    if (!Number.isFinite(priceMinor) || priceMinor < 0) { window.alert('Enter a valid non-negative price.'); return }
    const { error } = await adminDb.from('product_variants').update({ price_minor: priceMinor }).eq('id', variant.id)
    if (error) { window.alert('The price could not be updated.'); return }
    void onRefresh()
  }
  const remove = async () => {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return
    const { error } = await adminDb.from('products').delete().eq('id', product.id)
    if (error) { window.alert('The product could not be deleted.'); return }
    void onRefresh()
  }
  return <div className="flex justify-end gap-2"><button type="button" onClick={updatePrice} className="border px-3 py-2 text-xs font-bold hover:bg-[var(--muted)]">EDIT PRICE</button><button type="button" onClick={remove} className="border border-[var(--color-danger)] px-3 py-2 text-xs font-bold text-[var(--color-danger)]">DELETE</button></div>
}

function PriceModal({ product, onClose, onSaved }: { product: Product; onClose: () => void; onSaved: () => void }) {
  const [prices, setPrices] = useState(() => Object.fromEntries(product.product_variants.map((variant) => [variant.id, (variant.price_minor / 100).toFixed(2)])))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const updates = product.product_variants.map((variant) => ({ id: variant.id, price: Math.round(Number(prices[variant.id]) * 100) }))
    if (updates.some((item) => !Number.isFinite(item.price) || item.price < 0)) { setError('Enter a valid non-negative price for every variant.'); return }
    setBusy(true)
    const results = await Promise.all(updates.map((item) => adminDb.from('product_variants').update({ price_minor: item.price }).eq('id', item.id)))
    setBusy(false)
    if (results.some((result) => result.error)) { setError('Prices could not be saved. Please try again.'); return }
    onSaved()
  }
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#061117]/75 p-5" role="dialog" aria-modal="true" aria-labelledby="price-modal-title" onMouseDown={onClose}><section className="w-full max-w-xl border bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><header className="flex items-start justify-between bg-[var(--surface-dark)] p-6 text-white"><div><p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">Catalogue pricing</p><h2 id="price-modal-title" className="mt-2 text-3xl font-black">{decodeText(product.name)}</h2></div><button type="button" onClick={onClose} className="text-2xl leading-none" aria-label="Close">×</button></header><form onSubmit={save} className="p-6"><p className="text-sm text-[var(--muted-foreground)]">Update one or more variant prices in GBP.</p><div className="mt-6 space-y-4">{product.product_variants.map((variant) => <label key={variant.id} className="grid gap-2 text-sm font-bold sm:grid-cols-[1fr_150px] sm:items-center"><span>{decodeText(variant.label)}</span><span className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">£</span><input required type="number" min="0" step="0.01" value={prices[variant.id]} onChange={(event) => setPrices({ ...prices, [variant.id]: event.target.value })} className="tulda-field w-full pl-7 pr-3" /></span></label>)}</div>{error && <p className="mt-5 text-sm text-[var(--color-danger)]">{error}</p>}<div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} className="tulda-button-secondary">CANCEL</button><button disabled={busy} className="tulda-button">{busy ? 'SAVING...' : 'SAVE PRICES'}</button></div></form></section></div>
}

function UsersTable({ users }: { users: AdminUser[] }) {
  return <section className="mt-8 overflow-x-auto border"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[var(--muted)] text-xs uppercase tracking-wider text-[var(--muted-foreground)]"><tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Created</th><th className="p-4">Last sign-in</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t"><td className="p-4"><strong>{user.full_name || 'Unnamed user'}</strong><span className="mt-1 block text-xs text-[var(--muted-foreground)]">{user.email || user.id}</span></td><td className="p-4"><span className={user.is_admin ? 'bg-[var(--color-brand-soft)] px-2 py-1 text-xs font-bold text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}>{user.is_admin ? 'Administrator' : 'Customer'}</span></td><td className="p-4">{new Date(user.created_at).toLocaleDateString('en-GB')}</td><td className="p-4">{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-GB') : 'Never'}</td><td className="p-4 text-right"><UserActions user={user} /></td></tr>)}</tbody></table></section>
}

function UserActions({ user }: { user: AdminUser }) {
  const copy = (value: string) => void navigator.clipboard?.writeText(value)
  return <div className="flex justify-end gap-2"><button type="button" onClick={() => copy(user.email || user.id)} className="border px-3 py-2 text-xs font-bold hover:bg-[var(--muted)]">COPY EMAIL</button><button type="button" onClick={() => copy(user.id)} className="border px-3 py-2 text-xs font-bold hover:bg-[var(--muted)]">COPY ID</button></div>
}

function Field({ label, value, onChange, type = 'text', optional = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; optional?: boolean }) {
  return <label className="text-sm font-bold">{label}<input required={!optional} value={value} onChange={(event) => onChange(event.target.value)} type={type} min={type === 'number' ? '0' : undefined} step={type === 'number' ? '0.01' : undefined} className="tulda-field mt-2 w-full px-3" /></label>
}
