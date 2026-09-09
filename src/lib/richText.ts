const allowedTags = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'a'])

export function sanitizeRichText(value: string) {
  if (typeof document === 'undefined') return value.replace(/<[^>]+>/g, '')

  const root = document.createElement('div')
  root.innerHTML = value
  root.querySelectorAll('script,style,iframe,object,embed').forEach((node) => node.remove())

  const clean = (element: Element) => {
    for (const child of [...element.children]) clean(child)
    if (!allowedTags.has(element.tagName.toLowerCase())) {
      element.replaceWith(document.createTextNode(element.textContent ?? ''))
      return
    }
    const href = element.getAttribute('href') ?? ''
    for (const attribute of [...element.attributes]) element.removeAttribute(attribute.name)
    if (element.tagName.toLowerCase() === 'a') {
      if (/^(https?:|mailto:|tel:)/i.test(href)) {
        element.setAttribute('href', href)
        element.setAttribute('target', '_blank')
        element.setAttribute('rel', 'noreferrer')
      } else {
        element.removeAttribute('href')
      }
    }
  }

  for (const child of [...root.children]) clean(child)
  return root.innerHTML.trim()
}

export function richTextToPlainText(value: string | null | undefined) {
  if (!value) return ''
  if (typeof document === 'undefined') return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

  const root = document.createElement('div')
  root.innerHTML = sanitizeRichText(value)
  root.querySelectorAll('br').forEach((node) => node.replaceWith('\n'))
  root.querySelectorAll('p,li').forEach((node) => node.append('\n'))
  return (root.textContent ?? '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ').trim()
}
