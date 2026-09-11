import { useState } from "react"

import ProductCard from "./ProductCard"

import type {
  CatalogueCartLine,
  CatalogueCategory,
  CatalogueProduct,
} from "../types/catalog"

import { Link } from "react-router-dom"
import { getProductCardImage } from "../lib/productImages"
import { isSpeedLineProduct } from "../services/catalogue/repository"

interface PopularProductsProps {
  products: CatalogueProduct[]

  categories: CatalogueCategory[]

  loading: boolean

  error: Error | null

  onAddToCart: (item: CatalogueCartLine) => void

  wishlist: string[]

  onToggleWishlist: (id: string) => void
}

export default function PopularProducts({
  products,
  categories,
  loading,
  error,
  onAddToCart,
  wishlist,
  onToggleWishlist,
}: PopularProductsProps) {
  const [activeFilter, setActiveFilter] = useState("all")

  const mainCategories = categories.filter(
    (category) => category.parentId === null,
  )

  const filtered =
    activeFilter === "all"
      ? products
      : products.filter((product) =>
          product.categories.some((category) => category.id === activeFilter),
        )

  const featuredProducts = [...filtered]
    .sort(
      (left, right) =>
        Number(right.slug === "tulda-pt30-multiprimer") -
        Number(left.slug === "tulda-pt30-multiprimer"),
    )
    .slice(0, 4)
  const speedLineProducts = products.filter(
    (product) =>
      isSpeedLineProduct(product) &&
      product.slug !==
        "tulda-ct60-multi-clear-21-hs-speedline-acrylic-lacquer-kit-7-5l",
  )

  return (
    <section
      id="products"
      className="py-20 md:py-28"
      style={{ backgroundColor: "var(--muted)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {!loading && speedLineProducts.length > 0 && (
          <section
            className="mb-16 overflow-hidden border bg-[var(--surface-dark)]"
            style={{ borderColor: "var(--surface-dark)" }}
          >
            <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
              <div className="relative isolate min-h-[340px] overflow-hidden bg-[#0b0c0e] p-8 md:min-h-[450px] md:p-10">
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 560 560"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <g opacity="0.7">
                    <path d="M250 0h180l-90 132Z" fill="#25282c" />
                    <path d="M430 0h130v178L340 132Z" fill="#17191c" />
                    <path d="m340 132 220 46-136 106Z" fill="#30343a" />
                    <path d="m340 132 84 152-192-18Z" fill="#1d2024" />
                    <path d="m232 266 192 18-106 118Z" fill="#34383e" />
                    <path d="m424 284 136-106v254l-242-30Z" fill="#202329" />
                    <path d="m318 402 242 30v128H384Z" fill="#2a2d32" />
                    <path d="m232 266 86 136-174 82Z" fill="#17191c" />
                    <path d="m144 484 174-82 66 158H208Z" fill="#30343a" />
                    <path d="M0 372 144 484 0 560Z" fill="#202328" />
                    <path d="m0 198 232 68-88 218L0 372Z" fill="#141618" />
                    <path d="M0 0h250l-18 266L0 198Z" fill="#1b1e22" />
                  </g>
                  <path
                    d="M376 0 560 49v4L376 4ZM0 472l208 88h-10L0 478Z"
                    fill="#18aee5"
                    opacity="0.7"
                  />
                </svg>
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,10,0.98)_0%,rgba(8,9,10,0.9)_46%,rgba(8,9,10,0.18)_100%)]" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <h2
                      className="text-5xl font-black leading-[0.86] text-white md:text-6xl"
                      style={{ fontFamily: "Barlow Condensed, sans-serif" }}
                    >
                      BUILT FOR
                      <br />
                      SPEED.
                    </h2>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--surface-dark-muted)]">
                      High-performance clearcoats for efficient application,
                      fast turnaround and a dependable finish.
                    </p>
                  </div>
                  <Link
                    to="/products?collection=speed-line"
                    className="mt-8 inline-flex w-fit border-b border-[var(--primary)] pb-1 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:text-[var(--primary)]"
                  >
                    Explore Speed Line <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
              <div className="grid sm:grid-cols-2">
                {speedLineProducts.map((product) => (
                  <SpeedLineProduct key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2
              className="text-4xl md:text-5xl font-black leading-none"
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                color: "var(--foreground)",
              }}
            >
              POPULAR
              <br />
              <span style={{ color: "var(--primary)" }}>PRODUCTS</span>
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {[{ id: "all", name: "All" }, ...mainCategories].map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className="px-4 py-2 text-xs font-semibold rounded-sm border transition-all"
                style={{
                  borderColor:
                    activeFilter === category.id
                      ? "var(--primary)"
                      : "var(--border)",

                  backgroundColor:
                    activeFilter === category.id
                      ? "var(--primary)"
                      : "var(--background)",

                  color:
                    activeFilter === category.id
                      ? "var(--primary-foreground)"
                      : "var(--foreground)",

                  fontFamily: "Inter, sans-serif",

                  letterSpacing: "0.04em",
                }}
              >
                {category.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[370px] animate-pulse rounded-sm border"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--background)",
                }}
              />
            ))}
          {!loading &&
            featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={() => onToggleWishlist(product.id)}
              />
            ))}
        </div>
        {!loading && error && (
          <p
            className="mt-5 text-sm"
            style={{
              color: "var(--muted-foreground)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            The product range could not be loaded. Please try again shortly.
          </p>
        )}

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <Link
            to="/products"
            className="flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-sm border transition-colors hover:bg-[var(--foreground)] hover:text-[var(--background)]"
            style={{
              borderColor: "var(--foreground)",

              color: "var(--foreground)",

              fontFamily: "Inter, sans-serif",

              letterSpacing: "0.04em",
            }}
          >
            VIEW ALL PRODUCTS
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

function SpeedLineProduct({ product }: { product: CatalogueProduct }) {
  const image = getProductCardImage(product)
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex min-h-[340px] flex-col border-l border-white/10 bg-white/[0.04] p-5 transition-colors hover:bg-white/[0.08] md:p-6"
    >
      <div className="relative flex flex-1 items-center justify-center py-2">
        {image && (
          <img
            src={image.path}
            alt={image.altText ?? product.name}
            className="h-56 w-full object-contain transition-transform duration-300 group-hover:scale-105 lg:h-60"
          />
        )}
      </div>
      <h3 className="text-lg font-bold leading-tight text-white">
        {product.name}
      </h3>
      <span className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
        View product →
      </span>
    </Link>
  )
}
