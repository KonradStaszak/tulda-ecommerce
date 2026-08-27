import { mkdir, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import documents from '../../import/tulda-technical-documents.json' with { type: 'json' }

const root = resolve(import.meta.dirname, '../..')
const dryRun = process.argv.includes('--dry-run')

for (const document of documents) {
  if (!/^https:\/\/tulda\.co\/wp-content\/uploads\//.test(document.sourceUrl)) {
    throw new Error(`Rejected non-Tulda document URL: ${document.sourceUrl}`)
  }
}

let downloaded = 0
let reused = 0
const responses = new Map()
if (!dryRun) {
  for (const document of documents) {
    const response = await fetch(document.sourceUrl)
    const payload = new Uint8Array(await response.arrayBuffer())
    if (!response.ok || payload.length < 5 || Buffer.from(payload.subarray(0, 5)).toString('ascii') !== '%PDF-') {
      throw new Error(`Invalid PDF response for ${document.sourceUrl} (status ${response.status})`)
    }
    responses.set(document.sourceUrl, payload)
  }
}

for (const document of documents) {
  const destination = resolve(root, 'public/assets/documents', document.slug, document.filename)
  const localPath = `/assets/documents/${document.slug}/${document.filename}`
  try {
    const existing = await stat(destination)
    if (existing.size > 4) {
      reused += 1
      console.log(`reuse ${localPath}`)
      continue
    }
  } catch {
    // Download below.
  }

  if (dryRun) {
    console.log(`download ${document.sourceUrl} -> ${localPath}`)
    continue
  }

  const payload = responses.get(document.sourceUrl)
  if (!payload) throw new Error(`Missing validated PDF response for ${document.sourceUrl}`)
  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, payload)
  downloaded += 1
  console.log(`downloaded ${localPath}`)
}

console.log(JSON.stringify({ documents: documents.length, downloaded, reused, dryRun }))
