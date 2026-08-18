import QuantitySelector from '../../components/QuantitySelector'
import { formatMoney } from '../../services/catalogue/money'
import { useCart } from './CartContext'
import type { CartLine } from './types'

export default function CartLineItem({ line, compact = false }: { line: CartLine; compact?: boolean }) {
  const { removeLine, setQuantity } = useCart()
  return <article className="flex gap-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
    <div className={compact ? 'w-16 h-16 shrink-0' : 'w-24 h-24 shrink-0'} style={{ backgroundColor: 'var(--muted)' }}>{line.imagePath && <img src={line.imagePath} alt="" className="w-full h-full object-contain p-1" />}</div>
    <div className="flex-1 min-w-0"><div className="flex justify-between gap-3"><div><h3 className="text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>{line.productName}</h3><p className="text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>{line.variantLabel}</p></div><button onClick={() => removeLine(line.variantId)} aria-label={`Remove ${line.productName} from cart`} className="p-1 self-start">×</button></div>
      {!line.isInStock && <p className="mt-2 text-xs" role="status" style={{ color: '#b45309' }}>{line.unavailableReason === 'missing_variant' ? 'This variant is no longer available.' : 'This variant is out of stock.'}</p>}
      <div className="mt-3 flex items-center justify-between gap-3"><QuantitySelector value={line.quantity} onChange={(quantity) => setQuantity(line.variantId, quantity)} /><div className="text-right"><p className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>{formatMoney(line.priceMinor, line.currency)} each</p><p className="font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{formatMoney(line.priceMinor * line.quantity, line.currency)}</p></div></div>
    </div>
  </article>
}
