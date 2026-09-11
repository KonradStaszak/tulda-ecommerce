import sharp from "sharp"

const basePath = "public/assets/campaign/tulda-workshop-range-black-coupe.png"
const productPath =
  "public/assets/products/xct100-clearcoat-21-vhs-extra-speed-clear/cutout-xct100-1.png"
const outputPath =
  "public/assets/campaign/tulda-workshop-range-black-coupe-xct100.png"

const placement = { left: 594, top: 619, width: 153, height: 231 }

const productWithCap = await sharp(productPath)
  .extract({ left: 568, top: 748, width: 284, height: 441 })
  .resize(placement.width, placement.height, {
    fit: "fill",
    kernel: "lanczos3",
  })
  .png()
  .toBuffer()

const resizedProduct = await sharp(productWithCap)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

for (let y = 0; y < 9; y += 1) {
  for (let x = 44; x < 109; x += 1) {
    const alphaChannel = (y * placement.width + x) * 4 + 3
    resizedProduct.data[alphaChannel] = 0
  }
}

const product = await sharp(resizedProduct.data, {
  raw: resizedProduct.info,
})
  .png()
  .toBuffer()

const productMask = await sharp(product)
  .extractChannel("alpha")
  .png()
  .toBuffer()

const reflections = Buffer.from(`
  <svg width="${placement.width}" height="${placement.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="vertical-reflections" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="0.08" stop-color="#ffffff" stop-opacity="0.08"/>
        <stop offset="0.17" stop-color="#ffffff" stop-opacity="0.23"/>
        <stop offset="0.25" stop-color="#ffffff" stop-opacity="0.05"/>
        <stop offset="0.45" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="0.63" stop-color="#13bff3" stop-opacity="0"/>
        <stop offset="0.70" stop-color="#13bff3" stop-opacity="0.18"/>
        <stop offset="0.77" stop-color="#13bff3" stop-opacity="0.04"/>
        <stop offset="0.90" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="0.96" stop-color="#ffffff" stop-opacity="0.14"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="floor-bounce" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#13bff3" stop-opacity="0"/>
        <stop offset="0.72" stop-color="#13bff3" stop-opacity="0.02"/>
        <stop offset="1" stop-color="#13bff3" stop-opacity="0.20"/>
      </linearGradient>
    </defs>
    <rect width="153" height="231" fill="url(#vertical-reflections)"/>
    <rect width="153" height="231" fill="url(#floor-bounce)"/>
  </svg>
`)

const maskedReflections = await sharp(reflections)
  .composite([{ input: productMask, blend: "dest-in" }])
  .png()
  .toBuffer()

const litProduct = await sharp(product)
  .composite([{ input: maskedReflections, blend: "screen" }])
  .png()
  .toBuffer()

await sharp(basePath)
  .composite([
    {
      input: litProduct,
      left: placement.left,
      top: placement.top,
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(outputPath)

console.log(`Created ${outputPath}`)
