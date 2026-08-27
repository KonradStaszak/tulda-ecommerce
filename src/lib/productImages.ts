import type { CatalogueImage, CatalogueProduct } from '../types/catalog'

interface LocalProductImageSource {
  path: string
  isPrimary?: boolean
}

const localProductImages: Record<string, LocalProductImageSource[]> = {
  'bt01-bodyfiller': [
    { path: '/assets/products/bt01-bodyfiller/cutout-bt01-bodyfiller.png', isPrimary: true },
  ],
  'tulda-6-150mm-15h-sanding-film-discs-all-grits': [
    { path: '/assets/products/tulda-6-150mm-15h-sanding-film-discs-all-grits/product-cutout-p800.png', isPrimary: true },
  ],
  'tulda-6-150mm-15h-sanding-paper-disc-all-grits-box-of-100': [
    { path: '/assets/products/tulda-6-150mm-15h-sanding-paper-disc-all-grits-box-of-100/product-cutout-p800.png', isPrimary: true },
  ],
  'tulda-paper-strips-70-198': [
    { path: '/assets/products/tulda-paper-strips-70-198/product-cutout-p120.png', isPrimary: true },
  ],
  'tulda-paper-strips-70x420-14h-all-grits-box-of-50': [
    { path: '/assets/products/tulda-paper-strips-70x420-14h-all-grits-box-of-50/product-cutout-p120.png', isPrimary: true },
  ],
  'xct100-clearcoat-21-vhs-extra-speed-clear': [
    { path: '/assets/products/xct100-clearcoat-21-vhs-extra-speed-clear/cutout-xct100-1-5-kit.png', isPrimary: true },
    { path: '/assets/products/xct100-clearcoat-21-vhs-extra-speed-clear/cutout-xct100-1.png' },
    { path: '/assets/products/xct100-clearcoat-21-vhs-extra-speed-clear/cutout-xct100-5.png' },
    { path: '/assets/products/xct100-clearcoat-21-vhs-extra-speed-clear/cutout-xct100-7-5-kit.png' },
    { path: '/assets/products/xct100-clearcoat-21-vhs-extra-speed-clear/cutout-xht100-0-5.png' },
    { path: '/assets/products/xct100-clearcoat-21-vhs-extra-speed-clear/cutout-xht100-2-5.png' },
  ],
  'ct50-21-uni-ecoclear-2k-clear-coat-1-5l-7-5l-kit': [
    { path: '/assets/products/ct50-21-uni-ecoclear-2k-clear-coat-1-5l-7-5l-kit/cutout-ct50-1-5-kit.png', isPrimary: true },
    { path: '/assets/products/ct50-21-uni-ecoclear-2k-clear-coat-1-5l-7-5l-kit/cutout-ct50-1.png' },
    { path: '/assets/products/ct50-21-uni-ecoclear-2k-clear-coat-1-5l-7-5l-kit/cutout-ct50-5.png' },
    { path: '/assets/products/ct50-21-uni-ecoclear-2k-clear-coat-1-5l-7-5l-kit/cutout-ct50-7-5-kit.png' },
    { path: '/assets/products/ct50-21-uni-ecoclear-2k-clear-coat-1-5l-7-5l-kit/cutout-ht51-0-5.png' },
    { path: '/assets/products/ct50-21-uni-ecoclear-2k-clear-coat-1-5l-7-5l-kit/cutout-ht51-2-5.png' },
  ],
  'tulda-ct60-multi-clear-21-hs-speedline-acrylic-lacquer-kit-7-5l': [
    { path: '/assets/products/tulda-ct60-multi-clear-21-hs-speedline-acrylic-lacquer-kit-7-5l/cutout-ct60-1-5-kit.png', isPrimary: true },
    { path: '/assets/products/tulda-ct60-multi-clear-21-hs-speedline-acrylic-lacquer-kit-7-5l/cutout-ct60-1.png' },
    { path: '/assets/products/tulda-ct60-multi-clear-21-hs-speedline-acrylic-lacquer-kit-7-5l/cutout-ct60-5.png' },
    { path: '/assets/products/tulda-ct60-multi-clear-21-hs-speedline-acrylic-lacquer-kit-7-5l/cutout-ct60-7-5-kit.png' },
    { path: '/assets/products/tulda-ct60-multi-clear-21-hs-speedline-acrylic-lacquer-kit-7-5l/cutout-ht60-0-5.png' },
    { path: '/assets/products/tulda-ct60-multi-clear-21-hs-speedline-acrylic-lacquer-kit-7-5l/cutout-ht60-2-5.png' },
  ],
  'tulda-st10': [
    { path: '/assets/products/tulda-st10/cutout-st10-5.png', isPrimary: true },
    { path: '/assets/products/tulda-st10/cutout-st10-1.png' },
  ],
  'tulda-pt30-multiprimer': [
    { path: '/assets/products/tulda-pt30-multiprimer/cutout-pt30-kit.png', isPrimary: true },
    { path: '/assets/products/tulda-pt30-multiprimer/cutout-pt30-1.png' },
    { path: '/assets/products/tulda-pt30-multiprimer/cutout-pt30-4.png' },
    { path: '/assets/products/tulda-pt30-multiprimer/cutout-ht31-0-5.png' },
    { path: '/assets/products/tulda-pt30-multiprimer/cutout-ht31-1.png' },
  ],
  'upvc-1k-binder-731-topcoat-4-25l': [
    { path: '/assets/products/upvc-1k-binder-731-topcoat-4-25l/cutout-1k-binder-731.png', isPrimary: true },
  ],
  'upvc-2k-binder-561-topcoat-4l': [
    { path: '/assets/products/upvc-2k-binder-561-topcoat-4l/cutout-upvc-2k-binder-561.png', isPrimary: true },
    { path: '/assets/products/upvc-2k-binder-561-topcoat-4l/cutout-h63-hardener-1.png' },
  ],
  'tulda-ct90-vhs-speedline-acrylic-clearcoat-1l': [
    { path: '/assets/products/tulda-ct90-vhs-speedline-acrylic-clearcoat-1l/cutout-ct90-1-5-kit.png', isPrimary: true },
    { path: '/assets/products/tulda-ct90-vhs-speedline-acrylic-clearcoat-1l/cutout-ct90-1.png' },
    { path: '/assets/products/tulda-ct90-vhs-speedline-acrylic-clearcoat-1l/cutout-ct90-5.png' },
    { path: '/assets/products/tulda-ct90-vhs-speedline-acrylic-clearcoat-1l/cutout-ct90-7-5-kit.png' },
    { path: '/assets/products/tulda-ct90-vhs-speedline-acrylic-clearcoat-1l/cutout-ht90-0-5.png' },
    { path: '/assets/products/tulda-ct90-vhs-speedline-acrylic-clearcoat-1l/cutout-ht90-2-5.png' },
  ],
  'tulda-st11-acrylic-thinner-slow-1l': [
    { path: '/assets/products/tulda-st11-acrylic-thinner-slow-1l/cutout-st11-1.png', isPrimary: true },
  ],
}

function getLocalImages(product: CatalogueProduct): CatalogueImage[] {
  return (localProductImages[product.slug] ?? []).map((image, index) => ({
    id: `local-cutout-${product.slug}-${index}`,
    path: image.path,
    altText: product.primaryImage?.altText ?? product.name,
    sortOrder: index - 10,
    isPrimary: image.isPrimary ?? false,
  }))
}

export function getProductCardImage(product: CatalogueProduct) {
  return getLocalImages(product).find((image) => image.isPrimary) ?? product.primaryImage
}

export function getProductGalleryImages(product: CatalogueProduct) {
  const localImages = getLocalImages(product)
  const localPrimaryImage = localImages.find((image) => image.isPrimary)
  if (localImages.length === 0) return uniqueImages(product.galleryImages)

  // Approved cutouts are a curated replacement for legacy WooCommerce packshots.
  // Keeping both sets on the PDP creates visually duplicate product views.
  if (localPrimaryImage) return uniqueImages(localImages)

  return uniqueImages([...product.galleryImages, ...localImages])
}

function uniqueImages(images: CatalogueImage[]) {
  const paths = new Set<string>()
  return images.filter((image) => {
    if (paths.has(image.path)) return false
    paths.add(image.path)
    return true
  })
}

export function getProductImageFitScale(image: CatalogueImage | null) {
  if (!image) return 1

  if (image.path.includes('/cutout-xct100-') || image.path.includes('/cutout-xht100-')) return 1.55
  if (image.path.includes('/cutout-bt01-') || image.path.includes('/cutout-ct50-') || image.path.includes('/cutout-ht51-') || image.path.includes('/cutout-ct60-') || image.path.includes('/cutout-ht60-') || image.path.includes('/cutout-ct90-') || image.path.includes('/cutout-ht90-') || image.path.includes('/cutout-st10-') || image.path.includes('/cutout-st11-') || image.path.includes('/cutout-pt30-') || image.path.includes('/cutout-ht31-')) return 1.45
  if (image.path.includes('/cutout-1k-binder-') || image.path.includes('/cutout-upvc-') || image.path.includes('/cutout-h63-')) return 1.12

  return 1
}
