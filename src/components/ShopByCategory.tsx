import { Link } from 'react-router-dom'
import type { CatalogueCategory, CatalogueProduct } from '../types/catalog'
import { getProductCardImage } from '../lib/productImages'

interface ShopByCategoryProps {
  categories: CatalogueCategory[]
  products: CatalogueProduct[]
  loading: boolean
}

function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  )
}

const secondaryCategoryLabels: Record<string, string> = {
  industrial: 'Binders',
  primer: 'Primer Kits',
}

const representativeProductMatchers: Record<string, (product: CatalogueProduct) => boolean> = {
  abrasives: (product) => product.name.toLowerCase().includes('sanding film'),
  clearcoat: (product) => product.name.toLowerCase().includes('ct50'),
  filler: (product) => product.name.toLowerCase().includes('bt01'),
  industrial: (product) => product.name.toLowerCase().includes('upvc'),
  kits: (product) => product.name.toLowerCase().includes('ct60'),
  primer: (product) => product.name.toLowerCase().includes('pt30'),
  thinner: (product) => product.name.toLowerCase().includes('st10'),
}

const loadingCategories: CatalogueCategory[] = Array.from({ length: 7 }, (_, index) => ({
  id: `loading-${index}`,
  woocommerceId: null,
  slug: '',
  name: '',
  description: null,
  parentId: null,
  productCount: 0,
  image: null,
  color: '#f5f6f7',
}))

function getCategoryImage(category: CatalogueCategory, products: CatalogueProduct[]) {
  const categoryProducts = products.filter((product) =>
    product.categories.some((productCategory) => productCategory.id === category.id),
  )
  const matcher = representativeProductMatchers[category.slug]
  const representativeProduct = matcher ? categoryProducts.find(matcher) : undefined
  const representativeImage = representativeProduct ? getProductCardImage(representativeProduct) : undefined

  return representativeImage?.path
    ?? categoryProducts.map(getProductCardImage).find((image) => image)?.path
    ?? category.image
}

export default function ShopByCategory({ categories, products, loading }: ShopByCategoryProps) {
  const mainCategories = categories.filter((category) => category.parentId === null)
  const displayCategories = loading ? loadingCategories : mainCategories

  return (
    <section id="categories" className="bg-[var(--background)] py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-5 md:mb-9">
          <div>
            <h2 className="font-[var(--font-heading)] text-3xl font-bold uppercase leading-[0.95] tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl">
              Shop by category
            </h2>
          </div>
          <Link
            to="/products"
            className="group hidden shrink-0 items-center gap-2 border-b border-[var(--primary)] pb-1 text-xs font-bold uppercase tracking-[0.08em] text-[var(--foreground)] transition-colors hover:text-[var(--primary)] sm:inline-flex"
          >
            View all products
            <ArrowRight className="h-[15px] w-[15px] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {displayCategories.map((category) => {
            const image = getCategoryImage(category, products)
            const secondaryLabel = secondaryCategoryLabels[category.slug]

            if (loading) {
              return (
                <div
                  key={category.id}
                  className="h-[248px] animate-pulse border border-[#e2e5e8] bg-[#f5f6f7] sm:h-[330px] xl:h-[380px]"
                />
              )
            }

            return (
              <Link
                key={category.id}
                to={`/products/${category.slug}`}
                className="group flex h-[248px] min-w-0 flex-col border border-[#e2e5e8] bg-[#f5f6f7] transition-[border-color] duration-200 hover:border-[var(--primary)] sm:h-[330px] xl:h-[380px]"
              >
                <div className="relative flex min-h-0 flex-[0_0_67%] items-center justify-center px-5 pb-2 pt-5 sm:px-7">
                  <span className="absolute left-5 top-5 h-0.5 w-6 bg-[var(--primary)] sm:left-6" aria-hidden="true" />
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      className="pointer-events-none h-full max-h-full w-full max-w-full object-contain object-center transition-transform duration-200 group-hover:-translate-y-[3px]"
                    />
                  ) : null}
                </div>

                <div className="flex min-w-0 flex-1 items-end justify-between gap-3 border-t border-[#e2e5e8] px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <h3 className="font-[var(--font-heading)] text-lg font-bold uppercase leading-none tracking-tight text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--primary)] sm:text-xl">
                      {category.name}
                    </h3>
                    <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                      {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                      {secondaryLabel ? <><span aria-hidden="true"> &middot; </span>{secondaryLabel}</> : null}
                    </p>
                  </div>
                  <ArrowRight className="mb-0.5 h-[18px] w-[18px] shrink-0 text-[var(--primary)] transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>

        <Link
          to="/products"
          className="mt-7 inline-flex items-center gap-2 border-b border-[var(--primary)] pb-1 text-xs font-bold uppercase tracking-[0.08em] text-[var(--foreground)] sm:hidden"
        >
          View all products
          <ArrowRight className="h-[15px] w-[15px]" />
        </Link>
      </div>
    </section>
  )
}
