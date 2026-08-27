import { useState } from 'react'
import type { CatalogueCategory, FilterState } from '../types/catalog'
import { getCategoryTree } from '../services/catalogue/categoryHierarchy'

interface FilterSidebarProps {
  filters: FilterState
  onChange: (f: FilterState) => void
  totalCount: number
  filteredCount: number
  categories: CatalogueCategory[]
}

const SIZE_GROUPS = [
  { label: 'Small (1L / 1kg)', values: ['1L', '1kg'] },
  { label: 'Medium (1.5–3.5L / 3kg)', values: ['1.5L', '3.5L', '3kg'] },
  { label: 'Large (5L+)', values: ['5L', '7.5L'] },
  { label: 'Boxes / Kits', values: ['Box/50', 'Box/100', 'Kit', 'Bundle'] },
]

function AccordionSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full py-3.5 text-left"
      >
        <span className="text-[12px] font-semibold uppercase tracking-wider"
          style={{ fontFamily: 'Inter, sans-serif', color: 'var(--foreground)', letterSpacing: '0.1em' }}>
          {title}
        </span>
        <svg className="w-3.5 h-3.5 shrink-0 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none', color: 'var(--muted-foreground)' }}
          fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
        </svg>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

function Checkbox({ checked, onChange, label, count, indent = false }: { checked: boolean; onChange: () => void; label: string; count?: number; indent?: boolean }) {
  return (
    <label className={'flex items-center gap-2.5 cursor-pointer group py-1 ' + (indent ? 'pl-5' : '')}>
      <div
        className="w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors"
        style={{
          borderColor: checked ? 'var(--primary)' : 'var(--border)',
          backgroundColor: checked ? 'var(--primary)' : 'transparent',
        }}
        onClick={onChange}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
          </svg>
        )}
      </div>
      <span className="text-[12px] group-hover:text-[var(--foreground)] transition-colors flex-1"
        style={{ color: checked ? 'var(--foreground)' : '#555', fontFamily: 'Inter, sans-serif' }}
        onClick={onChange}>
        {label}
      </span>
      {count !== undefined && (
        <span className="text-[10px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>{count}</span>
      )}
    </label>
  )
}

export default function FilterSidebar({ filters, onChange, totalCount, filteredCount, categories }: FilterSidebarProps) {
  const categoryTree = getCategoryTree(categories)
  const toggleCategory = (id: string) => {
    const next = filters.categories.includes(id)
      ? filters.categories.filter(c => c !== id)
      : [...filters.categories, id]
    onChange({ ...filters, categories: next, page: 1 })
  }

  const toggleSize = (value: string) => {
    const next = filters.sizes.includes(value)
      ? filters.sizes.filter(s => s !== value)
      : [...filters.sizes, value]
    onChange({ ...filters, sizes: next, page: 1 })
  }

  const hasActive = filters.categories.length > 0 || filters.inStockOnly || filters.sizes.length > 0

  return (
    <aside style={{ minWidth: 220 }}>
      {/* Sidebar header */}
      <div className="flex items-center justify-between pb-4 mb-1 border-b" style={{ borderColor: 'var(--border)' }}>
        <span className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.14em' }}>
          Filters
        </span>
        {hasActive && (
          <button
            onClick={() => onChange({ ...filters, categories: [], inStockOnly: false, sizes: [], page: 1 })}
            className="text-[11px] font-medium transition-colors hover:text-[var(--primary)]"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-[11px] mb-4" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>
        {filteredCount === totalCount ? `${totalCount} products` : `${filteredCount} of ${totalCount} products`}
      </p>

      {/* Category */}
      <AccordionSection title="Category">
        <div className="space-y-0.5">
          {categoryTree.flatMap((node) => [
            <Checkbox
              key={node.category.id}
              checked={filters.categories.includes(node.category.id)}
              onChange={() => toggleCategory(node.category.id)}
              label={node.category.name}
              count={node.category.productCount}
            />,
            ...node.children.map((child) => (
              <Checkbox
                key={child.category.id}
                checked={filters.categories.includes(child.category.id)}
                onChange={() => toggleCategory(child.category.id)}
                label={'↳ ' + child.category.name}
                count={child.category.productCount}
                indent
              />
            )),
          ])}
        </div>
      </AccordionSection>

      {/* Availability */}
      <AccordionSection title="Availability">
        <Checkbox
          checked={filters.inStockOnly}
          onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly, page: 1 })}
          label="In stock only"
        />
      </AccordionSection>

      {/* Size / Format */}
      <AccordionSection title="Size / Format" defaultOpen={false}>
        <div className="space-y-0.5">
          {SIZE_GROUPS.map(group => (
            <Checkbox
              key={group.label}
              checked={group.values.some(v => filters.sizes.includes(v))}
              onChange={() => {
                const anyActive = group.values.some(v => filters.sizes.includes(v))
                const next = anyActive
                  ? filters.sizes.filter(s => !group.values.includes(s))
                  : [...new Set([...filters.sizes, ...group.values])]
                onChange({ ...filters, sizes: next, page: 1 })
              }}
              label={group.label}
            />
          ))}
        </div>
      </AccordionSection>
    </aside>
  )
}
