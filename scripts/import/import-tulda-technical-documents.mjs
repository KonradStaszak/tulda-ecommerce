import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import documents from '../../import/tulda-technical-documents.json' with { type: 'json' }

const root = resolve(import.meta.dirname, '../..')
const dryRun = process.argv.includes('--dry-run')
const requiredEnvironment = ['SUPABASE_URL', 'SUPABASE_SECRET_KEY']
for (const name of requiredEnvironment) {
  if (!process.env[name]) throw new Error(`Missing ${name} in .env.local.`)
}

for (const document of documents) {
  if (!/^https:\/\/tulda\.co\/wp-content\/uploads\//.test(document.sourceUrl)) throw new Error(`Rejected non-Tulda source URL: ${document.sourceUrl}`)
  const file = resolve(root, 'public/assets/documents', document.slug, document.filename)
  await access(file)
  const header = await readFile(file, { encoding: null }).then((payload) => payload.subarray(0, 5).toString('ascii'))
  if (header !== '%PDF-') throw new Error(`Local document is not a PDF: ${file}`)
}

const paths = documents.map((document) => `/assets/documents/${document.slug}/${document.filename}`)
if (new Set(paths).size !== paths.length) throw new Error('Duplicate technical document storage paths.')

if (dryRun) {
  console.log(JSON.stringify({ dryRun: true, documents: documents.length, products: new Set(documents.map((document) => document.slug)).size, paths }, null, 2))
  process.exit(0)
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
const slugs = [...new Set(documents.map((document) => document.slug))]
const { data: products, error: productsError } = await supabase.from('products').select('id, slug').in('slug', slugs)
if (productsError) throw productsError
if (!products || products.length !== slugs.length) throw new Error('One or more document products could not be found in Supabase.')
const productIdBySlug = new Map(products.map((product) => [product.slug, product.id]))

const rows = documents.map((document) => ({
  product_id: productIdBySlug.get(document.slug),
  title: document.title,
  document_type: document.type,
  storage_path: `/assets/documents/${document.slug}/${document.filename}`,
  external_url: null,
  version: null,
  published_at: null,
}))
const { error } = await supabase.from('technical_documents').upsert(rows, { onConflict: 'product_id,storage_path' })
if (error) throw error
console.log(JSON.stringify({ imported: rows.length, products: slugs.length }))
