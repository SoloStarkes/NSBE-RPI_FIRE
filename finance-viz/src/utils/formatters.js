export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

export const formatCurrencyWhole = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount)

export const formatPercent = (value, total) =>
  total === 0 ? '0%' : `${Math.round((value / total) * 100)}%`

export const getBudgetStatus = (spent, budget) => {
  const ratio = spent / budget
  if (ratio >= 1) return 'over'
  if (ratio >= 0.85) return 'warning'
  return 'ok'
}
