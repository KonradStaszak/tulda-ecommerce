import { createClient } from '@supabase/supabase-js'
import { access } from 'node:fs/promises'
import path from 'node:path'
import { buildImportPlan, loadTuldaManifests, sanitizeLegacyHtml } from './tulda-common.mjs'

const dryRun = process.argv.includes('--dry-run')
const preflight = process.argv.includes('--preflight')
const validateRemote = process.argv.includes('--validate-remote')
const { catalogue, imageManifest } = await loadTuldaManifests()
const plan = buildImportPlan(catalogue, imageManifest)
const missingOptimizedAssets = (await Promise.all(plan.imagePlan.uniqueFiles.map(async (image) => {
  try {
    await access(path.join('public', image.localPublicPath.replace(/^\//, '')))
    return null
  } catch {
    return image.localPublicPath
  }
}))).filter(Boolean)

const report = {
  productsDetected: plan.products.length,
  categoriesDetected: plan.categories.length,
  variantsDetected: plan.sourceVariations.length,
  purchasableVariantRecordsPlanned: plan.variants.length,
  productCategoryRelationships: plan.productCategories.length,
  imageEntriesDetected: plan.images.length,
  uniqueImageFilesPlanned: plan.imagePlan.uniqueFiles.length,
  productsWithoutSku: plan.missingData.productsWithoutSku.length,
  variantsWithoutSku: plan.missingData.variantsWithoutSku.length,
  invalidImageUrls: plan.imagePlan.invalidImageUrls.length,
  duplicateImageTargets: plan.imagePlan.duplicateTargetCollisions.length,
  missingOptimizedAssets,
  missingData: plan.missingData,
  totalDiscrepancies: plan.totalDiscrepancies,
  databaseOperationsPlanned: plan.databaseOperations,
  sanitization: {
    categoryDescriptionsChanged: plan.categories.filter((category) => sanitizeLegacyHtml(category.descriptionHtml) !== (category.descriptionHtml || null)).length,
    productShortDescriptionsChanged: plan.products.filter((product) => sanitizeLegacyHtml(product.shortDescriptionHtml) !== (product.shortDescriptionHtml || null)).length,
    productDescriptionsChanged: plan.products.filter((product) => sanitizeLegacyHtml(product.descriptionHtml) !== (product.descriptionHtml || null)).length,
  },
}

if (dryRun) {
  console.log(JSON.stringify({ dryRun: true, ...report }, null, 2))
  process.exit(0)
}

if (plan.totalDiscrepancies.length > 0 || plan.imagePlan.invalidImageUrls.length > 0 || missingOptimizedAssets.length > 0) {
  throw new Error(`Import validation failed: ${JSON.stringify(report)}`)
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error('A real import requires SUPABASE_URL and SUPABASE_SECRET_KEY in the command environment.')
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function requireData(result) {
  if (result.error) throw result.error
  return result.data
}

function expect(condition, message) {
  if (!condition) throw new Error(`Remote catalogue validation failed: ${message}`)
}

async function getRemoteCounts() {
  const tables = ['categories', 'products', 'product_categories', 'product_variants', 'product_images']
  const counts = await Promise.all(tables.map(async (table) => {
    const result = await supabase.from(table).select('*', { count: 'exact', head: true })
    if (result.error) throw result.error
    return [table, result.count ?? 0]
  }))
  return Object.fromEntries(counts)
}

async function assertRequiredSchema() {
  for (const table of ['categories', 'products', 'product_variants']) {
    const result = await supabase.from(table).select('woocommerce_id').limit(1)
    if (result.error) {
      throw new Error(`Required remote schema field ${table}.woocommerce_id is unavailable: ${result.error.message}`)
    }
  }
}

function rowsByWooId(rows) {
  return new Map(rows.map((row) => [row.woocommerce_id, row]))
}

async function validateRemoteCatalogue() {
  const [counts, categoryRows, productRows, variantRows, productCategoryRows, imageRows] = await Promise.all([
    getRemoteCounts(),
    supabase.from('categories').select('id, woocommerce_id, parent_id'),
    supabase.from('products').select('id, woocommerce_id'),
    supabase.from('product_variants').select('id, woocommerce_id, product_id, sku, price_minor, currency, stock_quantity, is_in_stock'),
    supabase.from('product_categories').select('product_id, category_id'),
    supabase.from('product_images').select('product_id, variant_id, storage_path, alt_text, sort_order, is_primary'),
  ])

  const categories = requireData(categoryRows)
  const products = requireData(productRows)
  const variants = requireData(variantRows)
  const productCategories = requireData(productCategoryRows)
  const images = requireData(imageRows)
  const expectedCounts = {
    categories: plan.categories.length,
    products: plan.products.length,
    product_categories: plan.productCategories.length,
    product_variants: plan.variants.length,
    product_images: plan.images.length,
  }
  for (const [table, expected] of Object.entries(expectedCounts)) {
    expect(counts[table] === expected, `${table} count is ${counts[table]}, expected ${expected}`)
  }

  const categoriesByWooId = rowsByWooId(categories)
  const productsByWooId = rowsByWooId(products)
  const variantsByWooId = rowsByWooId(variants)
  const expectedCategoryIds = new Set(plan.categories.map((category) => category.sourceWooId))
  const expectedProductIds = new Set(plan.products.map((product) => product.sourceWooId))
  const expectedVariantIds = new Set(plan.variants.map((variant) => variant.sourceWooId))
  expect(categoriesByWooId.size === expectedCategoryIds.size && [...expectedCategoryIds].every((id) => categoriesByWooId.has(id)), 'categories do not match the source WooCommerce IDs')
  expect(productsByWooId.size === expectedProductIds.size && [...expectedProductIds].every((id) => productsByWooId.has(id)), 'products do not match the source WooCommerce IDs')
  expect(variantsByWooId.size === expectedVariantIds.size && [...expectedVariantIds].every((id) => variantsByWooId.has(id)), 'variants do not match the planned stable WooCommerce IDs')

  for (const category of plan.categories) {
    const actual = categoriesByWooId.get(category.sourceWooId)
    const expectedParentId = category.parentWooId === null ? null : categoriesByWooId.get(category.parentWooId)?.id
    expect(actual.parent_id === expectedParentId, `category ${category.sourceWooId} has an incorrect parent relationship`)
  }

  for (const variant of plan.variants) {
    const actual = variantsByWooId.get(variant.sourceWooId)
    const expectedProductId = productsByWooId.get(variant.parentWooId)?.id
    expect(actual.product_id === expectedProductId, `variant ${variant.sourceWooId} is linked to the wrong product`)
    expect(actual.sku === variant.sku, `variant ${variant.sourceWooId} has an unexpected SKU`)
    expect(Number(actual.price_minor) === Number(variant.prices.priceMinor) && actual.currency === 'GBP', `variant ${variant.sourceWooId} has an invalid GBP minor-unit price`)
    expect(actual.stock_quantity === null && actual.is_in_stock === variant.isInStock, `variant ${variant.sourceWooId} has inconsistent stock data`)
  }

  const expectedRelationships = new Set(plan.productCategories.map((relationship) => `${productsByWooId.get(relationship.productWooId)?.id}:${categoriesByWooId.get(relationship.categoryWooId)?.id}`))
  const actualRelationships = new Set(productCategories.map((relationship) => `${relationship.product_id}:${relationship.category_id}`))
  expect(actualRelationships.size === expectedRelationships.size && [...expectedRelationships].every((relationship) => actualRelationships.has(relationship)), 'product/category relationships do not match the import plan')

  const expectedImages = new Map(plan.images.map((image) => {
    const productId = productsByWooId.get(image.sourceProductWooId)?.id
    const variantId = image.sourceVariantWooId === null ? null : variantsByWooId.get(image.sourceVariantWooId)?.id
    return [`${productId}:${variantId ?? 'null'}:${image.localPublicPath}`, image]
  }))
  expect(images.every((image) => image.storage_path.startsWith('/assets/products/') && !image.storage_path.includes('tulda.co')), 'an image storage path is not a local optimized asset')
  expect(images.every((image) => expectedImages.has(`${image.product_id}:${image.variant_id ?? 'null'}:${image.storage_path}`)), 'product images do not match the import plan')
  const productsWithImages = new Set(images.map((image) => image.product_id))
  expect(products.every((product) => productsWithImages.has(product.id)), 'a product has no image association')

  const realVariationIds = new Set(plan.sourceVariations.map((variation) => variation.sourceWooId))
  const syntheticVariationIds = new Set(plan.variants.filter((variant) => variant.sourceKind === 'simple_product').map((variant) => variant.sourceWooId))
  expect([...realVariationIds].every((id) => variantsByWooId.has(id)) && realVariationIds.size === 48, 'not all 48 real WooCommerce variations were imported')
  expect([...syntheticVariationIds].every((id) => variantsByWooId.has(id)) && syntheticVariationIds.size === 5, 'the five simple-product purchase variants are not uniquely present')

  return { counts, realWooCommerceVariations: realVariationIds.size, simpleProductPurchaseVariants: syntheticVariationIds.size }
}

await assertRequiredSchema()
const preImportCounts = await getRemoteCounts()

if (preflight) {
  const populatedTables = Object.entries(preImportCounts).filter(([, count]) => count > 0)
  if (populatedTables.length > 0) {
    throw new Error(`Refusing first import: catalogue tables already contain data: ${JSON.stringify(Object.fromEntries(populatedTables))}`)
  }
  console.log(JSON.stringify({ preflight: true, ...report, preImportCounts }, null, 2))
  process.exit(0)
}

if (validateRemote) {
  console.log(JSON.stringify({ validateRemote: true, ...report, validation: await validateRemoteCatalogue() }, null, 2))
  process.exit(0)
}

if (Object.values(preImportCounts).some((count) => count > 0)) {
  await validateRemoteCatalogue()
}

const categoryRows = plan.categories.map((category) => ({
  woocommerce_id: category.sourceWooId,
  slug: category.slug,
  name: category.name,
  description: sanitizeLegacyHtml(category.descriptionHtml),
  is_active: true,
}))
const categoryRecords = requireData(await supabase
  .from('categories')
  .upsert(categoryRows, { onConflict: 'woocommerce_id' })
  .select('id, woocommerce_id'))
const categoryIds = new Map(categoryRecords.map((category) => [category.woocommerce_id, category.id]))

await Promise.all(plan.categories
  .filter((category) => category.parentWooId !== null)
  .map(async (category) => requireData(await supabase
    .from('categories')
    .update({ parent_id: categoryIds.get(category.parentWooId) })
    .eq('woocommerce_id', category.sourceWooId))))

const productRows = plan.products.map((product) => ({
  woocommerce_id: product.sourceWooId,
  slug: product.slug,
  name: product.name,
  short_description: sanitizeLegacyHtml(product.shortDescriptionHtml),
  description: sanitizeLegacyHtml(product.descriptionHtml),
  brand: 'Tulda',
  is_active: true,
}))
const productRecords = requireData(await supabase
  .from('products')
  .upsert(productRows, { onConflict: 'woocommerce_id' })
  .select('id, woocommerce_id'))
const productIds = new Map(productRecords.map((product) => [product.woocommerce_id, product.id]))

const productCategoryRows = plan.productCategories.map((relationship) => ({
  product_id: productIds.get(relationship.productWooId),
  category_id: categoryIds.get(relationship.categoryWooId),
}))
requireData(await supabase
  .from('product_categories')
  .upsert(productCategoryRows, { onConflict: 'product_id,category_id' }))

const variantRows = plan.variants.map((variant) => ({
  woocommerce_id: variant.sourceWooId,
  product_id: productIds.get(variant.parentWooId),
  sku: variant.sku,
  label: variant.label,
  price_minor: variant.prices.priceMinor,
  currency: variant.prices.currencyCode,
  stock_quantity: null,
  is_in_stock: variant.isInStock,
  is_active: true,
  sort_order: variant.sortOrder,
}))
const variantRecords = requireData(await supabase
  .from('product_variants')
  .upsert(variantRows, { onConflict: 'woocommerce_id' })
  .select('id, woocommerce_id'))
const variantIds = new Map(variantRecords.map((variant) => [variant.woocommerce_id, variant.id]))

for (const image of plan.images) {
  const query = supabase
    .from('product_images')
    .select('id')
    .eq('product_id', productIds.get(image.sourceProductWooId))
    .eq('storage_path', image.localPublicPath)
  const existing = image.sourceVariantWooId === null
    ? requireData(await query.is('variant_id', null).limit(1))
    : requireData(await query.eq('variant_id', variantIds.get(image.sourceVariantWooId)).limit(1))
  const row = {
    product_id: productIds.get(image.sourceProductWooId),
    variant_id: image.sourceVariantWooId === null ? null : variantIds.get(image.sourceVariantWooId),
    storage_path: image.localPublicPath,
    alt_text: image.altText,
    sort_order: image.imageOrder,
    is_primary: image.isPrimary,
  }
  if (existing.length > 0) {
    requireData(await supabase.from('product_images').update(row).eq('id', existing[0].id))
  } else {
    requireData(await supabase.from('product_images').insert(row))
  }
}

const postImportValidation = await validateRemoteCatalogue()
console.log(JSON.stringify({ dryRun: false, imported: report, preImportCounts, postImportValidation }, null, 2))
