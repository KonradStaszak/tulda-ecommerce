import type { GbpCurrencyCode } from '../../types/catalog'

export function formatMoney(minorUnits: number, currency: GbpCurrencyCode = 'GBP') {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minorUnits / 100)
}
