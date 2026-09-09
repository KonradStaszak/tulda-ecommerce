export function formatMoney(minorUnits: number, currency = 'GBP') {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minorUnits / 100)
}
