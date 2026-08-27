import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { CatalogueCartLine, CatalogueProduct, CatalogueVariant } from '../types/catalog'
import { formatMoney } from '../services/catalogue/money'
import { getProductCardImage, getProductImageFitScale } from '../lib/productImages'

interface ProductCardProps {
  product: CatalogueProduct
  onAddToCart: (item: CatalogueCartLine) => void
  isWishlisted: boolean
  onToggleWishlist: () => void
}

function cardVariantLabel(label: string) {
  return label
    .replace(/^Size:\s*/i, '')
    .replace(/Litres?/gi, 'L')
    .replace(/,\s*(?:Speed|Colour|Color|Grit):\s*/gi, ' / ')
    .replace(/^(?:Speed|Colour|Color|Grit):\s*/i, '')
    .replace(/,\s*/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim()
}

function VariantControl({ product, selectedVariant, onChange }: { product: CatalogueProduct; selectedVariant: CatalogueVariant; onChange: (variant: CatalogueVariant) => void }) {
  if (product.variants.length === 1) {
    return <div className="min-h-10 flex items-center border px-3 text-xs" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{cardVariantLabel(selectedVariant.label)}</div>
  }

  return <label className="block">
    <span className="sr-only">Choose option for {product.name}</span>
    <div className="relative">
      <select value={selectedVariant.id} onChange={(event) => {
        const variant = product.variants.find((candidate) => candidate.id === event.target.value)
        if (variant) onChange(variant)
      }} className="tulda-field h-10 w-full appearance-none px-3 pr-10 text-xs font-medium" title={selectedVariant.label}>
        {product.variants.map((variant) => <option key={variant.id} value={variant.id}>{cardVariantLabel(variant.label)}{variant.isInStock ? '' : ' — Out of stock'}</option>)}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" /></svg>
    </div>
  </label>
}

export default function ProductCard({ product, onAddToCart, isWishlisted, onToggleWishlist }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [adding, setAdding] = useState(false)
  const productImage = getProductCardImage(product)
  const productImageFitScale = getProductImageFitScale(productImage)

  const handleAddToCart = () => {
    if (!selectedVariant.isInStock) return
    setAdding(true)
    onAddToCart({ product, variant: selectedVariant, size: selectedVariant.label, quantity: 1 })
    window.setTimeout(() => setAdding(false), 1200)
  }

  return (
    <article className="group flex flex-col border rounded-sm overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#cfcfcf] transition-[box-shadow,border-color] duration-[180ms]" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
      <div className="relative flex h-[224px] items-center justify-center overflow-hidden bg-[#f6f7f8] sm:h-[236px]">
        <Link to={`/product/${product.slug}`} className="absolute inset-0 z-0" aria-label={`View ${product.name}`} />
        {productImage ? <img src={productImage.path} alt={productImage.altText ?? product.name} loading="lazy" className="pointer-events-none relative z-10 h-full max-h-full w-full max-w-full object-contain p-6 sm:p-7" style={productImageFitScale === 1 ? undefined : { transform: `scale(${productImageFitScale})` }} /> : <div className="relative z-10 flex h-full items-center justify-center text-xs pointer-events-none" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>Product image unavailable</div>}
        {!product.isInStock && <span className="absolute z-10 top-3 left-3 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm" style={{ backgroundColor: '#e5e5e5', color: '#666', fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em' }}>Out of stock</span>}
        <button onClick={onToggleWishlist} className={`product-card-wishlist absolute z-10 top-3 right-3 w-10 h-10 flex items-center justify-center rounded-sm transition-opacity ${isWishlisted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ backgroundColor: 'rgba(255,255,255,0.94)', border: '1px solid var(--border)' }} aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          <svg className="w-3.5 h-3.5" fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: isWishlisted ? 'var(--primary)' : '#555' }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 3 14.5 3 8.5a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 12.5-9 12.5z" /></svg>
        </button>
      </div>
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.14em' }}>{product.categories[0]?.name ?? 'Tulda'}</p>
        <Link to={`/product/${product.slug}`} className="min-h-[2.5rem] text-sm font-semibold leading-snug mb-2 hover:text-[var(--primary)] transition-colors" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--foreground)' }}>{product.name}</Link>
        <p className="tulda-card-description tulda-card-description-brief text-[11px] mb-4 leading-relaxed" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>{product.shortDescription ?? product.description ?? 'Professional automotive refinishing product.'}</p>
        <div className="mb-3 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
          <div className="mb-1.5 flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Option</span>{product.variants.length > 1 && <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{product.variants.length} choices</span>}</div>
          <VariantControl product={product} selectedVariant={selectedVariant} onChange={setSelectedVariant} />
        </div>
        <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div><span className="text-xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--foreground)', letterSpacing: '0.01em' }}>{formatMoney(selectedVariant.priceMinor, selectedVariant.currency)}</span>{product.variants.length > 1 && selectedVariant.id === product.variants[0].id && <span className="block text-[10px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>from</span>}</div>
          <button onClick={handleAddToCart} disabled={!selectedVariant.isInStock} className="tulda-button shrink-0 px-3" style={{ backgroundColor: adding ? '#166534' : undefined }}>{adding ? 'Added' : 'Add to Cart'}</button>
        </div>
      </div>
    </article>
  )
}
