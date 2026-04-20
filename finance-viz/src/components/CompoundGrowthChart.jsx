import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceDot, Label,
} from 'recharts'
import { buildChartData, RATES, END_AGE, formatCompact } from '../utils/compoundGrowth'
import { formatCurrency } from '../utils/formatters'

const RPI_RED = '#E2231A'
const RPI_DARK = '#333333'

function fmtY(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`
  return `$${v}`
}

// ── SVG annotation badge at end of each line ──────────────────────────────
function EndLabel({ viewBox, text, color }) {
  if (!viewBox) return null
  const { cx, cy } = viewBox
  const w = text.length * 8 + 16
  if (cx < w / 2 + 8) return null
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill={color} stroke="white" strokeWidth={2} />
      <rect x={cx - w / 2} y={cy - 34} width={w} height={22} rx={5} fill={color} />
      <text x={cx} y={cy - 19} textAnchor="middle" fill="white"
        fontSize={12} fontWeight="700" fontFamily="system-ui, sans-serif">
        {text}
      </text>
    </g>
  )
}

// ── Hover tooltip ─────────────────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-2xl shadow-xl p-5"
      style={{ background: '#1e1e2e', border: '1px solid #2e2e40', minWidth: 240 }}>
      <p className="font-bold mb-3" style={{ color: '#fff', fontSize: '1.05rem' }}>
        Age {d.age}
      </p>
      <div className="flex justify-between mb-3 pb-3" style={{ borderBottom: '1px solid #2e2e40' }}>
        <span className="text-sm" style={{ color: '#888' }}>Total contributed</span>
        <span className="text-sm font-semibold tabular-nums" style={{ color: '#fff' }}>
          {formatCurrency(d.contributions)}
        </span>
      </div>
      {RATES.map(({ key, label, color }) => {
        const portfolio = d[key]
        const interest  = portfolio - d.contributions
        return (
          <div key={key} className="mb-2.5 last:mb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-sm font-semibold" style={{ color }}>{label}</span>
              </div>
              <span className="text-sm font-bold tabular-nums" style={{ color: '#fff' }}>
                {formatCurrency(portfolio)}
              </span>
            </div>
            <div className="flex justify-between mt-0.5 pl-4 text-sm" style={{ color: '#666' }}>
              <span>Interest earned</span>
              <span className="tabular-nums" style={{ color: interest >= 0 ? '#4ade80' : '#f87171' }}>
                +{formatCurrency(Math.max(0, interest))}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Summary stat card ─────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }) {
  return (
    <div className="flex-1 rounded-2xl p-5 text-center min-w-0"
      style={{ background: '#fff', border: '1px solid #efefef' }}>
      <p className="text-sm font-bold uppercase tracking-widest mb-1.5" style={{ color: '#999' }}>
        {label}
      </p>
      <p className="text-3xl font-extrabold tabular-nums leading-none"
        style={{ color: accent ?? RPI_DARK }}>
        {value}
      </p>
      {sub && <p className="text-sm mt-2 leading-snug" style={{ color: '#888' }}>{sub}</p>}
    </div>
  )
}

// ── Impact callout ─────────────────────────────────────────────────────────
function ImpactCallout({ percent, monthlyInvestment, startAge, totalContributed, finalValue, selectedRate }) {
  const endAge    = Math.max(startAge + 1, END_AGE)
  const interest  = finalValue - totalContributed
  const multiplier = totalContributed > 0 ? Math.round(finalValue / totalContributed) : 0

  return (
    <div className="mt-6 rounded-2xl p-5 sm:p-7 lg:p-8" style={{ background: RPI_DARK }}>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

        {/* Big multiplier feature */}
        <div className="flex-shrink-0 text-center lg:text-left">
          <p className="font-black tabular-nums leading-none"
            style={{ color: '#fff', fontSize: 'clamp(3.5rem, 5vw, 5rem)' }}>
            {multiplier}×
          </p>
          <p className="text-base font-semibold mt-2" style={{ color: '#6b7280' }}>
            your money back
          </p>
        </div>

        {/* Vertical divider — desktop only */}
        <div className="hidden lg:block w-px self-stretch" style={{ background: '#484848' }} />
        {/* Horizontal divider — mobile only */}
        <div className="lg:hidden w-full h-px" style={{ background: '#484848' }} />

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="font-bold leading-relaxed"
            style={{ color: '#fff', fontSize: 'clamp(1rem, 1.6vw, 1.2rem)' }}>
            By investing just{' '}
            <span style={{ color: RPI_RED }}>{percent}%</span> of your salary —{' '}
            <span style={{ color: '#e5e7eb' }}>{formatCurrency(monthlyInvestment)}/mo</span> — starting at age{' '}
            <span style={{ color: '#e5e7eb' }}>{startAge}</span>, the{' '}
            <span style={{ color: selectedRate.color }}>{selectedRate.label}</span>{' '}
            scenario grows your portfolio to{' '}
            <span className="font-black" style={{ color: '#fff' }}>{formatCompact(finalValue)}</span>{' '}
            by age {endAge}.
          </p>
          <p className="mt-3 leading-relaxed"
            style={{ color: '#9ca3af', fontSize: 'clamp(0.9rem, 1.4vw, 1rem)' }}>
            Your{' '}
            <span style={{ color: '#d1d5db' }}>{formatCompact(totalContributed)}</span> in contributions
            earns an additional{' '}
            <span style={{ color: '#d1d5db' }}>{formatCompact(interest)}</span> through compound
            interest — that's the power of starting early.
          </p>
        </div>
      </div>

      {/* Footnote */}
      <div className="mt-6 pt-5" style={{ borderTop: '1px solid #404040' }}>
        <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
          * These projections are illustrative estimates using monthly compound interest and assume
          consistent contributions with no interruptions. They do not account for taxes, inflation,
          management fees, or market volatility. Past market returns do not guarantee future results.
          This tool is for educational purposes only and does not constitute financial advice.
          Consult a licensed financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function CompoundGrowthChart({ monthlyInvestment, startAge, returnRate, percent }) {
  const data = useMemo(
    () => buildChartData({ monthlyInvestment, startAge }),
    [monthlyInvestment, startAge],
  )

  const endAge         = Math.max(startAge + 1, END_AGE)
  const finalData      = data[data.length - 1]
  const yMax           = Math.ceil(finalData.optimistic * 1.08)
  const selectedRate   = RATES.find(r => r.rate === returnRate) ?? RATES[1]
  const finalValue     = finalData[selectedRate.key]
  const totalContributed = finalData.contributions
  const totalGrowth    = finalValue - totalContributed
  const yearsInvested  = endAge - startAge
  const growthRatio    = totalContributed > 0
    ? (totalGrowth / totalContributed).toFixed(1)
    : '—'

  return (
    <div className="rounded-2xl shadow-sm border" style={{ background: '#fff', borderColor: '#efefef' }}>

      {/* ── Chart header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 pb-0">
        <div>
          <h2 className="text-xl font-extrabold" style={{ color: RPI_DARK }}>
            Portfolio Growth to Age {endAge}
          </h2>
          <p className="text-sm mt-1" style={{ color: '#888' }}>
            {yearsInvested} years · {formatCurrency(monthlyInvestment)}/mo invested · compounded monthly
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 flex-wrap">
          {RATES.map(({ key, label, sublabel, color }) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <div>
                <p className="text-sm font-semibold leading-none" style={{ color: RPI_DARK }}>{label}</p>
                <p className="text-sm leading-none mt-0.5" style={{ color: '#999' }}>{sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Chart ─────────────────────────────────────────────────────── */}
      <div className="px-1 sm:px-2 pt-1 sm:pt-2">
        <div style={{ width: '100%', height: 'clamp(260px, 55vw, 420px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 52, right: 40, bottom: 4, left: 16 }}>
            <defs>
              {RATES.map(({ gradientId, color }) => (
                <linearGradient key={gradientId} id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />

            <XAxis dataKey="age" tick={{ fontSize: 13, fill: '#999' }} tickLine={false} axisLine={false}
              interval={5}
              label={{ value: 'Age', position: 'insideBottomRight', offset: -4, fontSize: 13, fill: '#bbb' }} />
            <YAxis tickFormatter={fmtY} tick={{ fontSize: 13, fill: '#999' }}
              tickLine={false} axisLine={false} width={64}
              domain={[0, yMax]} />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />

            {RATES.map(({ key, color, gradientId }) => (
              <Area key={key} type="monotone" dataKey={key}
                stroke={color} strokeWidth={2.5} fill={`url(#${gradientId})`}
                dot={false} activeDot={{ r: 5, fill: color, stroke: 'white', strokeWidth: 2 }} />
            ))}

            {RATES.map(({ key, color }) => (
              <ReferenceDot key={key} x={endAge} y={finalData[key]} r={0} fill={color}>
                <Label content={<EndLabel text={formatCompact(finalData[key])} color={color} />} />
              </ReferenceDot>
            ))}
          </AreaChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* ── Summary stats ─────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="pt-5 mb-4" style={{ borderTop: '1px solid #f0f0f0' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: selectedRate.color }} />
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: '#999' }}>
              {selectedRate.label} Scenario Summary
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard
              label="Total Contributed"
              value={formatCompact(totalContributed)}
              sub={`${formatCurrency(monthlyInvestment)}/mo × ${yearsInvested * 12} months`}
            />
            <StatCard
              label="Interest Earned"
              value={formatCompact(totalGrowth)}
              sub={`${growthRatio}× your contributions in interest`}
              accent="#059669"
            />
            <StatCard
              label="Final Portfolio"
              value={formatCompact(finalValue)}
              sub={`at age ${endAge} · ${selectedRate.sublabel}`}
              accent={selectedRate.color}
            />
          </div>
        </div>

        {/* Impact callout */}
        <ImpactCallout
          percent={percent}
          monthlyInvestment={monthlyInvestment}
          startAge={startAge}
          totalContributed={totalContributed}
          finalValue={finalValue}
          selectedRate={selectedRate}
        />
      </div>
    </div>
  )
}
