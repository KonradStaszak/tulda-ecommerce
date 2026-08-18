interface QuantitySelectorProps {
  value: number
  onChange: (quantity: number) => void
  disabled?: boolean
}

export default function QuantitySelector({ value, onChange, disabled = false }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center border rounded-sm" style={{ borderColor: 'var(--border)' }}>
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} disabled={disabled || value <= 1} className="w-10 h-10 text-lg transition-colors hover:bg-[var(--muted)] disabled:opacity-40" aria-label="Decrease quantity">−</button>
      <span className="w-10 text-center text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }} aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={disabled} className="w-10 h-10 text-lg transition-colors hover:bg-[var(--muted)] disabled:opacity-40" aria-label="Increase quantity">+</button>
    </div>
  )
}
