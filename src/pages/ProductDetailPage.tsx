import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import QuantitySelector from '../components/QuantitySelector'
import { formatMoney } from '../services/catalogue/money'
import { getProductBySlug, getTechnicalDocumentsByProductId } from '../services/catalogue/repository'
import type { CatalogueTechnicalDocument } from '../services/catalogue/repository'
import type { CatalogueCartLine, CatalogueProduct, CatalogueVariant } from '../types/catalog'

interface ProductDetailPageProps {
  allProducts: CatalogueProduct[]
  onAddToCart: (item: CatalogueCartLine) => void
  wishlist: string[]
  onToggleWishlist: (productId: string) => void
}

function defaultVariant(product: CatalogueProduct): CatalogueVariant {
  return product.variants.filter((variant) => variant.isInStock).sort((a, b) => a.priceMinor - b.priceMinor || a.sortOrder - b.sortOrder)[0] ?? product.variants[0]
}

export default function ProductDetailPage({ allProducts, onAddToCart, wishlist, onToggleWishlist }: ProductDetailPageProps) {
  const { productSlug = '' } = useParams()
  const [product, setProduct] = useState<CatalogueProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [documents, setDocuments] = useState<CatalogueTechnicalDocument[]>([])
  const [selectedVariant, setSelectedVariant] = useState<CatalogueVariant | null>(null)
  const [activeImageId, setActiveImageId] = useState<string | null>(null)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    setProduct(null)
    setDocuments([])
    setFailedImages(new Set())
    setQuantity(1)
    getProductBySlug(productSlug)
      .then(async (result) => {
        if (!active) return
        setProduct(result)
        setSelectedVariant(result ? defaultVariant(result) : null)
        setActiveImageId(result?.primaryImage?.id ?? result?.galleryImages[0]?.id ?? null)
        if (result) {
          const productDocuments = await getTechnicalDocumentsByProductId(result.id)
          if (active) setDocuments(productDocuments)
        }
      })
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason : new Error('Unable to load product.')))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [productSlug])

  const activeImage = product?.galleryImages.find((image) => image.id === activeImageId) ?? product?.primaryImage ?? null
  const displayCategory = product?.categories[0]
  const relatedProducts = useMemo(() => {
    if (!product) return []
    const categoryIds = new Set(product.categories.map((category) => category.id))
    return allProducts.filter((candidate) => candidate.id !== product.id && candidate.categories.some((category) => categoryIds.has(category.id))).slice(0, 4)
  }, [allProducts, product])

  const addToCart = () => {
    if (!product || !selectedVariant || !selectedVariant.isInStock) return
    onAddToCart({ product, variant: selectedVariant, size: selectedVariant.label, quantity })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  if (loading) return <LoadingProduct />
  if (error) return <ProductError />
  if (!product) return <ProductNotFound />

  return (
    <main>
      <section className="max-w-[1400px] mx-auto px-6 py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
          <Link to="/" className="hover:text-[var(--primary)]">Home</Link><span>/</span>
          <Link to="/products" className="hover:text-[var(--primary)]">Products</Link><span>/</span>
          {displayCategory && <><Link to={`/products/${displayCategory.slug}`} className="hover:text-[var(--primary)]">{displayCategory.name}</Link><span>/</span></>}
          <span style={{ color: 'var(--foreground)' }}>{product.name}</span>
        </nav>

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14">
          <section aria-label="Product gallery" className="min-w-0">
            <div className="relative min-h-[320px] sm:min-h-[460px] flex items-center justify-center border rounded-sm overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
              {activeImage && !failedImages.has(activeImage.id) ? <img src={activeImage.path} alt={activeImage.altText ?? product.name} className="w-full h-full max-h-[620px] object-contain p-6 md:p-10" onError={() => setFailedImages((current) => new Set(current).add(activeImage.id))} /> : <p className="text-sm" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>Product image unavailable</p>}
            </div>
            {product.galleryImages.length > 1 && <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 gap-2">
              {product.galleryImages.map((image, index) => <button key={image.id} type="button" onClick={() => setActiveImageId(image.id)}
                aria-label={`View image ${index + 1} of ${product.name}`} aria-pressed={activeImage?.id === image.id}
                className="aspect-square rounded-sm border overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                style={{ borderColor: activeImage?.id === image.id ? 'var(--primary)' : 'var(--border)', backgroundColor: 'var(--muted)' }}>
                {!failedImages.has(image.id) && <img src={image.path} alt="" className="w-full h-full object-contain p-1" onError={() => setFailedImages((current) => new Set(current).add(image.id))} />}
              </button>)}
            </div>}
          </section>

          <section className="lg:pt-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif' }}>{product.categories.map((category) => category.name).join(' · ')}</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-black leading-none" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'var(--foreground)' }}>{product.name}</h1>
            {product.code && <p className="mt-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>Code: {product.code}</p>}
            {(product.shortDescription ?? product.description) && <p className="mt-5 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>{product.shortDescription ?? product.description}</p>}

            {selectedVariant && <div className="mt-7 border-y py-5" style={{ borderColor: 'var(--border)' }}>
              <p className="text-3xl font-black" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{formatMoney(selectedVariant.priceMinor, selectedVariant.currency)}</p>
              <p className="mt-2 text-sm font-medium" style={{ color: selectedVariant.isInStock ? '#166534' : '#666', fontFamily: 'Inter, sans-serif' }}>{selectedVariant.isInStock ? 'In stock' : 'Out of stock'}</p>
            </div>}

            <fieldset className="mt-6">
              <legend className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Size / option</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((variant) => <button key={variant.id} type="button" onClick={() => setSelectedVariant(variant)} aria-pressed={selectedVariant?.id === variant.id}
                  className="px-3 py-2 text-xs font-semibold rounded-sm border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                  style={{ borderColor: selectedVariant?.id === variant.id ? 'var(--primary)' : 'var(--border)', backgroundColor: selectedVariant?.id === variant.id ? 'var(--primary)' : 'transparent', color: selectedVariant?.id === variant.id ? '#fff' : 'var(--foreground)', fontFamily: 'Inter, sans-serif' }}>
                  {variant.label}{!variant.isInStock ? ' — Out of stock' : ''}
                </button>)}
              </div>
            </fieldset>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <QuantitySelector value={quantity} onChange={setQuantity} disabled={!selectedVariant?.isInStock} />
              <button type="button" onClick={addToCart} disabled={!selectedVariant?.isInStock}
                className="flex-1 min-h-10 px-6 py-3 text-sm font-semibold rounded-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: added ? '#166534' : 'var(--primary)', color: '#fff', fontFamily: 'Inter, sans-serif', letterSpacing: '0.03em' }}>
                {added ? 'ADDED TO CART' : 'ADD TO CART'}
              </button>
              <button type="button" onClick={() => onToggleWishlist(product.id)} aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                className="min-h-10 px-4 border rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                style={{ borderColor: wishlist.includes(product.id) ? 'var(--primary)' : 'var(--border)', color: wishlist.includes(product.id) ? 'var(--primary)' : 'var(--foreground)' }}>
                {wishlist.includes(product.id) ? '♥ Saved' : '♡ Wishlist'}
              </button>
            </div>
            {selectedVariant && !selectedVariant.isInStock && <p className="mt-3 text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>This selected option is currently out of stock.</p>}
          </section>
        </div>

        <section className="mt-14 border-t pt-10" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-3xl font-black" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>OVERVIEW</h2>
          {product.description && <p className="mt-4 max-w-4xl text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>{product.description}</p>}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            {product.code && <Detail label="Product code" value={product.code} />}
            <Detail label="Categories" value={product.categories.map((category) => category.name).join(', ')} />
            <Detail label="Available options" value={product.variants.map((variant) => variant.label).join(', ')} />
            <Detail label="Availability" value={product.isInStock ? 'In stock' : 'Out of stock'} />
          </div>
        </section>

        {documents.length > 0 && <section className="mt-14 border-t pt-10" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-3xl font-black" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>TECHNICAL DOCUMENTS</h2>
          <div className="mt-5 grid gap-3 max-w-3xl">{documents.map((document) => {
            const href = document.externalUrl ?? document.storagePath
            return href ? <a key={document.id} href={href} target={document.externalUrl ? '_blank' : undefined} rel={document.externalUrl ? 'noreferrer' : undefined} className="flex items-center justify-between border rounded-sm px-4 py-3 text-sm hover:border-[var(--primary)]" style={{ borderColor: 'var(--border)', fontFamily: 'Inter, sans-serif' }}><span>{document.title}{document.version ? ` (${document.version})` : ''}</span><span style={{ color: 'var(--muted-foreground)' }}>{document.documentType}</span></a> : null
          })}</div>
        </section>}

        {relatedProducts.length > 0 && <section className="mt-14 border-t pt-10" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--primary)', fontFamily: 'Barlow Condensed, sans-serif' }}>Shared product category</p>
          <h2 className="mt-2 text-3xl font-black" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>YOU MAY ALSO NEED</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{relatedProducts.map((related) => <ProductCard key={related.id} product={related} onAddToCart={onAddToCart} isWishlisted={wishlist.includes(related.id)} onToggleWishlist={() => onToggleWishlist(related.id)} />)}</div>
        </section>}
      </section>
    </main>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="border rounded-sm p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}><p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>{label}</p><p className="mt-1 text-sm">{value}</p></div>
}

function LoadingProduct() { return <main className="max-w-[1400px] mx-auto px-6 py-16"><div className="h-[560px] animate-pulse rounded-sm" style={{ backgroundColor: 'var(--muted)' }} /></main> }
function ProductError() { return <main className="max-w-[1400px] mx-auto px-6 py-24 text-center"><h1 className="text-3xl font-black" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>PRODUCT UNAVAILABLE</h1><p className="mt-3 text-sm" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>We could not load this product. Please try again.</p></main> }
function ProductNotFound() { return <main className="max-w-[1400px] mx-auto px-6 py-24 text-center"><h1 className="text-3xl font-black" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>PRODUCT NOT FOUND</h1><Link to="/products" className="inline-flex mt-7 px-5 py-2.5 text-sm font-semibold rounded-sm" style={{ backgroundColor: 'var(--primary)', color: '#fff', fontFamily: 'Inter, sans-serif' }}>VIEW PRODUCTS</Link></main> }
