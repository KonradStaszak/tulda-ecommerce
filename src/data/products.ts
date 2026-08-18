import type { Category, FilterState, Product, ProductVariant } from '../types/catalog'

export const categories: Category[] = [
  {
    id: 'clearcoat',
    name: 'Clearcoats',
    slug: 'clearcoats',
    description: 'High-solid acrylic lacquers for a flawless, durable finish',
    count: 3,
    image: 'https://images.unsplash.com/photo-1637160969200-d2da3f102d3b?w=600&h=400&fit=crop&auto=format',
    color: '#1c3a5e',
  },
  {
    id: 'primer',
    name: 'Primers',
    slug: 'primers',
    description: 'HS acrylic primers for maximum adhesion and corrosion resistance',
    count: 3,
    image: 'https://images.unsplash.com/photo-1786489785813-8057d678d91e?w=600&h=400&fit=crop&auto=format',
    color: '#2d4a22',
  },
  {
    id: 'abrasives',
    name: 'Abrasives',
    slug: 'abrasives',
    description: 'Precision sanding discs and strips for every bodyshop application',
    count: 5,
    image: 'https://images.unsplash.com/photo-1652987086612-d948b775d358?w=600&h=400&fit=crop&auto=format',
    color: '#3d2020',
  },
  {
    id: 'filler',
    name: 'Fillers',
    slug: 'fillers',
    description: '2K multifiller with excellent filling properties and easy sanding',
    count: 2,
    image: 'https://images.unsplash.com/photo-1676035291793-645c307e5a4e?w=600&h=400&fit=crop&auto=format',
    color: '#3d2a18',
  },
  {
    id: 'thinner',
    name: 'Thinners',
    slug: 'thinners',
    description: 'Universal and acrylic thinners for optimal viscosity and flow',
    count: 2,
    image: 'https://images.unsplash.com/photo-1512080482556-ea648017576c?w=600&h=400&fit=crop&auto=format',
    color: '#1a2d3d',
  },
  {
    id: 'kits',
    name: 'Kits',
    slug: 'kits',
    description: 'Ready-to-spray kits with everything you need for the job',
    count: 3,
    image: 'https://images.unsplash.com/photo-1643808971709-155fdde38397?w=600&h=400&fit=crop&auto=format',
    color: '#1c1c1e',
  },
]

export const products: Product[] = [
  {
    id: 'ct90',
    code: 'CT90',
    name: 'CT90 VHS Speedline Acrylic Clearcoat',
    shortName: 'CT90 VHS Clearcoat',
    category: 'clearcoat',
    categoryLabel: 'Clearcoat',
    priceFrom: 35.34,
    priceTo: 173.83,
    currency: '£',
    description: 'Very high-solid two-component acrylic clearcoat for premium gloss finishes with exceptional durability and UV resistance.',
    keySpec: 'VHS 2K · Rapid cure · UV resistant',
    badge: 'Best Seller',
    inStock: true,
    accentColor: '#1c3a5e',
    bottleColor: '#1c3a5e',
    sizes: [
      { label: '1.5L Kit', price: 35.34 },
      { label: '7.5L Kit', price: 173.83 },
    ],
    addedAt: '2024-09-01',
  },
  {
    id: 'ct60',
    code: 'CT60',
    name: 'CT60 Multi-Clear 2:1 HS Speedline Acrylic Lacquer',
    shortName: 'CT60 Multi-Clear',
    category: 'clearcoat',
    categoryLabel: 'Clearcoat',
    priceFrom: 27.41,
    priceTo: 133.61,
    currency: '£',
    description: 'UV resistant, high gloss, scratch resistant acrylic lacquer. Versatile application across all substrates.',
    keySpec: 'HS 2:1 · UV resistant · High gloss',
    badge: 'Popular',
    inStock: true,
    accentColor: '#1a3258',
    bottleColor: '#1a3258',
    sizes: [
      { label: '1.5L Kit', price: 27.41 },
      { label: '7.5L Kit', price: 133.61 },
    ],
    addedAt: '2024-07-15',
  },
  {
    id: 'ct50',
    code: 'CT50',
    name: 'CT50 2+1 UNI ECOCLEAR 2K Clear Coat',
    shortName: 'CT50 ECOCLEAR',
    category: 'clearcoat',
    categoryLabel: 'Clearcoat',
    priceFrom: 23.04,
    priceTo: 92.33,
    currency: '£',
    description: 'Rapid curing time and easy application. Ideal for high-volume shops seeking an efficient entry-level clearcoat.',
    keySpec: '2+1 mix ratio · Rapid cure · Easy apply',
    inStock: true,
    accentColor: '#2c4870',
    bottleColor: '#2c4870',
    sizes: [
      { label: '1.5L Kit', price: 23.04 },
      { label: '7.5L Kit', price: 92.33 },
    ],
    addedAt: '2024-06-01',
  },
  {
    id: 'pt30',
    code: 'PT30',
    name: 'PT30 Multiprimer 4+1 HS Acrylic',
    shortName: 'PT30 Multiprimer',
    category: 'primer',
    categoryLabel: 'Primer',
    priceFrom: 19.20,
    priceTo: 57.85,
    currency: '£',
    description: 'High-solid acrylic primer with acrylic resin base. Excellent adhesion on bare metal, aluminium and plastics.',
    keySpec: 'HS 4:1 mix · Bare metal · Aluminium',
    badge: 'Versatile',
    inStock: true,
    accentColor: '#2d4a22',
    bottleColor: '#2d4a22',
    sizes: [
      { label: '1L Kit', price: 19.20 },
      { label: '3.5L Kit', price: 57.85 },
    ],
    addedAt: '2024-06-01',
  },
  {
    id: 'xpt20',
    code: 'XPT20',
    name: 'XPT20 HS Rapid Primer 5L Kit 2K Fast Air Dry',
    shortName: 'XPT20 Rapid Primer',
    category: 'primer',
    categoryLabel: 'Primer',
    priceFrom: 101.34,
    currency: '£',
    description: 'Multi-purpose two-pack fast drying primer for rapid turnaround without compromising on protection.',
    keySpec: 'Fast air dry · 2K · Multi-purpose',
    isNew: true,
    inStock: false,
    accentColor: '#3d5a2a',
    bottleColor: '#3d5a2a',
    sizes: [
      { label: '5L Kit', price: 101.34 },
    ],
    addedAt: '2025-01-10',
  },
  {
    id: 'pt10',
    code: 'PT10',
    name: 'PT10 Etch Primer 1K Acid Wash',
    shortName: 'PT10 Etch Primer',
    category: 'primer',
    categoryLabel: 'Primer',
    priceFrom: 14.50,
    priceTo: 42.00,
    currency: '£',
    description: '1K acid etch primer providing excellent adhesion to bare metal. Forms a corrosion-resistant foundation layer.',
    keySpec: '1K · Acid etch · Anti-corrosion',
    inStock: true,
    accentColor: '#4a5e2a',
    bottleColor: '#4a5e2a',
    sizes: [
      { label: '1L', price: 14.50 },
      { label: '5L', price: 42.00 },
    ],
    addedAt: '2024-10-01',
  },
  {
    id: 'bt01',
    code: 'BT01',
    name: 'BT01 Bodyfiller 2K Multifiller',
    shortName: 'BT01 Bodyfiller',
    category: 'filler',
    categoryLabel: 'Filler',
    priceFrom: 33.61,
    currency: '£',
    description: '2K multifiller with excellent filling properties, easy sanding, and smooth finish. For aluminium, steel, galvanised steel and polyester.',
    keySpec: '2K filler · Easy sanding · Multi-substrate',
    inStock: true,
    accentColor: '#4a3020',
    bottleColor: '#4a3020',
    sizes: [
      { label: '3kg', price: 33.61 },
    ],
    addedAt: '2024-06-01',
  },
  {
    id: 'bt05',
    code: 'BT05',
    name: 'BT05 Fine Finishing Putty',
    shortName: 'BT05 Finishing Putty',
    category: 'filler',
    categoryLabel: 'Filler',
    priceFrom: 18.90,
    currency: '£',
    description: 'Ultra-fine finishing putty for final levelling before primer application. Excellent feathering properties and smooth sanding.',
    keySpec: 'Ultra-fine · Featheredge · Pre-primer',
    isNew: true,
    inStock: true,
    accentColor: '#5a3820',
    bottleColor: '#5a3820',
    sizes: [
      { label: '1kg', price: 18.90 },
    ],
    addedAt: '2025-02-01',
  },
  {
    id: 'st10',
    code: 'ST10',
    name: 'ST10 2K Universal Thinner',
    shortName: 'ST10 Universal Thinner',
    category: 'thinner',
    categoryLabel: 'Thinner',
    priceFrom: 7.24,
    priceTo: 34.09,
    currency: '£',
    description: 'Universal 2K thinner for optimal viscosity adjustment across all Tulda two-component products.',
    keySpec: '2K universal · All Tulda products',
    inStock: true,
    accentColor: '#1a2d3d',
    bottleColor: '#1a2d3d',
    sizes: [
      { label: '1L', price: 7.24 },
      { label: '5L', price: 34.09 },
    ],
    addedAt: '2024-06-01',
  },
  {
    id: 'st11',
    code: 'ST11',
    name: 'ST11 Acrylic Thinner Slow',
    shortName: 'ST11 Slow Thinner',
    category: 'thinner',
    categoryLabel: 'Thinner',
    priceFrom: 7.46,
    currency: '£',
    description: 'Slow acrylic thinner designed for hot conditions and large panel work where extended open time is required.',
    keySpec: 'Slow dry · Acrylic · Hot climate',
    inStock: false,
    accentColor: '#243545',
    bottleColor: '#243545',
    sizes: [
      { label: '1L', price: 7.46 },
    ],
    addedAt: '2024-08-01',
  },
  {
    id: 'disc-film',
    code: 'ABR-150F',
    name: 'Sanding Film Discs 150mm 15H — Box of 50',
    shortName: 'Film Discs 150mm',
    category: 'abrasives',
    categoryLabel: 'Abrasives',
    priceFrom: 24.34,
    currency: '£',
    description: 'Premium film discs in all grits. Long-cut performance and dust extraction for consistent surface prep.',
    keySpec: '150mm · 15H · Long-cut film',
    inStock: true,
    accentColor: '#3d2a10',
    bottleColor: '#3d2a10',
    sizes: [
      { label: 'P80 · Box/50', price: 24.34 },
      { label: 'P120 · Box/50', price: 24.34 },
      { label: 'P180 · Box/50', price: 24.34 },
      { label: 'P240 · Box/50', price: 24.34 },
    ],
    addedAt: '2024-06-01',
  },
  {
    id: 'disc-paper',
    code: 'ABR-150P',
    name: 'Sanding Paper Discs 150mm 15H — Box of 100',
    shortName: 'Paper Discs 150mm',
    category: 'abrasives',
    categoryLabel: 'Abrasives',
    priceFrom: 25.30,
    currency: '£',
    description: 'High-count paper disc box for heavy-volume sanding applications. All grits available.',
    keySpec: '150mm · 15H · Box of 100',
    inStock: true,
    accentColor: '#4a3515',
    bottleColor: '#4a3515',
    sizes: [
      { label: 'P80 · Box/100', price: 25.30 },
      { label: 'P120 · Box/100', price: 25.30 },
      { label: 'P180 · Box/100', price: 25.30 },
      { label: 'P320 · Box/100', price: 25.30 },
    ],
    addedAt: '2024-06-01',
  },
  {
    id: 'strip-70x198',
    code: 'ABR-S8',
    name: 'Paper Strips 70×198mm 8H — Box of 50',
    shortName: 'Strips 70×198mm',
    category: 'abrasives',
    categoryLabel: 'Abrasives',
    priceFrom: 13.76,
    currency: '£',
    description: 'Precision sanding strips for detailing, tight areas and block sanding. 8-hole dust extraction.',
    keySpec: '70×198mm · 8H · Detail sanding',
    inStock: true,
    accentColor: '#52391a',
    bottleColor: '#52391a',
    sizes: [
      { label: 'P80 · Box/50', price: 13.76 },
      { label: 'P120 · Box/50', price: 13.76 },
      { label: 'P180 · Box/50', price: 13.76 },
    ],
    addedAt: '2024-06-01',
  },
  {
    id: 'strip-70x420',
    code: 'ABR-S14',
    name: 'Paper Strips 70×420mm 14H — Box of 50',
    shortName: 'Strips 70×420mm',
    category: 'abrasives',
    categoryLabel: 'Abrasives',
    priceFrom: 28.63,
    currency: '£',
    description: 'Long-format sanding strips for large panel work and long-board applications.',
    keySpec: '70×420mm · 14H · Long panel',
    inStock: true,
    accentColor: '#3d2a0d',
    bottleColor: '#3d2a0d',
    sizes: [
      { label: 'P80 · Box/50', price: 28.63 },
      { label: 'P120 · Box/50', price: 28.63 },
      { label: 'P240 · Box/50', price: 28.63 },
    ],
    addedAt: '2024-09-15',
  },
  {
    id: 'kit-clearcoat-starter',
    code: 'KIT-CC1',
    name: 'Clearcoat Starter Kit — CT50 + ST10',
    shortName: 'Clearcoat Starter Kit',
    category: 'kits',
    categoryLabel: 'Kit',
    priceFrom: 28.90,
    currency: '£',
    description: 'Everything needed to apply CT50 ECOCLEAR in one bundle. Includes CT50 1.5L Kit and ST10 1L thinner.',
    keySpec: 'CT50 + ST10 · Ready to spray',
    inStock: true,
    accentColor: '#1c3a5e',
    bottleColor: '#1c3a5e',
    sizes: [
      { label: 'Starter (1.5L + 1L)', price: 28.90 },
    ],
    addedAt: '2024-11-01',
  },
  {
    id: 'kit-primer-pack',
    code: 'KIT-PR1',
    name: 'Primer & Clear System — PT30 + CT60',
    shortName: 'Primer & Clear System',
    category: 'kits',
    categoryLabel: 'Kit',
    priceFrom: 44.90,
    priceTo: 189.00,
    currency: '£',
    description: 'Complete primer-to-clearcoat system. PT30 Multiprimer with CT60 Multi-Clear — proven combination for full resprays.',
    keySpec: 'PT30 + CT60 · Full system · All substrates',
    badge: 'Popular',
    inStock: true,
    accentColor: '#2a3d1a',
    bottleColor: '#2a3d1a',
    sizes: [
      { label: 'Single Panel Kit', price: 44.90 },
      { label: 'Full Car Kit', price: 189.00 },
    ],
    addedAt: '2024-12-01',
  },
  {
    id: 'kit-bodyshop-bundle',
    code: 'KIT-BS1',
    name: 'Bodyshop Bundle — Primer + Clear + Abrasives',
    shortName: 'Bodyshop Bundle',
    category: 'kits',
    categoryLabel: 'Kit',
    priceFrom: 89.00,
    currency: '£',
    description: 'All-in-one bundle for complete body repairs. Includes PT30, CT90, BT01 Bodyfiller and a box of Film Discs.',
    keySpec: 'PT30 + CT90 + BT01 + Discs',
    isNew: true,
    inStock: true,
    accentColor: '#1c1c1e',
    bottleColor: '#1c1c1e',
    sizes: [
      { label: 'Standard Bundle', price: 89.00 },
    ],
    addedAt: '2025-02-15',
  },
]

export const ALL_SIZES: ProductVariant['label'][] = [
  '1L', '1L Kit', '1.5L Kit', '3.5L Kit', '5L', '5L Kit', '7.5L Kit',
  '1kg', '3kg', 'Box/50', 'Box/100', 'Single Panel Kit', 'Full Car Kit',
  'Standard Bundle', 'Starter (1.5L + 1L)',
]

export function applyFilters(all: Product[], filters: FilterState): Product[] {
  let result = [...all]

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.keySpec.toLowerCase().includes(q)
    )
  }

  if (filters.categories.length > 0) {
    result = result.filter(p => filters.categories.includes(p.category))
  }

  if (filters.inStockOnly) {
    result = result.filter(p => p.inStock)
  }

  if (filters.sizes.length > 0) {
    result = result.filter(p =>
      p.sizes.some(s => filters.sizes.some(fs => s.label.includes(fs)))
    )
  }

  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.priceFrom - b.priceFrom)
      break
    case 'price-desc':
      result.sort((a, b) => b.priceFrom - a.priceFrom)
      break
    case 'newest':
      result.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
      break
  }

  return result
}
