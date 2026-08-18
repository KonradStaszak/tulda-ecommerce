import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../features/cart/CartContext'
import type { Address, CheckoutErrors, CheckoutField, CheckoutFormData } from '../features/checkout/types'
import { validateCheckoutForm } from '../features/checkout/validation'
import { createOrderDraft, type DraftOrderResult } from '../services/orders/createOrder'
import { formatMoney } from '../services/catalogue/money'

const emptyAddress = (): Address => ({
  country: 'United Kingdom',
  addressLine1: '',
  addressLine2: '',
  city: '',
  region: '',
  postcode: '',
})

const initialForm = (): CheckoutFormData => ({
  customer: { email: '', phone: '', firstName: '', lastName: '', company: '' },
  deliveryAddress: emptyAddress(),
  billingSameAsDelivery: true,
  billingAddress: emptyAddress(),
  orderNotes: '',
})

interface TextFieldProps {
  id: string
  label: string
  value: string
  error?: string
  required?: boolean
  type?: 'email' | 'tel' | 'text'
  autoComplete?: string
  onChange: (value: string) => void
}

function TextField({ id, label, value, error, required = false, type = 'text', autoComplete, onChange }: TextFieldProps) {
  const errorId = `${id}-error`
  return <div>
    <label htmlFor={id} className="block text-sm font-medium">{label}{required && <span aria-hidden="true"> *</span>}</label>
    <input id={id} type={type} value={value} autoComplete={autoComplete} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full border px-3 py-3 text-sm bg-white" style={{ borderColor: error ? 'var(--primary)' : 'var(--border)' }} />
    {error && <p id={errorId} className="mt-1 text-xs" role="alert" style={{ color: 'var(--primary)' }}>{error}</p>}
  </div>
}

interface AddressFieldsProps {
  idPrefix: 'delivery' | 'billing'
  address: Address
  errors: CheckoutErrors
  onChange: (field: keyof Address, value: string) => void
}

function AddressFields({ idPrefix, address, errors, onChange }: AddressFieldsProps) {
  const title = idPrefix === 'delivery' ? 'Delivery address' : 'Billing address'
  const error = (field: 'Country' | 'AddressLine1' | 'City' | 'Postcode') => errors[`${idPrefix}${field}` as CheckoutField]
  return <fieldset className="mt-8">
    <legend className="text-2xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{title.toUpperCase()}</legend>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2"><TextField id={`${idPrefix}-country`} label="Country" value={address.country} error={error('Country')} required autoComplete={idPrefix === 'delivery' ? 'country-name' : 'billing country-name'} onChange={(value) => onChange('country', value)} /></div>
      <div className="md:col-span-2"><TextField id={`${idPrefix}-address-line-1`} label="Address line 1" value={address.addressLine1} error={error('AddressLine1')} required autoComplete={idPrefix === 'delivery' ? 'address-line1' : 'billing address-line1'} onChange={(value) => onChange('addressLine1', value)} /></div>
      <div className="md:col-span-2"><TextField id={`${idPrefix}-address-line-2`} label="Address line 2" value={address.addressLine2} autoComplete={idPrefix === 'delivery' ? 'address-line2' : 'billing address-line2'} onChange={(value) => onChange('addressLine2', value)} /></div>
      <TextField id={`${idPrefix}-city`} label="City" value={address.city} error={error('City')} required autoComplete={idPrefix === 'delivery' ? 'address-level2' : 'billing address-level2'} onChange={(value) => onChange('city', value)} />
      <TextField id={`${idPrefix}-region`} label="County / Region" value={address.region} autoComplete={idPrefix === 'delivery' ? 'address-level1' : 'billing address-level1'} onChange={(value) => onChange('region', value)} />
      <TextField id={`${idPrefix}-postcode`} label="Postcode" value={address.postcode} error={error('Postcode')} required autoComplete={idPrefix === 'delivery' ? 'postal-code' : 'billing postal-code'} onChange={(value) => onChange('postcode', value)} />
    </div>
  </fieldset>
}

export default function CheckoutPage() {
  const { lines, itemCount, subtotalMinor, hasUnavailableItems } = useCart()
  const [form, setForm] = useState<CheckoutFormData>(initialForm)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID())
  const [draftOrder, setDraftOrder] = useState<DraftOrderResult | null>(null)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cartSignature = lines.map((line) => `${line.variantId}:${line.quantity}`).sort().join('|')
  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID())
    setDraftOrder(null)
    setSubmissionError(null)
  }, [cartSignature])

  const resetDraftAttempt = () => {
    setIdempotencyKey(crypto.randomUUID())
    setDraftOrder(null)
    setSubmissionError(null)
  }

  const updateCustomer = (field: keyof CheckoutFormData['customer'], value: string) => {
    setForm((current) => ({ ...current, customer: { ...current.customer, [field]: value } }))
    resetDraftAttempt()
  }
  const updateAddress = (key: 'deliveryAddress' | 'billingAddress', field: keyof Address, value: string) => {
    setForm((current) => ({ ...current, [key]: { ...current[key], [field]: value } }))
    resetDraftAttempt()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateCheckoutForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    setSubmissionError(null)
    try {
      const result = await createOrderDraft({ idempotencyKey, checkout: form, lines })
      setDraftOrder(result)
    } catch {
      setSubmissionError('Unable to create a draft order. Please review your cart and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (lines.length === 0) return <main className="max-w-[1100px] mx-auto px-6 py-10"><nav className="text-xs" style={{ color: 'var(--muted-foreground)' }}><Link to="/">Home</Link> / Checkout</nav><section className="mt-8 py-20 text-center border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}><h1 className="text-3xl font-black" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>YOUR CHECKOUT IS EMPTY</h1><p className="mt-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>Add products to your cart before continuing to checkout.</p><Link to="/products" className="inline-block mt-6 px-5 py-3 text-sm font-semibold rounded-sm" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>SHOP PRODUCTS</Link></section></main>

  if (hasUnavailableItems) return <main className="max-w-[1100px] mx-auto px-6 py-10"><nav className="text-xs" style={{ color: 'var(--muted-foreground)' }}><Link to="/">Home</Link> / <Link to="/cart">Cart</Link> / Checkout</nav><section className="mt-8 p-8 border" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--muted)' }}><h1 className="text-3xl font-black" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>CHECKOUT IS PAUSED</h1><p className="mt-3 text-sm">One or more cart items are unavailable. Update your cart before continuing to checkout.</p><Link to="/cart" className="inline-block mt-6 px-5 py-3 text-sm font-semibold rounded-sm" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>REVIEW CART</Link></section></main>

  return <main className="max-w-[1400px] mx-auto px-6 py-10">
    <nav className="text-xs" style={{ color: 'var(--muted-foreground)' }}><Link to="/">Home</Link> / <Link to="/cart">Cart</Link> / Checkout</nav>
    <div className="mt-6"><h1 className="text-4xl font-black" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>CHECKOUT</h1><p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>Review your details before continuing to payment.</p></div>
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-10 items-start">
      <form noValidate onSubmit={handleSubmit} className="border p-5 sm:p-7" style={{ borderColor: 'var(--border)' }}>
        {Object.keys(errors).length > 0 && <div className="mb-6 border p-4 text-sm" role="alert" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--muted)' }}>Please correct the highlighted fields before continuing.</div>}
        <fieldset><legend className="text-2xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>CONTACT INFORMATION</legend><div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"><TextField id="email" label="Email address" value={form.customer.email} error={errors.email} required type="email" autoComplete="email" onChange={(value) => updateCustomer('email', value)} /><TextField id="phone" label="Phone number" value={form.customer.phone} error={errors.phone} required type="tel" autoComplete="tel" onChange={(value) => updateCustomer('phone', value)} /></div></fieldset>
        <fieldset className="mt-8"><legend className="text-2xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>CUSTOMER DETAILS</legend><div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"><TextField id="first-name" label="First name" value={form.customer.firstName} error={errors.firstName} required autoComplete="given-name" onChange={(value) => updateCustomer('firstName', value)} /><TextField id="last-name" label="Last name" value={form.customer.lastName} error={errors.lastName} required autoComplete="family-name" onChange={(value) => updateCustomer('lastName', value)} /><div className="md:col-span-2"><TextField id="company" label="Company name (optional)" value={form.customer.company} autoComplete="organization" onChange={(value) => updateCustomer('company', value)} /></div></div></fieldset>
        <AddressFields idPrefix="delivery" address={form.deliveryAddress} errors={errors} onChange={(field, value) => updateAddress('deliveryAddress', field, value)} />
        <div className="mt-8 border-t pt-7" style={{ borderColor: 'var(--border)' }}><label className="flex items-start gap-3 text-sm cursor-pointer"><input type="checkbox" checked={form.billingSameAsDelivery} onChange={(event) => { setForm((current) => ({ ...current, billingSameAsDelivery: event.target.checked })); resetDraftAttempt() }} className="mt-0.5 h-4 w-4 accent-[var(--primary)]" /><span>Billing address is the same as delivery address</span></label>{!form.billingSameAsDelivery && <AddressFields idPrefix="billing" address={form.billingAddress} errors={errors} onChange={(field, value) => updateAddress('billingAddress', field, value)} />}</div>
        <div className="mt-8"><label htmlFor="order-notes" className="block text-2xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>ORDER NOTES <span className="text-sm font-normal" style={{ fontFamily: 'Inter, sans-serif' }}>(optional)</span></label><textarea id="order-notes" value={form.orderNotes} onChange={(event) => { setForm((current) => ({ ...current, orderNotes: event.target.value })); resetDraftAttempt() }} rows={4} className="mt-3 w-full border p-3 text-sm bg-white" style={{ borderColor: 'var(--border)' }} /></div>
        <button type="submit" disabled={isSubmitting} className="mt-8 w-full py-3 text-sm font-semibold rounded-sm disabled:opacity-60" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>{isSubmitting ? 'CREATING DRAFT ORDER...' : 'CONTINUE TO PAYMENT'}</button>
        {submissionError && <section className="mt-5 border p-4 text-sm" role="alert" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--muted)' }}>{submissionError}</section>}
        {draftOrder && <section className="mt-5 border p-4 text-sm" role="status" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}><strong>Draft order #{draftOrder.order_number} is ready for payment.</strong><p className="mt-1">Payment integration is the next step. This order is not paid or confirmed, and your cart has not changed.</p></section>}
      </form>
      <aside className="lg:sticky lg:top-6 border p-5 sm:p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }} aria-label="Order summary"><h2 className="text-2xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>ORDER SUMMARY</h2><p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>{itemCount} items in your cart</p><div className="mt-5 space-y-4">{lines.map((line) => <article key={line.variantId} className="flex gap-3"><div className="h-16 w-16 shrink-0 border bg-white" style={{ borderColor: 'var(--border)' }}>{line.imagePath && <img src={line.imagePath} alt="" className="h-full w-full object-contain" />}</div><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold leading-tight">{line.productName}</h3><p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>{line.variantLabel} · Qty {line.quantity}</p><p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>{formatMoney(line.priceMinor)} each</p></div><strong className="text-sm whitespace-nowrap">{formatMoney(line.priceMinor * line.quantity)}</strong></article>)}</div><div className="mt-6 border-t pt-5 space-y-3 text-sm" style={{ borderColor: 'var(--border)' }}><div className="flex justify-between gap-4"><span>Products subtotal</span><strong>{formatMoney(subtotalMinor)}</strong></div><div className="flex justify-between gap-4"><span>Delivery</span><span className="text-right" style={{ color: 'var(--muted-foreground)' }}>Calculated at next step</span></div><div className="flex justify-between gap-4"><span>Tax / VAT</span><span className="text-right" style={{ color: 'var(--muted-foreground)' }}>Calculated at next step</span></div><div className="flex justify-between gap-4 border-t pt-4 font-semibold" style={{ borderColor: 'var(--border)' }}><span>Total</span><span>Calculated at next step</span></div></div><Link to="/cart" className="mt-6 inline-block text-sm underline">Edit cart</Link></aside>
    </div>
  </main>
}
