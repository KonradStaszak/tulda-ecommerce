import { useState } from "react"
import { Link } from "react-router-dom"
import type { CatalogueCategory, CatalogueProduct } from "../types/catalog"
import { getProductCardImage } from "../lib/productImages"

interface ShopByCategoryProps {
  categories: CatalogueCategory[]
  products: CatalogueProduct[]
  loading: boolean
}

const processOrder = [
  "abrasives",
  "filler",
  "primer",
  "thinner",
  "clearcoat",
  "kits",
  "industrial",
]

const representativeProductMatchers: Record<string, (
  product: CatalogueProduct,
) => boolean> = {
  abrasives: (product) => product.name.toLowerCase().includes("sanding film"),
  clearcoat: (product) => product.name.toLowerCase().includes("ct50"),
  filler: (product) => product.name.toLowerCase().includes("bt01"),
  industrial: (product) => product.name.toLowerCase().includes("upvc"),
  kits: (product) => product.name.toLowerCase().includes("ct60"),
  primer: (product) => product.name.toLowerCase().includes("pt30"),
  thinner: (product) => product.name.toLowerCase().includes("st10"),
}

function getCategoryImage(
  category: CatalogueCategory,
  products: CatalogueProduct[],
) {
  const categoryProducts = products.filter((product) =>
    product.categories.some(
      (productCategory) => productCategory.id === category.id,
    ),
  )
  const matcher = representativeProductMatchers[category.slug]
  const representativeProduct = matcher
    ? categoryProducts.find(matcher)
    : undefined
  return (
    (representativeProduct
      ? getProductCardImage(representativeProduct)
      : undefined
    )?.path ??
    categoryProducts.map(getProductCardImage).find((image) => image)?.path ??
    category.image
  )
}

function orderCategories(categories: CatalogueCategory[]) {
  return [...categories].sort((left, right) => {
    const leftIndex = processOrder.indexOf(left.slug)
    const rightIndex = processOrder.indexOf(right.slug)
    return (
      (leftIndex === -1 ? processOrder.length : leftIndex) -
        (rightIndex === -1 ? processOrder.length : rightIndex) ||
      left.name.localeCompare(right.name)
    )
  })
}

export default function ShopByCategory({
  categories,
  products,
  loading,
}: ShopByCategoryProps) {
  const displayCategories = orderCategories(
    categories.filter((category) => category.parentId === null),
  )
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(
    null,
  )
  const activeIndex = Math.max(
    0,
    displayCategories.findIndex(
      (category) => category.slug === activeCategorySlug,
    ),
  )
  const activeCategory = displayCategories[activeIndex]
  const categoryImage = activeCategory
    ? getCategoryImage(activeCategory, products)
    : undefined
  const changeSlide = (direction: number) => {
    if (displayCategories.length === 0) return
    const nextIndex =
      (activeIndex + direction + displayCategories.length) %
      displayCategories.length
    setActiveCategorySlug(displayCategories[nextIndex].slug)
  }

  return (
    <section id="categories" className="bg-[var(--background)] py-16 md:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="flex flex-col justify-between border-l-4 border-[var(--primary)] pl-6 md:pl-8">
          <div>
            <h2 className="font-[var(--font-heading)] text-4xl font-bold uppercase leading-[0.9] tracking-tight text-[var(--foreground)] sm:text-5xl">
              TULDA. Built for the way automotive refinishing works today.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--muted-foreground)]">
              Developed for professional painters, bodyshops and smart repair
              specialists, our systems support everything from small, localised
              repairs to larger repairs and full resprays.
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted-foreground)]">
              Explore the range in the order your work happens: prepare, repair,
              prime and finish.
            </p>
          </div>
          <Link
            to="/products"
            className="mt-8 inline-flex w-fit items-center gap-2 border-b border-[var(--primary)] pb-1 text-xs font-bold uppercase tracking-[0.08em] transition-colors hover:text-[var(--primary)]"
          >
            View the complete range <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h3 className="font-[var(--font-heading)] text-3xl font-bold uppercase leading-none sm:text-4xl">
                Explore by category
              </h3>
            </div>
            {!loading && displayCategories.length > 1 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => changeSlide(-1)}
                  className="flex h-10 w-10 items-center justify-center border transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  aria-label="Previous category"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => changeSlide(1)}
                  className="flex h-10 w-10 items-center justify-center border transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  aria-label="Next category"
                >
                  →
                </button>
              </div>
            )}
          </div>

          {loading || !activeCategory ? (
            <div className="h-[520px] animate-pulse border bg-[var(--muted)] sm:h-[390px]" />
          ) : (
            <article className="group relative grid overflow-hidden border bg-[#f3f6f7] sm:min-h-[390px] sm:grid-cols-[1fr_0.9fr]">
              <div className="flex flex-col gap-5 p-5 sm:justify-between sm:p-9">
                <div>
                  <h4 className="font-[var(--font-heading)] text-4xl font-bold uppercase leading-[0.9] tracking-tight text-[var(--foreground)] sm:text-5xl sm:leading-[0.86]">
                    {activeCategory.name}
                  </h4>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)] sm:mt-5">
                    {activeCategory.description ??
                      `Professional ${activeCategory.name.toLowerCase()} products for dependable refinishing work.`}
                  </p>
                </div>
                <Link
                  to={`/products/${activeCategory.slug}`}
                  className="tulda-button mt-0 w-fit px-5 sm:mt-8"
                >
                  FIND OUT MORE <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="relative h-[330px] min-h-[330px] overflow-hidden border-t border-[#dbe3e7] sm:h-auto sm:min-h-[220px] sm:border-l sm:border-t-0">
                {categoryImage ? (
                  <img
                    key={activeCategory.id}
                    src={categoryImage}
                    alt={`${activeCategory.name} by Tulda`}
                    className="absolute inset-0 h-full w-full object-contain p-4 transition duration-500 ease-out group-hover:scale-105 sm:p-8"
                  />
                ) : null}
              </div>
            </article>
          )}
          {!loading && displayCategories.length > 1 && (
            <div
              className="mt-5 flex gap-2"
              aria-label="Category slide selector"
            >
              {displayCategories.map((category, index) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategorySlug(category.slug)}
                  className={`h-1.5 flex-1 transition-colors ${
                    index === activeIndex
                      ? "bg-[var(--primary)]"
                      : "bg-[var(--border)] hover:bg-[var(--muted-foreground)]"
                  }`}
                  aria-label={`Show ${category.name}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
