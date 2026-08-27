import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTechnicalDocuments, type CatalogueTechnicalDocument } from '../services/catalogue/repository'

interface TechnicalResourcesProps {
  limit?: number
}

const labels: Record<string, string> = { tds: 'TDS', sds: 'SDS', guide: 'Guide', other: 'Document' }

export default function TechnicalResources({ limit }: TechnicalResourcesProps) {
  const [documents, setDocuments] = useState<CatalogueTechnicalDocument[]>([])
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    getTechnicalDocuments().then(setDocuments).catch((reason: unknown) => setError(reason instanceof Error ? reason : new Error('Unable to load documents.'))).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => documents.filter((document) => {
    const matchesType = type === 'all' || document.documentType === type
    const text = [document.title, document.productName].join(' ').toLowerCase()
    return matchesType && text.includes(query.trim().toLowerCase())
  }), [documents, query, type])
  const displayed = limit ? filtered.slice(0, limit) : filtered

  return <section id="technical" className="py-16 md:py-20" style={{ backgroundColor: 'var(--muted)' }}>
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-9">
        <div><h1 className="text-4xl md:text-5xl font-black leading-none" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>TECHNICAL<br /><span style={{ color: 'var(--primary)' }}>DOCUMENTS</span></h1></div>
        <p className="text-sm max-w-sm" style={{ color: 'var(--muted-foreground)' }}>Genuine data sheets and safety information from the Tulda product range.</p>
      </div>
      {!limit && <div className="mb-7 flex flex-col sm:flex-row gap-3"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products or documents" className="tulda-field min-w-0 flex-1 px-3 text-sm" /><select value={type} onChange={(event) => setType(event.target.value)} className="tulda-field px-3 text-sm"><option value="all">All document types</option><option value="tds">TDS</option><option value="sds">SDS</option></select></div>}
      {loading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: limit ?? 6 }, (_, index) => <div key={index} className="h-40 animate-pulse border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }} />)}</div>}
      {!loading && error && <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Technical documents could not be loaded. Please try again.</p>}
      {!loading && !error && displayed.length === 0 && <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No documents match this search.</p>}
      {!loading && !error && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{displayed.map((document) => {
        const href = document.storagePath ?? document.externalUrl
        return href && <article key={document.id} className="flex flex-col border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}><div className="flex items-start justify-between gap-4"><span className="px-2 py-1 text-[10px] font-bold" style={{ backgroundColor: document.documentType === 'sds' ? 'var(--color-danger-soft)' : 'var(--color-brand-soft)', color: document.documentType === 'sds' ? 'var(--color-danger)' : 'var(--color-brand-hover)' }}>{labels[document.documentType] ?? 'PDF'}</span><span className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>PDF</span></div><p className="mt-4 text-sm font-semibold">{document.title}</p><Link to={'/product/' + document.productSlug} className="mt-2 text-xs hover:text-[var(--primary)]" style={{ color: 'var(--muted-foreground)' }}>{document.productName}</Link><a href={href} target="_blank" rel="noreferrer" className="tulda-button-secondary mt-5 w-full">VIEW / DOWNLOAD</a></article>
      })}</div>}
      {limit && <div className="mt-9 text-center"><Link to="/technical-documents" className="tulda-button-secondary px-6">VIEW ALL DOCUMENTS</Link></div>}
    </div>
  </section>
}
