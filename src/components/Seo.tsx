import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://tulda.co'
const DEFAULT_TITLE = 'Tulda | Professional Automotive Refinishing Supplies UK'
const DEFAULT_DESCRIPTION = 'Professional automotive refinishing systems for bodyshops, paintshops and smart repair specialists. Tulda supports localised repairs, larger repairs and full resprays.'
const DEFAULT_IMAGE = 'https://tulda.co/assets/campaign/tulda-workshop-range-black-coupe-xct100.png'

function cleanDescription(value: string) {
  const plainText = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return plainText.length > 160 ? plainText.slice(0, 157).trimEnd() + '…' : plainText
}

interface SeoProps {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
  structuredData?: Record<string, unknown>
}

function updateMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export default function Seo({ title = DEFAULT_TITLE, description = DEFAULT_DESCRIPTION, image = DEFAULT_IMAGE, noIndex = false, structuredData }: SeoProps) {
  const { pathname } = useLocation()
  const cleanMetaDescription = cleanDescription(description)

  useEffect(() => {
    const canonicalUrl = new URL(pathname, SITE_URL).toString()
    document.title = title
    document.documentElement.lang = 'en-GB'
    updateMeta('meta[name="description"]', 'name', 'description', cleanMetaDescription)
    updateMeta('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, follow' : 'index, follow')
    updateMeta('meta[property="og:title"]', 'property', 'og:title', title)
    updateMeta('meta[property="og:description"]', 'property', 'og:description', cleanMetaDescription)
    updateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
    updateMeta('meta[property="og:image"]', 'property', 'og:image', image)
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', cleanMetaDescription)
    updateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    const schemaId = 'page-schema'
    const currentSchema = document.getElementById(schemaId)
    if (structuredData) {
      const schema = currentSchema ?? document.createElement('script')
      schema.id = schemaId
      schema.setAttribute('type', 'application/ld+json')
      schema.textContent = JSON.stringify(structuredData)
      if (!currentSchema) document.head.appendChild(schema)
    } else {
      currentSchema?.remove()
    }
  }, [cleanMetaDescription, image, noIndex, pathname, structuredData, title])

  return null
}
