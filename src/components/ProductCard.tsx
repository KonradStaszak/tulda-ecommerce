import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { CatalogueCartLine, CatalogueProduct } from '../types/catalog'
import { formatMoney } from '../services/catalogue/money'

interface ProductCardProps {
  product: CatalogueProduct
  onAddToCart: (item: CatalogueCartLine) => void
  isWishlisted: boolean
  onToggleWishlist: () => void
}

export default function ProductCard({ product, onAddToCart, isWishlisted, onToggleWishlist }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [adding, setAdding] = useState(false)

  const handleAddToCart = () => {
    if (!selectedVariant.isInStock) return
    setAdding(true)
    onAddToCart({ product, variant: selectedVariant, size: selectedVariant.label, quantity: 1 })
    window.setTimeout(() => setAdding(false), 1200)
  }

  return (
    <article className="group flex flex-col border rounded-sm overflow-hidden hover:shadow-[0_2px_16px_rgba(0,0,0,0.08)] hover:border-[#d0d0d0] transition-[box-shadow,border-color] duration-[180ms]" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
      <div className="relative flex items-end justify-center pt-6 pb-4 overflow-hidden" style={{ backgroundColor: '#f4f4f4', minHeight: '180px' }}>
        <Link to={`/product/${product.slug}`} className="absolute inset-0 z-0" aria-label={`View ${product.name}`} />
        {product.primaryImage ? <img src={product.primaryImage.path} alt={product.primaryImage.altText ?? product.name} className="relative z-10 h-[172px] w-full object-contain px-5 pointer-events-none" /> : <div className="relative z-10 flex h-[172px] items-center justify-center text-xs pointer-events-none" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>Product image unavailable</div>}
        {!product.isInStock && <span className="absolute z-10 top-3 left-3 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm" style={{ backgroundColor: '#e5e5e5', color: '#666', fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em' }}>Out of stock</span>}
        <button onClick={onToggleWishlist} className={`absolute z-10 top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-sm transition-opacity ${isWishlisted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid var(--border)' }} aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          <svg className="w-3.5 h-3.5" fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: isWishlisted ? 'var(--primary)' : '#555' }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 3 14.5 3 8.5a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 12.5-9 12.5z" /></svg>
        </button>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.14em' }}>{product.categories[0]?.name ?? 'Tulda'}</p>
        <Link to={`/product/${product.slug}`} className="text-[13px] font-semibold leading-snug mb-1.5 hover:text-[var(--primary)] transition-colors" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--foreground)' }}>{product.name}</Link>
        <p className="text-[11px] mb-3 leading-snug" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>{product.shortDescription ?? product.description ?? 'Professional automotive refinishing product.'}</p>
        <div className="flex flex-wrap gap-1 mb-4">{product.variants.slice(0, 4).map((variant) => <button key={variant.id} onClick={() => setSelectedVariant(variant)} className="px-2 py-1 text-[10px] font-medium rounded-sm border transition-all" style={{ borderColor: selectedVariant.id === variant.id ? 'var(--primary)' : 'var(--border)', backgroundColor: selectedVariant.id === variant.id ? 'var(--primary)' : 'transparent', color: selectedVariant.id === variant.id ? '#fff' : 'var(--foreground)', fontFamily: 'Inter, sans-serif' }}>{variant.label}</button>)}</div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div><span className="text-base font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--foreground)', letterSpacing: '0.01em' }}>{formatMoney(selectedVariant.priceMinor, selectedVariant.currency)}</span>{product.variants.length > 1 && selectedVariant.id === product.variants[0].id && <span className="text-[10px] ml-1" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>from</span>}</div>
          <button onClick={handleAddToCart} disabled={!selectedVariant.isInStock} className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: adding ? '#166534' : 'var(--primary)', color: '#ffffff', fontFamily: 'Inter, sans-serif', letterSpacing: '0.03em', minWidth: '82px', justifyContent: 'center' }}>{adding ? 'Added' : 'Add to Cart'}</button>
        </div>
      </div>
    </article>
  )
}
