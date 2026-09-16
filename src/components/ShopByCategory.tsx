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

const enlargedShowcaseCategories = new Set(["primer", "thinner", "kits"])

const representativeProductMatchers: Record<string, (
  product: CatalogueProduct,
) => boolean> = {
  abrasives: (product) => product.name.toLowerCase().includes("sanding film"),
  clearcoat: (product) =>
    product.slug === "xct100-clearcoat-21-vhs-extra-speed-clear",
  filler: (product) => product.name.toLowerCase().includes("bt01"),
  industrial: (product) => product.name.toLowerCase().includes("upvc"),
  kits: (product) => product.name.toLowerCase().includes("ct60"),
  primer: (product) => product.name.toLowerCase().includes("pt30"),
  thinner: (product) => product.name.toLowerCase().includes("st10"),
}

interface CategoryShowcase {
  background: string
  backgroundPosition?: string
  products: Array<{ src: string className: string }>
}

const categoryShowcases: Record<string, CategoryShowcase> = {
  abrasives: {
    background: "/assets/category-banners/abrasives-workshop.webp",
    products: [
      {
        src: "/assets/products/tulda-6-150mm-15h-sanding-paper-disc-all-grits-box-of-100/product-cutout-p800.png",
        className:
          "absolute bottom-[8%] left-[3%] z-20 h-[72%] w-[58%] object-contain object-bottom",
      },
      {
        src: "/assets/products/tulda-paper-strips-70x420-14h-all-grits-box-of-50/product-cutout-p120.png",
        className:
          "absolute bottom-[3%] left-[15%] z-30 h-[47%] w-[82%] object-contain object-bottom",
      },
      {
        src: "/assets/products/tulda-6-150mm-15h-sanding-film-discs-all-grits/product-cutout-p800.png",
        className:
          "absolute bottom-[12%] right-[1%] z-10 h-[58%] w-[43%] object-contain object-bottom opacity-95",
      },
    ],
  },
  filler: {
    background: "/assets/category-banners/filler-workshop.webp",
    backgroundPosition: "object-[66%_center]",
    products: [
      {
        src: "/assets/products/bt01-bodyfiller/cutout-bt01-bodyfiller.png",
        className:
          "absolute inset-x-[10%] bottom-[4%] h-[87%] w-[80%] object-contain object-bottom",
      },
    ],
  },
  primer: {
    background: "/assets/category-banners/primer-workshop.webp",
    backgroundPosition: "object-[65%_center]",
    products: [
      {
        src: "/assets/products/tulda-pt30-multiprimer/cutout-pt30-4.png",
        className:
          "absolute bottom-[5%] left-[2%] z-20 h-[61%] w-[36%] object-contain object-bottom",
      },
      {
        src: "/assets/products/tulda-pt30-multiprimer/cutout-pt30-kit.png",
        className:
          "absolute bottom-[3%] left-[22%] z-30 h-[88%] w-[58%] object-contain object-bottom",
      },
      {
        src: "/assets/products/tulda-pt30-multiprimer/cutout-pt30-1.png",
        className:
          "absolute bottom-[6%] right-[1%] z-20 h-[53%] w-[31%] object-contain object-bottom",
      },
    ],
  },
  thinner: {
    background: "/assets/category-banners/thinner-workshop.webp",
    backgroundPosition: "object-[64%_center]",
    products: [
      {
        src: "/assets/products/tulda-st10/cutout-st10-1.png",
        className:
          "absolute bottom-[6%] left-[4%] z-20 h-[55%] w-[31%] object-contain object-bottom",
      },
      {
        src: "/assets/products/tulda-st10/cutout-st10-5.png",
        className:
          "absolute bottom-[3%] left-[25%] z-30 h-[86%] w-[48%] object-contain object-bottom",
      },
      {
        src: "/assets/products/tulda-st11-acrylic-thinner-slow-1l/cutout-st11-1.png",
        className:
          "absolute bottom-[6%] right-[3%] z-20 h-[55%] w-[31%] object-contain object-bottom",
      },
    ],
  },
  clearcoat: {
    background: "/assets/category-banners/clearcoat-workshop.webp",
    backgroundPosition: "object-[68%_center]",
    products: [
      {
        src: "/assets/products/tulda-ct90-vhs-speedline-acrylic-clearcoat-1l/cutout-ct90-7-5-kit.png",
        className:
          "absolute bottom-[5%] left-[0%] z-20 h-[65%] w-[39%] object-contain object-bottom",
      },
      {
        src: "/assets/products/xct100-clearcoat-21-vhs-extra-speed-clear/cutout-xct100-7-5-kit.png",
        className:
          "absolute bottom-[2%] left-[20%] z-30 h-[90%] w-[60%] object-contain object-bottom",
      },
      {
        src: "/assets/products/tulda-ct60-multi-clear-21-hs-speedline-acrylic-lacquer-kit-7-5l/cutout-ct60-7-5-kit.png",
        className:
          "absolute bottom-[5%] right-[0%] z-20 h-[65%] w-[39%] object-contain object-bottom",
      },
    ],
  },
  kits: {
    background: "/assets/category-banners/kits-workshop.webp",
    backgroundPosition: "object-[65%_center]",
    products: [
      {
        src: "/assets/products/tulda-ct90-vhs-speedline-acrylic-clearcoat-1l/cutout-ct90-1-5-kit.png",
        className:
          "absolute bottom-[5%] left-[1%] z-20 h-[62%] w-[38%] object-contain object-bottom",
      },
      {
        src: "/assets/products/xct100-clearcoat-21-vhs-extra-speed-clear/cutout-xct100-1-5-kit.png",
        className:
          "absolute bottom-[3%] left-[22%] z-30 h-[82%] w-[56%] object-contain object-bottom",
      },
      {
        src: "/assets/products/tulda-ct60-multi-clear-21-hs-speedline-acrylic-lacquer-kit-7-5l/cutout-ct60-1-5-kit.png",
        className:
          "absolute bottom-[5%] right-[1%] z-20 h-[62%] w-[38%] object-contain object-bottom",
      },
    ],
  },
  industrial: {
    background: "/assets/category-banners/industrial-workshop.webp",
    backgroundPosition: "object-[66%_center]",
    products: [
      {
        src: "/assets/products/upvc-1k-binder-731-topcoat-4-25l/cutout-1k-binder-731.png",
        className:
          "absolute bottom-[5%] left-[1%] z-20 h-[61%] w-[35%] object-contain object-bottom",
      },
      {
        src: "/assets/products/upvc-2k-binder-561-topcoat-4l/cutout-upvc-2k-binder-561.png",
        className:
          "absolute bottom-[3%] left-[22%] z-30 h-[86%] w-[56%] object-contain object-bottom",
      },
      {
        src: "/assets/products/upvc-2k-binder-561-topcoat-4l/cutout-h63-hardener-1.png",
        className:
          "absolute bottom-[5%] right-[2%] z-20 h-[57%] w-[32%] object-contain object-bottom",
      },
    ],
  },
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
  const categoryImageScaleClass =
    activeCategory?.slug === "clearcoat" ? "scale-[1.28]" : "scale-100"
  const activeShowcase = activeCategory
    ? categoryShowcases[activeCategory.slug]
    : undefined
  const hasShowcase = Boolean(activeShowcase)
  const enlargeShowcaseProducts = activeCategory
    ? enlargedShowcaseCategories.has(activeCategory.slug)
    : false
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
            <article className="relative grid overflow-hidden border border-[#2b3034] bg-[#0a0c0e] sm:min-h-[390px] sm:grid-cols-[1fr_0.9fr]">
              {hasShowcase ? (
                <>
                  <img
                    src={activeShowcase?.background}
                    alt=""
                    className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${
                      activeShowcase?.backgroundPosition ??
                      "object-[62%_center]"
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(4,9,12,0.97)_0%,rgba(4,9,12,0.86)_43%,rgba(4,9,12,0.28)_72%,rgba(4,9,12,0.18)_100%)] sm:bg-[linear-gradient(90deg,rgba(4,9,12,0.97)_0%,rgba(4,9,12,0.88)_42%,rgba(4,9,12,0.25)_67%,rgba(4,9,12,0.12)_100%)]" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent" />
                </>
              ) : (
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 1000 500"
                >
                  <polygon points="0,0 345,0 250,146" fill="#0d1012" />
                  <polygon
                    points="345,0 520,0 384,153 250,146"
                    fill="#111518"
                  />
                  <polygon points="250,146 384,153 318,286" fill="#181d20" />
                  <polygon
                    points="0,112 250,146 318,286 76,500 0,500"
                    fill="#0e1214"
                  />
                  <polygon
                    points="318,286 520,180 514,500 76,500"
                    fill="#151a1d"
                  />
                  <polygon
                    points="384,153 520,0 586,210 520,180"
                    fill="#0b0e10"
                  />
                  <polygon points="520,180 586,210 514,500" fill="#1b2023" />
                  <polygon
                    points="586,0 1000,0 1000,160 586,210"
                    fill="#15191c"
                  />
                  <polygon
                    points="586,210 1000,160 832,330 514,500"
                    fill="#1d2225"
                  />
                  <polygon
                    points="832,330 1000,160 1000,500 514,500"
                    fill="#121619"
                  />
                  <path
                    d="M430 0 L1000 146"
                    fill="none"
                    stroke="var(--primary)"
                    strokeOpacity="0.42"
                    strokeWidth="4"
                  />
                  <path
                    d="M0 426 L126 500"
                    fill="none"
                    stroke="var(--primary)"
                    strokeOpacity="0.2"
                    strokeWidth="3"
                  />
                </svg>
              )}
              <div className="relative z-10 flex flex-col gap-5 p-5 sm:justify-between sm:p-9">
                <div>
                  <h4 className="font-[var(--font-heading)] text-4xl font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-5xl sm:leading-[0.86]">
                    {activeCategory.name}
                  </h4>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#aeb8bd] sm:mt-5">
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
              <div
                className={`relative z-10 h-[330px] min-h-[330px] overflow-hidden sm:h-auto sm:min-h-[220px] ${
                  hasShowcase
                    ? "bg-[radial-gradient(circle_at_45%_55%,rgba(24,174,229,0.13),transparent_65%)]"
                    : "bg-[radial-gradient(circle_at_52%_48%,rgba(255,255,255,0.12),rgba(255,255,255,0.025)_42%,transparent_72%)]"
                }`}
              >
                {activeShowcase ? (
                  <div className="absolute inset-0">
                    <div className="pointer-events-none absolute inset-x-[8%] bottom-[3%] h-[18%] rounded-[50%] bg-black/35 blur-xl" />
                    {activeShowcase.products.map((product) => (
                      <img
                        key={product.src}
                        src={product.src}
                        alt=""
                        className={`${product.className} origin-bottom drop-shadow-[0_18px_14px_rgba(0,0,0,0.58)] ${
                          enlargeShowcaseProducts
                            ? "scale-[1.5] sm:scale-[1.7]"
                            : "scale-100"
                        }`}
                      />
                    ))}
                  </div>
                ) : categoryImage ? (
                  <img
                    key={activeCategory.id}
                    src={categoryImage}
                    alt={`${activeCategory.name} by Tulda`}
                    className={`absolute inset-0 h-full w-full object-contain p-4 transition duration-500 ease-out sm:p-8 ${categoryImageScaleClass}`}
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
