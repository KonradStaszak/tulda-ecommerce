import { useState } from 'react'
import type { CatalogueCartLine, CatalogueProduct, Product as MockProduct } from '../types/catalog'
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
    setTimeout(() => setAdding(false), 1200)
  }

  return (
    <article
      className="group flex flex-col border rounded-sm overflow-hidden hover:shadow-[0_2px_16px_rgba(0,0,0,0.08)] hover:border-[#d0d0d0] transition-[box-shadow,border-color] duration-[180ms]"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--background)',
        transition: 'box-shadow 0.18s, border-color 0.18s',
      }}
    >
      {/* Image zone */}
      <div
        className="relative flex items-end justify-center pt-6 pb-4 overflow-hidden"
        style={{ backgroundColor: '#f4f4f4', minHeight: '180px' }}
      >
        {product.primaryImage ? (
          <img
            src={product.primaryImage.path}
            alt={product.primaryImage.altText ?? product.name}
            className="h-[172px] w-full object-contain px-5"
          />
        ) : (
          <div className="flex h-[172px] items-center justify-center text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
            Product image unavailable
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {!product.isInStock && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm"
              style={{ backgroundColor: '#e5e5e5', color: '#666', fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em' }}>
              Out of stock
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={onToggleWishlist}
          className={`absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-sm transition-opacity ${isWishlisted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          style={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            border: '1px solid var(--border)',
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg className="w-3.5 h-3.5" fill={isWishlisted ? 'currentColor' : 'none'}
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            style={{ color: isWishlisted ? 'var(--primary)' : '#555' }}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 21C12 21 3 14.5 3 8.5a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 12.5-9 12.5z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category */}
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
          style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.14em' }}>
          {product.categories[0]?.name ?? 'Tulda'}
        </p>

        {/* Name */}
        <h3 className="text-[13px] font-semibold leading-snug mb-1.5"
          style={{ fontFamily: 'Inter, sans-serif', color: 'var(--foreground)' }}>
          {product.name}
        </h3>

        {/* Key spec */}
        <p className="text-[11px] mb-3 leading-snug"
          style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
          {product.shortDescription ?? product.description ?? 'Professional automotive refinishing product.'}
        </p>

        {/* Size selector — show max 3, scroll if more */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.variants.slice(0, 4).map(variant => (
            <button key={variant.id} onClick={() => setSelectedVariant(variant)}
              className="px-2 py-1 text-[10px] font-medium rounded-sm border transition-all"
              style={{
                borderColor: selectedVariant.id === variant.id ? 'var(--primary)' : 'var(--border)',
                backgroundColor: selectedVariant.id === variant.id ? 'var(--primary)' : 'transparent',
                color: selectedVariant.id === variant.id ? '#fff' : 'var(--foreground)',
                fontFamily: 'Inter, sans-serif',
              }}>
              {variant.label}
            </button>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t"
          style={{ borderColor: 'var(--border)' }}>
          <div>
            <span className="text-base font-bold"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--foreground)', letterSpacing: '0.01em' }}>
              {formatMoney(selectedVariant.priceMinor, selectedVariant.currency)}
            </span>
            {product.variants.length > 1 && selectedVariant.id === product.variants[0].id && (
              <span className="text-[10px] ml-1" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
                from
              </span>
            )}
          </div>

          <button onClick={handleAddToCart} disabled={!selectedVariant.isInStock}
            className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: adding ? '#166534' : 'var(--primary)',
              color: '#ffffff',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.03em',
              minWidth: '82px',
              justifyContent: 'center',
            }}>
            {adding ? (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}

/* Packshot visual — styled bottle/container per product category */
// Retained temporarily for the legacy mock catalogue path; real catalogue cards use local product images above.
function ProductBottle({ product }: { product: MockProduct }) {
  const isAbrasive = product.category === 'abrasives'
  const isFiller = product.category === 'filler'
  const isKit = product.category === 'kits'

  if (isAbrasive) {
    return (
      <div className="flex items-center justify-center gap-3 pb-2">
        {/* Disc stack */}
        <div className="relative w-20 h-20">
          {[3, 2, 1, 0].map(i => (
            <div key={i}
              className="absolute rounded-full"
              style={{
                width: `${68 - i * 2}px`,
                height: `${68 - i * 2}px`,
                top: `${i * 2.5}px`,
                left: `${i}px`,
                backgroundColor: i === 0 ? product.bottleColor : `hsl(${20 + i * 5}, 40%, ${25 + i * 8}%)`,
                boxShadow: 'inset -3px -3px 6px rgba(0,0,0,0.2)',
              }}
            />
          ))}
          {/* Hole */}
          <div className="absolute rounded-full bg-[#f4f4f4]"
            style={{ width: 16, height: 16, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>
        {/* Label */}
        <div>
          <p className="text-xs font-black" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: product.bottleColor }}>
            {product.code}
          </p>
          <p className="text-[9px]" style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>All grits</p>
        </div>
      </div>
    )
  }

  if (isFiller) {
    return (
      <div className="flex items-end gap-2">
        {/* Tub shape */}
        <div className="relative">
          <div className="w-20 h-16 rounded-md flex items-center justify-center"
            style={{ backgroundColor: product.bottleColor, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <span className="text-white text-[11px] font-black" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              {product.code}
            </span>
          </div>
          {/* Lid */}
          <div className="w-20 h-4 rounded-t-sm -mt-0.5"
            style={{ backgroundColor: 'var(--primary)', opacity: 0.9 }} />
          {/* Shadow */}
          <div className="w-16 h-1.5 rounded-full mx-auto mt-1" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }} />
        </div>
      </div>
    )
  }

  if (isKit) {
    // Two small bottles
    return (
      <div className="flex items-end gap-2 pb-1">
        {[{ c: product.bottleColor, h: 100, code: 'A' }, { c: '#2d4a22', h: 88, code: 'B' }].map(b => (
          <div key={b.code} className="relative flex flex-col items-center">
            <div className="w-2 h-3 rounded-t-full" style={{ backgroundColor: 'var(--primary)' }} />
            <div className="w-12 rounded-t-full rounded-b-sm flex items-center justify-center"
              style={{ height: b.h, backgroundColor: b.c, boxShadow: '2px 0 8px rgba(0,0,0,0.12)' }}>
              <span className="text-white text-[9px] font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif', writingMode: 'vertical-rl' }}>
                {b.code}
              </span>
            </div>
            <div className="w-9 h-1 rounded-full mt-1" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }} />
          </div>
        ))}
      </div>
    )
  }

  // Default: spray bottle / liquid bottle
  const bottleH = product.category === 'thinner' ? 96 : 112

  return (
    <div className="relative flex flex-col items-center">
      {/* Cap */}
      <div className="w-9 h-4 rounded-t-full" style={{ backgroundColor: 'var(--primary)' }} />
      {/* Neck */}
      <div className="w-6 h-3" style={{ backgroundColor: product.bottleColor }} />
      {/* Shoulder taper — using clip-path trick with border */}
      <div className="w-14 h-3"
        style={{ backgroundColor: product.bottleColor, clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)' }} />
      {/* Body */}
      <div
        className="relative w-[52px] rounded-b-sm flex flex-col items-center justify-between py-3 overflow-hidden"
        style={{
          height: bottleH,
          backgroundImage: `linear-gradient(105deg, ${product.bottleColor}dd 0%, ${product.bottleColor} 40%, ${product.bottleColor}cc 100%)`,
          boxShadow: 'inset -4px 0 10px rgba(0,0,0,0.15), inset 3px 0 6px rgba(255,255,255,0.06)',
        }}
      >
        {/* Shine strip */}
        <div className="absolute top-0 left-3 w-1.5 h-full opacity-10 rounded-full"
          style={{ backgroundColor: 'white' }} />
        {/* White label area */}
        <div className="w-full mx-2 rounded-sm flex flex-col items-center justify-center py-2"
          style={{ backgroundColor: 'rgba(255,255,255,0.92)', margin: '0 6px', width: 'calc(100% - 12px)' }}>
          <span className="font-black text-[10px] leading-none"
            style={{ fontFamily: 'Barlow Condensed, sans-serif', color: product.bottleColor, letterSpacing: '0.02em' }}>
            {product.code}
          </span>
          <span className="text-[7px] leading-none mt-0.5"
            style={{ color: '#555', fontFamily: 'Inter, sans-serif' }}>
            TULDA
          </span>
        </div>
      </div>
      {/* Shadow */}
      <div className="w-10 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'rgba(0,0,0,0.07)' }} />
    </div>
  )
}
