import { useEffect } from 'react'
import FilterSidebar from './FilterSidebar'
import type { CatalogueCategory, FilterState } from '../types/catalog'

interface MobileFilterDrawerProps {
  open: boolean
  onClose: () => void
  filters: FilterState
  onChange: (f: FilterState) => void
  totalCount: number
  filteredCount: number
  categories: CatalogueCategory[]
}

export default function MobileFilterDrawer({ open, onClose, filters, onChange, totalCount, filteredCount, categories }: MobileFilterDrawerProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div
        className="fixed inset-0 z-50 transition-opacity duration-250"
        style={{ backgroundColor: 'rgba(0,0,0,0.35)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        onClick={onClose}
      />
      <div
        className="fixed inset-y-0 left-0 z-50 w-[300px] flex flex-col"
        style={{
          backgroundColor: 'var(--background)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="text-[13px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
            Filter Products
          </span>
          <button onClick={onClose} className="p-1.5 rounded-sm hover:bg-[var(--muted)]" aria-label="Close filters">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <FilterSidebar
            filters={filters}
            onChange={onChange}
            totalCount={totalCount}
            filteredCount={filteredCount}
            categories={categories}
          />
        </div>

        {/* Apply footer */}
        <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={onClose}
            className="w-full py-3 text-sm font-semibold rounded-sm"
            style={{ backgroundColor: 'var(--primary)', color: '#fff', fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em' }}
          >
            View {filteredCount} Products
          </button>
        </div>
      </div>
    </>
  )
}
