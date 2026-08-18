import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

export const EXPECTED_TOTALS = {
  products: 15,
  categories: 9,
  variations: 48,
  images: 127,
}

const TULDA_UPLOADS_PREFIX = 'https://tulda.co/wp-content/uploads/'

export async function loadTuldaManifests() {
  const [catalogueFile, imagesFile] = await Promise.all([
    readFile('import/tulda-catalogue.json', 'utf8'),
    readFile('import/tulda-images.json', 'utf8'),
  ])

  return {
    catalogue: JSON.parse(catalogueFile),
    imageManifest: JSON.parse(imagesFile),
  }
}

export function sanitizeLegacyHtml(html) {
  if (!html) return null

  const allowedTags = new Set([
    'p', 'br', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li',
    'strong', 'b', 'em', 'i', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ])

  let sanitized = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/\[(?:\/?)[a-z][^\]]*\]/gi, '')
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')

  sanitized = sanitized.replace(/<\/?[^>]+>/g, (tag) => {
    const match = tag.match(/^<\s*(\/)?\s*([a-z0-9]+)/i)
    if (!match) return ''

    const [, closing, rawName] = match
    const tagName = rawName.toLowerCase()
    if (!allowedTags.has(tagName)) return ''
    if (closing) return `</${tagName}>`
    if (tagName !== 'a') return `<${tagName}>`

    const hrefMatch = tag.match(/\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)
    const href = hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3]
    if (!href) return '<a>'

    try {
      const url = new URL(href, 'https://tulda.co')
      if (url.hostname !== 'tulda.co') return '<a>'
      url.protocol = 'https:'
      return `<a href="${url.href}">`
    } catch {
      return '<a>'
    }
  })

  return sanitized.replace(/\s+\n/g, '\n').trim() || null
}

function safePathPart(value) {
  return value
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function filenameFromUrl(url) {
  const basename = decodeURIComponent(new URL(url).pathname.split('/').at(-1) ?? '')
  return safePathPart(basename) || 'image'
}

export function buildImagePlan(catalogue, imageManifest) {
  const productSlugs = new Map(
    catalogue.products.map((product) => [product.sourceWooId, product.slug ?? `woo-${product.sourceWooId}`]),
  )
  const targetsByUrl = new Map()
  const occupiedTargets = new Map()
  const entries = []
  const invalidImageUrls = []
  const duplicateTargetCollisions = []

  for (const image of imageManifest.images) {
    if (!image.sourceImageUrl.startsWith(TULDA_UPLOADS_PREFIX)) {
      invalidImageUrls.push(image.sourceImageUrl)
      continue
    }

    let paths = targetsByUrl.get(image.sourceImageUrl)
    if (!paths) {
      const productSlug = safePathPart(productSlugs.get(image.sourceProductWooId) ?? `woo-${image.sourceProductWooId}`)
      const imageId = safePathPart(String(image.sourceImageWooId))
      const originalFilename = `${imageId}-${filenameFromUrl(image.sourceImageUrl)}`
      const originalExtension = path.posix.extname(originalFilename)
      const optimizedFilename = `${originalFilename.slice(0, Math.max(0, originalFilename.length - originalExtension.length))}.webp`
      let localPublicPath = `/assets/products/${productSlug}/${optimizedFilename}`
      let legacyPublicPath = `/assets/products/${productSlug}/${originalFilename}`

      const occupiedBy = occupiedTargets.get(localPublicPath)
      if (occupiedBy && occupiedBy !== image.sourceImageUrl) {
        const base = originalFilename.slice(0, Math.max(0, originalFilename.length - originalExtension.length))
        const suffix = createHash('sha256').update(image.sourceImageUrl).digest('hex').slice(0, 8)
        legacyPublicPath = `/assets/products/${productSlug}/${base}-${suffix}${originalExtension}`
        localPublicPath = `/assets/products/${productSlug}/${base}-${suffix}.webp`
        duplicateTargetCollisions.push({ target: localPublicPath, sourceUrls: [occupiedBy, image.sourceImageUrl] })
      }

      paths = {
        localOriginalPath: `local-assets/tulda-product-originals/${productSlug}/${legacyPublicPath.split('/').at(-1)}`,
        legacyPublicPath,
        localPublicPath,
      }
      targetsByUrl.set(image.sourceImageUrl, paths)
      occupiedTargets.set(localPublicPath, image.sourceImageUrl)
    }

    entries.push({ ...image, ...paths })
  }

  return {
    entries,
    uniqueFiles: [...targetsByUrl.entries()].map(([sourceImageUrl, paths]) => ({ sourceImageUrl, ...paths })),
    invalidImageUrls,
    duplicateTargetCollisions,
  }
}

export function buildImportPlan(catalogue, imageManifest) {
  const imagePlan = buildImagePlan(catalogue, imageManifest)
  const categoryIds = new Set(catalogue.categories.map((category) => category.sourceWooId))
  const productIds = new Set(catalogue.products.map((product) => product.sourceWooId))
  const sourceVariations = catalogue.products.flatMap((product) => product.variations)
  const variants = catalogue.products.flatMap((product) => {
    if (product.type === 'simple') {
      return [{
        sourceWooId: product.sourceWooId,
        parentWooId: product.sourceWooId,
        label: product.name,
        sku: product.sku,
        prices: product.prices,
        isInStock: product.isInStock,
        isOnBackorder: product.isOnBackorder,
        lowStockRemaining: product.lowStockRemaining,
        sortOrder: 0,
        sourceKind: 'simple_product',
      }]
    }

    return product.variations.map((variation, sortOrder) => ({
      ...variation,
      sortOrder,
      sourceKind: 'woocommerce_variation',
    }))
  })
  const productCategories = catalogue.products.flatMap((product) => product.categories.map((category) => ({
    productWooId: product.sourceWooId,
    categoryWooId: category.sourceWooId,
  })))

  const missingData = {
    productsWithoutSku: catalogue.products.filter((product) => !product.sku).map((product) => product.sourceWooId),
    variantsWithoutSku: variants.filter((variant) => !variant.sku).map((variant) => variant.sourceWooId),
    productsWithoutPrices: catalogue.products.filter((product) => product.prices?.priceMinor === null).map((product) => product.sourceWooId),
    productsWithoutImages: catalogue.products.filter((product) => !imagePlan.entries.some((image) => image.sourceProductWooId === product.sourceWooId)).map((product) => product.sourceWooId),
    unknownCategoryReferences: productCategories.filter(({ categoryWooId }) => !categoryIds.has(categoryWooId)),
    unmatchedVariationParents: variants.filter((variant) => !productIds.has(variant.parentWooId)).map((variant) => variant.sourceWooId),
  }

  const totalDiscrepancies = Object.entries(EXPECTED_TOTALS).flatMap(([key, expected]) => {
    const actual = key === 'products' ? catalogue.products.length
      : key === 'categories' ? catalogue.categories.length
      : key === 'variations' ? sourceVariations.length
          : imageManifest.images.length
    return actual === expected ? [] : [{ key, expected, actual }]
  })

  return {
    categories: catalogue.categories,
    products: catalogue.products,
    sourceVariations,
    variants,
    productCategories,
    images: imagePlan.entries,
    imagePlan,
    missingData,
    totalDiscrepancies,
    databaseOperations: {
      categoryUpserts: catalogue.categories.length,
      categoryParentUpdates: catalogue.categories.filter((category) => category.parentWooId !== null).length,
      productUpserts: catalogue.products.length,
      productCategoryUpserts: productCategories.length,
      variantUpserts: variants.length,
      imageReconciliations: imagePlan.entries.length,
    },
  }
}
