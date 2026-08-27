import { FormEvent, ReactNode, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatMoney } from '../services/catalogue/money'

type Variant = { id: string; label: string; price_minor: number; currency: string }
type ProductImage = { storage_path: string; is_primary: boolean }
type Product = { id: string; name: string; slug: string; code: string | null; product_variants: Variant[]; product_images: ProductImage[] }
type Category = { id: string; name: string }
const adminDb = supabase as unknown as { from: (table: string) => any }

export default function AdminPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', slug: '', code: '', description: '', categoryId: '', variantLabel: 'Standard', price: '' })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [priceVariant, setPriceVariant] = useState<Variant | null>(null)
  const [priceInput, setPriceInput] = useState('')
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [modalBusy, setModalBusy] = useState(false)

  const load = async () => {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) { setAllowed(false); return }
    const { data: membership } = await adminDb.from('admin_users').select('user_id').eq('user_id', userData.user.id).maybeSingle()
    if (!membership) { setAllowed(false); return }
    const [productResult, categoryResult] = await Promise.all([
      adminDb.from('products').select('id, name, slug, code, product_variants(id, label, price_minor, currency), product_images(storage_path, is_primary)').order('name'),
      adminDb.from('categories').select('id, name').eq('is_active', true).order('name'),
    ])
    setProducts(productResult.data ?? []); setCategories(categoryResult.data ?? []); setAllowed(true)
  }
  useEffect(() => { void load() }, [])

  const setPhoto = (file: File | null) => { setImageFile(file); setImagePreview(file ? URL.createObjectURL(file) : '') }
  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setStatus('')
    const priceMinor = Math.round(Number(form.price) * 100)
    if (!form.categoryId || !form.name.trim() || !form.slug.trim() || !imageFile || !Number.isFinite(priceMinor) || priceMinor < 0) { setError('Complete the product name, URL slug, category, photo and a valid price.'); return }
    const result = await adminDb.from('products').insert({ name: form.name.trim(), slug: form.slug.trim(), code: form.code.trim() || null, short_description: form.description.trim() || null, description: form.description.trim() || null }).select('id').single()
    if (result.error || !result.data) { setError(result.error?.message ?? 'The product could not be created.'); return }
    const path = `${result.data.id}/${Date.now()}-${imageFile.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-')}`
    const upload = await supabase.storage.from('product-images').upload(path, imageFile, { contentType: imageFile.type, upsert: false })
    if (upload.error) { await adminDb.from('products').delete().eq('id', result.data.id); setError('The image could not be uploaded. The product was not created.'); return }
    const imageUrl = supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
    const [variantResult, categoryResult, imageResult] = await Promise.all([
      adminDb.from('product_variants').insert({ product_id: result.data.id, label: form.variantLabel.trim() || 'Standard', price_minor: priceMinor, currency: 'GBP', is_in_stock: true }),
      adminDb.from('product_categories').insert({ product_id: result.data.id, category_id: form.categoryId }),
      adminDb.from('product_images').insert({ product_id: result.data.id, storage_path: imageUrl, alt_text: form.name.trim(), is_primary: true }),
    ])
    if (variantResult.error || categoryResult.error || imageResult.error) { setError('Product was created but not all of its details could be saved.'); return }
    setForm({ name: '', slug: '', code: '', description: '', categoryId: '', variantLabel: 'Standard', price: '' }); setPhoto(null); setStatus('Product added successfully.'); void load()
  }
  const openPriceEditor = (variant: Variant) => { setError(''); setPriceVariant(variant); setPriceInput((variant.price_minor / 100).toFixed(2)) }
  const changePrice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!priceVariant) return
    const priceMinor = Math.round(Number(priceInput) * 100)
    if (!Number.isFinite(priceMinor) || priceMinor < 0) { setError('Enter a valid non-negative price.'); return }
    setModalBusy(true); const { error: updateError } = await adminDb.from('product_variants').update({ price_minor: priceMinor }).eq('id', priceVariant.id); setModalBusy(false)
    if (updateError) { setError(updateError.message); return }
    setPriceVariant(null); setStatus('Price updated.'); void load()
  }
  const removeProduct = async () => {
    if (!productToDelete) return
    setModalBusy(true); const { error: deletionError } = await adminDb.from('products').delete().eq('id', productToDelete.id); setModalBusy(false)
    if (deletionError) { setError(deletionError.message); return }
    setProductToDelete(null); setStatus('Product deleted.'); void load()
  }
  if (allowed === null) return <main className="mx-auto max-w-[1400px] px-6 py-20"><p>Checking administrator access...</p></main>
  if (!allowed) return <main className="mx-auto max-w-[1400px] px-6 py-20"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary)]">Restricted area</p><h1 className="mt-3 text-5xl font-black">ADMIN ACCESS REQUIRED.</h1><p className="mt-5 text-sm text-[var(--muted-foreground)]">Sign in with an administrator account to manage the catalogue.</p><Link to="/account" className="tulda-button mt-7">SIGN IN</Link></main>
  return <main className="mx-auto max-w-[1400px] px-6 py-14 md:py-20">
    <div className="flex flex-wrap items-end justify-between gap-5 border-b pb-8" style={{ borderColor: 'var(--border)' }}><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">Administrator panel</p><h1 className="mt-3 text-5xl font-black leading-[0.92] md:text-6xl">MANAGE PRODUCTS.</h1></div><div className="border-l-2 border-[var(--primary)] pl-4 text-sm text-[var(--muted-foreground)]"><strong className="block text-[var(--foreground)]">{products.length} products</strong>in the current catalogue</div></div>
    {status && <p className="mt-6 border border-[var(--primary)] bg-[var(--color-brand-soft)] p-4 text-sm" role="status">{status}</p>}{error && <p className="mt-6 border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-4 text-sm text-[var(--color-danger)]" role="alert">{error}</p>}
    <section className="mt-10 overflow-hidden border" style={{ borderColor: 'var(--border)' }}><div className="bg-[var(--surface-dark)] px-6 py-5 text-white md:px-8"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--primary)]">New catalogue item</p><h2 className="mt-2 text-3xl font-black">ADD A PRODUCT</h2></div><form className="grid gap-x-7 gap-y-5 bg-[var(--muted)] p-6 md:grid-cols-2 md:p-8" onSubmit={addProduct}><Field label="Product name" value={form.name} onChange={(name) => setForm({ ...form, name })} /><Field label="URL slug" value={form.slug} onChange={(slug) => setForm({ ...form, slug })} placeholder="e.g. tulda-new-product" /><Field label="Product code (optional)" value={form.code} onChange={(code) => setForm({ ...form, code })} /><Field label="Variant / size" value={form.variantLabel} onChange={(variantLabel) => setForm({ ...form, variantLabel })} /><Field label="Price (GBP)" value={form.price} onChange={(price) => setForm({ ...form, price })} type="number" step="0.01" min="0" /><label className="text-sm font-semibold">Category<select required value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} className="tulda-field mt-2 w-full px-3"><option value="">Choose a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="group relative flex min-h-52 cursor-pointer flex-col items-center justify-center border-2 border-dashed bg-white p-5 text-center transition-colors hover:border-[var(--primary)] md:col-span-2" style={{ borderColor: imagePreview ? 'var(--primary)' : 'var(--border)' }}><input required type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} />{imagePreview ? <><img src={imagePreview} alt="Selected product preview" className="h-36 max-w-full object-contain" /><span className="mt-3 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">Change image</span></> : <><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-2xl text-[var(--primary)]">+</span><strong className="mt-3 text-sm">DROP A PRODUCT PHOTO HERE</strong><span className="mt-1 text-xs text-[var(--muted-foreground)]">or click to browse · PNG, JPG or WebP</span></>}</label><label className="text-sm font-semibold md:col-span-2">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="A short, customer-facing product description..." className="tulda-field mt-2 min-h-28 w-full px-3 py-2" /></label><button className="tulda-button md:col-span-2" type="submit">ADD PRODUCT TO CATALOGUE</button></form></section>
    <section className="mt-14"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--primary)]">Catalogue</p><h2 className="mt-2 text-3xl font-black">CURRENT PRODUCTS</h2></div><span className="text-sm text-[var(--muted-foreground)]">Manage prices and availability</span></div><div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} onChangePrice={openPriceEditor} onDelete={setProductToDelete} />)}</div></section>
    {priceVariant && <AdminModal title="UPDATE PRICE" eyebrow="Product variant" onClose={() => !modalBusy && setPriceVariant(null)}><p className="text-sm text-[var(--muted-foreground)]">Set a new price for <strong className="text-[var(--foreground)]">{priceVariant.label}</strong>. The current price is {formatMoney(priceVariant.price_minor, priceVariant.currency)}.</p><form className="mt-6" onSubmit={changePrice}><label className="text-sm font-semibold">Price (GBP)<input autoFocus required type="number" min="0" step="0.01" value={priceInput} onChange={(event) => setPriceInput(event.target.value)} className="tulda-field mt-2 w-full px-3" /></label><div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" disabled={modalBusy} onClick={() => setPriceVariant(null)} className="tulda-button-secondary">CANCEL</button><button disabled={modalBusy} className="tulda-button" type="submit">{modalBusy ? 'SAVING...' : 'SAVE PRICE'}</button></div></form></AdminModal>}
    {productToDelete && <AdminModal title="DELETE PRODUCT?" eyebrow="This action is permanent" danger onClose={() => !modalBusy && setProductToDelete(null)}><p className="text-sm leading-relaxed text-[var(--muted-foreground)]">You are about to permanently delete <strong className="text-[var(--foreground)]">{productToDelete.name}</strong>, including every variant, image and category connection.</p><div className="mt-6 border-l-2 border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-4 text-sm text-[var(--color-danger)]">This cannot be undone.</div><div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" disabled={modalBusy} onClick={() => setProductToDelete(null)} className="tulda-button-secondary">KEEP PRODUCT</button><button type="button" disabled={modalBusy} onClick={() => void removeProduct()} className="border px-5 py-3 text-sm font-bold transition-colors" style={{ borderColor: 'var(--color-danger)', backgroundColor: 'var(--color-danger)', color: '#ffffff' }}>{modalBusy ? 'DELETING...' : 'DELETE PERMANENTLY'}</button></div></AdminModal>}
  </main>
}

function Field({ label, value, onChange, placeholder, type = 'text', step, min }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; step?: string; min?: string }) { return <label className="text-sm font-semibold">{label}<input required={label !== 'Product code (optional)'} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} step={step} min={min} className="tulda-field mt-2 w-full px-3" /></label> }
function ProductCard({ product, onChangePrice, onDelete }: { product: Product; onChangePrice: (variant: Variant) => void; onDelete: (product: Product) => void }) { const image = product.product_images?.find((item) => item.is_primary) ?? product.product_images?.[0]; return <article className="group overflow-hidden border bg-white transition-shadow hover:shadow-lg" style={{ borderColor: 'var(--border)' }}><div className="relative flex h-48 items-center justify-center bg-[var(--muted)] p-5">{image ? <img src={image.storage_path} alt="" className="h-full w-full object-contain" /> : <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">No product image</span>}<span className="absolute left-4 top-4 bg-[var(--surface-dark)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">{product.code || 'Tulda'}</span></div><div className="p-5"><p className="text-xs text-[var(--muted-foreground)]">/{product.slug}</p><h3 className="mt-2 min-h-12 text-lg font-black leading-tight">{product.name}</h3><div className="mt-5 space-y-2 border-t pt-4" style={{ borderColor: 'var(--border)' }}>{product.product_variants.map((variant) => <div key={variant.id} className="flex items-center justify-between gap-3"><span className="text-sm text-[var(--muted-foreground)]">{variant.label}</span><button type="button" onClick={() => onChangePrice(variant)} className="text-sm font-bold text-[var(--primary)] underline decoration-[var(--primary)] underline-offset-4">{formatMoney(variant.price_minor, variant.currency)}</button></div>)}</div><button type="button" onClick={() => onDelete(product)} className="mt-5 w-full border px-4 py-3 text-xs font-bold tracking-wide transition-colors hover:bg-[var(--color-danger-soft)]" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>DELETE PRODUCT</button></div></article> }
function AdminModal({ title, eyebrow, danger = false, onClose, children }: { title: string; eyebrow: string; danger?: boolean; onClose: () => void; children: ReactNode }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061117]/80 p-5" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" onMouseDown={onClose}><section className="w-full max-w-lg border bg-white p-6 shadow-2xl md:p-8" style={{ borderColor: danger ? 'var(--color-danger)' : 'var(--primary)' }} onMouseDown={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-5"><div><p className={'text-xs font-bold uppercase tracking-[0.14em] ' + (danger ? 'text-[var(--color-danger)]' : 'text-[var(--primary)]')}>{eyebrow}</p><h2 id="admin-modal-title" className="mt-3 text-4xl font-black leading-none">{title}</h2></div><button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center border text-xl" style={{ borderColor: 'var(--border)' }} aria-label="Close dialog">×</button></div><div className="mt-6">{children}</div></section></div> }
