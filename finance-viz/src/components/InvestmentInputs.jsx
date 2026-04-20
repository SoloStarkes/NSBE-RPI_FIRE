import { useState, useEffect } from 'react'
import { formatCurrency } from '../utils/formatters'

const RPI_RED = '#E2231A'
const RPI_DARK = '#333333'

const RETURN_RATES = [
  {
    value: 6,
    label: 'Conservative',
    sublabel: '6% / year',
    description: 'Below average — reflects cautious or bear market conditions.',
  },
  {
    value: 10,
    label: 'Average',
    sublabel: '10% / year',
    description: 'Historical S&P 500 long-term average since 1957.',
  },
  {
    value: 12,
    label: 'Optimistic',
    sublabel: '12% / year',
    description: 'Strong market periods or growth-heavy portfolios.',
  },
]

function FieldLabel({ children }) {
  return (
    <p className="text-sm font-bold uppercase tracking-widest mb-2.5" style={{ color: '#777' }}>
      {children}
    </p>
  )
}

function Card({ children }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border" style={{ borderColor: '#efefef' }}>
      {children}
    </div>
  )
}

export default function InvestmentInputs({ initialSalary = 0, onChange }) {
  const [salary,     setSalary]     = useState(initialSalary)
  const [percent,    setPercent]    = useState(10)
  const [startAge,   setStartAge]   = useState(22)
  const [returnRate, setReturnRate] = useState(10)

  useEffect(() => { setSalary(initialSalary) }, [initialSalary])

  useEffect(() => {
    const numericSalary   = Number(String(salary).replace(/[^0-9.]/g, '')) || 0
    const monthlyInvestment = (numericSalary / 12) * (percent / 100)
    onChange?.({ salary: numericSalary, percent, monthlyInvestment, startAge, returnRate })
  }, [salary, percent, startAge, returnRate])

  const numericSalary     = Number(String(salary).replace(/[^0-9.]/g, '')) || 0
  const monthlyInvestment = (numericSalary / 12) * (percent / 100)

  const handleSalaryChange = e => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setSalary(raw === '' ? '' : Number(raw))
  }

  const clampAge = val => {
    const n = parseInt(val, 10)
    return isNaN(n) ? 22 : Math.min(60, Math.max(16, n))
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Annual salary ────────────────────────────────────────────── */}
      <Card>
        <FieldLabel>Annual Salary</FieldLabel>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold"
            style={{ color: '#bbb' }}>
            $
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={salary === '' ? '' : Number(salary).toLocaleString()}
            onChange={handleSalaryChange}
            className="w-full pl-8 pr-4 py-3.5 rounded-xl text-xl font-bold border outline-none transition"
            style={{ borderColor: '#e5e7eb', color: RPI_DARK }}
            onFocus={e => (e.target.style.borderColor = RPI_RED)}
            onBlur={e  => (e.target.style.borderColor = '#e5e7eb')}
          />
        </div>
        <p className="text-sm mt-2" style={{ color: '#999' }}>
          Pre-filled from selected major · edit to customize
        </p>
      </Card>

      {/* ── Investment % slider ──────────────────────────────────────── */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <FieldLabel>Monthly Investment</FieldLabel>
          <span className="text-sm font-bold px-3 py-1 rounded-full"
            style={{ background: 'rgba(226,35,26,0.08)', color: RPI_RED }}>
            {percent}% of salary
          </span>
        </div>

        <input
          type="range" min={1} max={30} step={1} value={percent}
          onChange={e => setPercent(Number(e.target.value))}
          className="w-full h-2.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: RPI_RED }}
        />
        <div className="flex justify-between text-sm mt-1.5" style={{ color: '#bbb' }}>
          <span>1%</span><span>30%</span>
        </div>

        <div className="mt-4 rounded-xl px-5 py-4 flex items-center justify-between"
          style={{ background: '#f7f7f7' }}>
          <p className="text-sm font-semibold" style={{ color: '#777' }}>Invested per month</p>
          <p className="text-2xl font-extrabold tabular-nums" style={{ color: RPI_DARK }}>
            {formatCurrency(monthlyInvestment)}
          </p>
        </div>
      </Card>

      {/* ── Starting age ─────────────────────────────────────────────── */}
      <Card>
        <FieldLabel>Starting Age</FieldLabel>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStartAge(a => clampAge(a - 1))}
            className="w-11 h-11 rounded-full flex items-center justify-center border text-xl font-bold transition"
            style={{ borderColor: '#e5e7eb', color: RPI_DARK }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = RPI_RED)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
            −
          </button>
          <input
            type="number" min={16} max={60} value={startAge}
            onChange={e => setStartAge(clampAge(e.target.value))}
            className="w-24 text-center text-3xl font-extrabold rounded-xl py-2 border outline-none transition"
            style={{ borderColor: '#e5e7eb', color: RPI_DARK }}
            onFocus={e => (e.target.style.borderColor = RPI_RED)}
            onBlur={e  => (e.target.style.borderColor = '#e5e7eb')}
          />
          <button
            onClick={() => setStartAge(a => clampAge(a + 1))}
            className="w-11 h-11 rounded-full flex items-center justify-center border text-xl font-bold transition"
            style={{ borderColor: '#e5e7eb', color: RPI_DARK }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = RPI_RED)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
            +
          </button>
          <p className="text-base ml-1" style={{ color: '#999' }}>years old</p>
        </div>
        <p className="text-sm mt-2.5" style={{ color: '#999' }}>
          Projections run from your starting age to 65.
        </p>
      </Card>

      {/* ── Market return selector ───────────────────────────────────── */}
      <Card>
        <FieldLabel>Market Return Assumption</FieldLabel>
        <div className="flex flex-col gap-2.5">
          {RETURN_RATES.map(r => {
            const active = returnRate === r.value
            return (
              <button
                key={r.value}
                onClick={() => setReturnRate(r.value)}
                className="w-full text-left rounded-xl px-5 py-3.5 border transition-all"
                style={{
                  background:  active ? RPI_DARK : '#fafafa',
                  borderColor: active ? RPI_DARK : '#efefef',
                  boxShadow:   active ? '0 4px 12px rgba(51,51,51,0.15)' : 'none',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full"
                      style={{ background: active ? RPI_RED : '#ddd' }} />
                    <p className="text-base font-bold"
                      style={{ color: active ? '#fff' : RPI_DARK }}>
                      {r.label}
                    </p>
                  </div>
                  <span className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                    style={{
                      background: active ? 'rgba(226,35,26,0.2)' : 'rgba(0,0,0,0.05)',
                      color:      active ? RPI_RED : '#777',
                    }}>
                    {r.sublabel}
                  </span>
                </div>
                <p className="text-sm mt-1.5 ml-5"
                  style={{ color: active ? 'rgba(255,255,255,0.6)' : '#888' }}>
                  {r.description}
                </p>
              </button>
            )
          })}
        </div>
      </Card>

    </div>
  )
}
