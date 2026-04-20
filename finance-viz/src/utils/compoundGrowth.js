export const END_AGE = 65

export const RATES = [
  {
    key: 'conservative',
    rate: 6,
    label: 'Conservative',
    sublabel: '6% / yr',
    color: '#6366f1',
    gradientId: 'gradConservative',
  },
  {
    key: 'average',
    rate: 10,
    label: 'Average',
    sublabel: '10% / yr',
    color: '#E2231A',
    gradientId: 'gradAverage',
  },
  {
    key: 'optimistic',
    rate: 12,
    label: 'Optimistic',
    sublabel: '12% / yr',
    color: '#059669',
    gradientId: 'gradOptimistic',
  },
]

export function buildChartData({ monthlyInvestment, startAge }) {
  const endAge = Math.max(startAge + 1, END_AGE)
  const data = []

  for (let age = startAge; age <= endAge; age++) {
    const months = (age - startAge) * 12
    const contributions = Math.round(monthlyInvestment * months)
    const point = { age, contributions }

    for (const { key, rate } of RATES) {
      const r = rate / 100 / 12
      point[key] = months === 0
        ? 0
        : Math.round(monthlyInvestment * ((Math.pow(1 + r, months) - 1) / r))
    }

    data.push(point)
  }

  return data
}

export function formatCompact(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${Math.round(value)}`
}
