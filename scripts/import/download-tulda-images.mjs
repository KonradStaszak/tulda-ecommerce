import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { buildImagePlan, loadTuldaManifests } from './tulda-common.mjs'

const { catalogue, imageManifest } = await loadTuldaManifests()
const plan = buildImagePlan(catalogue, imageManifest)

if (plan.invalidImageUrls.length > 0) {
  throw new Error(`Refusing to download non-Tulda image URLs: ${plan.invalidImageUrls.join(', ')}`)
}

async function download(sourceImageUrl, target) {
  try {
    await stat(target)
    return 'skipped'
  } catch {
    // The file does not exist yet.
  }

  const response = await fetch(sourceImageUrl)
  if (!response.ok) throw new Error(`Image download failed (${response.status}): ${sourceImageUrl}`)

  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, Buffer.from(await response.arrayBuffer()))
  return 'downloaded'
}

let downloaded = 0
let skipped = 0
for (const image of plan.uniqueFiles) {
  const target = image.localOriginalPath
  const result = await download(image.sourceImageUrl, target)
  if (result === 'downloaded') downloaded += 1
  else skipped += 1
}

const logoUrl = 'https://tulda.co/wp-content/uploads/2022/12/tulda2.png'
const logoTarget = 'src/assets/brand/tulda-logo.png'
const logoResult = await download(logoUrl, logoTarget)

console.log(JSON.stringify({
  uniqueProductImages: plan.uniqueFiles.length,
  downloaded,
  skipped,
  logo: logoResult,
}, null, 2))
