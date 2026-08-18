import { mkdir, rename, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { buildImagePlan, loadTuldaManifests } from './tulda-common.mjs'

const MAX_LONG_EDGE = 2000

function publicFilePath(localPublicPath) {
  return path.join('public', localPublicPath.replace(/^\//, ''))
}

async function pathExists(filePath) {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

const { catalogue, imageManifest } = await loadTuldaManifests()
const plan = buildImagePlan(catalogue, imageManifest)

if (plan.invalidImageUrls.length > 0 || plan.duplicateTargetCollisions.length > 0) {
  throw new Error(`Image plan validation failed: ${JSON.stringify({
    invalidImageUrls: plan.invalidImageUrls,
    duplicateTargetCollisions: plan.duplicateTargetCollisions,
  })}`)
}

let sourceTotalBytes = 0
let optimizedTotalBytes = 0
let largestOptimizedFile = null
const failures = []

for (const image of plan.uniqueFiles) {
  const originalTarget = image.localOriginalPath
  const legacyPublicSource = publicFilePath(image.legacyPublicPath)
  const optimizedTarget = publicFilePath(image.localPublicPath)

  try {
    if (!(await pathExists(originalTarget))) {
      if (!(await pathExists(legacyPublicSource))) {
        throw new Error(`Original image is missing from both ${originalTarget} and ${legacyPublicSource}`)
      }

      await mkdir(path.dirname(originalTarget), { recursive: true })
      await rename(legacyPublicSource, originalTarget)
    }

    const sourceInfo = await stat(originalTarget)
    sourceTotalBytes += sourceInfo.size

    await mkdir(path.dirname(optimizedTarget), { recursive: true })
    await sharp(originalTarget)
      .rotate()
      .resize({ width: MAX_LONG_EDGE, height: MAX_LONG_EDGE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90, alphaQuality: 100, smartSubsample: true })
      .toFile(optimizedTarget)

    const [optimizedInfo, metadata] = await Promise.all([stat(optimizedTarget), sharp(optimizedTarget).metadata()])
    if (!metadata.width || !metadata.height || metadata.format !== 'webp') {
      throw new Error(`Unreadable optimized WebP: ${optimizedTarget}`)
    }
    if (Math.max(metadata.width, metadata.height) > MAX_LONG_EDGE) {
      throw new Error(`Optimized image exceeds ${MAX_LONG_EDGE}px: ${optimizedTarget}`)
    }

    optimizedTotalBytes += optimizedInfo.size
    if (!largestOptimizedFile || optimizedInfo.size > largestOptimizedFile.bytes) {
      largestOptimizedFile = { path: image.localPublicPath, bytes: optimizedInfo.size, width: metadata.width, height: metadata.height }
    }
  } catch (error) {
    failures.push({ sourceImageUrl: image.sourceImageUrl, target: image.localPublicPath, error: error.message })
  }
}

const optimizedFilesReadable = failures.length === 0
const report = {
  sourceAssetCount: plan.uniqueFiles.length,
  optimizedAssetCount: plan.uniqueFiles.length - failures.length,
  sourceTotalBytes,
  optimizedTotalBytes,
  percentageReduction: sourceTotalBytes === 0 ? 0 : Number((((sourceTotalBytes - optimizedTotalBytes) / sourceTotalBytes) * 100).toFixed(2)),
  largestOptimizedFile,
  maxLongEdge: MAX_LONG_EDGE,
  optimizedFilesReadable,
  failedConversions: failures,
}

console.log(JSON.stringify(report, null, 2))

if (failures.length > 0) process.exitCode = 1
