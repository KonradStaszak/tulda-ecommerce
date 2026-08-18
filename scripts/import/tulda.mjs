import { createClient } from '@supabase/supabase-js'
import { access } from 'node:fs/promises'
import path from 'node:path'
import { buildImportPlan, loadTuldaManifests, sanitizeLegacyHtml } from './tulda-common.mjs'

const dryRun = process.argv.includes('--dry-run')
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

console.log(JSON.stringify({ dryRun: false, imported: report }, null, 2))
