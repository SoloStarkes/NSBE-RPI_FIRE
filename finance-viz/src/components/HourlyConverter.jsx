import { useState, useEffect, useRef } from 'react'
import { formatCurrency } from '../utils/formatters'

const RPI_RED = '#E2231A'
const RPI_DARK = '#333333'

function ClockIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#999' }}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#bbb', transition: 'transform 0.3s ease',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function HourlyConverter({ onUse, hasOverride }) {
  const [open,    setOpen]    = useState(false)
  const [hourly,  setHourly]  = useState('')
  const [applied, setApplied] = useState(false)
  const inputRef = useRef(null)

  const rate    = parseFloat(hourly) || 0
  const annual  = Math.round(rate * 40 * 52)
  const monthly = Math.round(annual / 12)

  // Auto-focus input when panel opens
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 120)
    return () => clearTimeout(t)
  }, [open])

  const handleHourlyChange = e => {
    const val = e.target.value.replace(/[^0-9.]/g, '')
    // Prevent multiple decimals
    const parts = val.split('.')
    setHourly(parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : val)
    if (applied) setApplied(false)
  }

  const handleUse = () => {
    if (annual <= 0) return
    onUse(annual)
    setApplied(true)
    const t = setTimeout(() => setApplied(false), 2500)
    return () => clearTimeout(t)
  }

  return (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{
        border: `1px solid ${hasOverride ? 'rgba(5, 150, 105, 0.3)' : '#e8e8e8'}`,
        background: '#fafafa',
        transition: 'border-color 0.3s ease',
      }}
    >

      {/* ── Toggle row ──────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-4 text-left"
        style={{ background: 'transparent' }}
      >
        <ClockIcon />
        <span className="text-sm font-semibold flex-1 leading-snug" style={{ color: '#666' }}>
          Had an internship? Convert your hourly wage.
        </span>

        {/* "Applied" badge — visible when an override is active */}
        {hasOverride && (
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full flex-shrink-0"
            style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669' }}
          >
            Applied
          </span>
        )}

        <ChevronIcon open={open} />
      </button>

      {/* ── Collapsible body — CSS grid trick for smooth height animation ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div
            className="px-4 sm:px-5 pb-5 pt-4"
            style={{ borderTop: '1px solid #eeeeee', background: '#ffffff' }}
          >

            {/* Hourly rate input */}
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#aaa' }}>
              Hourly Rate
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold"
                  style={{ color: '#bbb' }}
                >
                  $
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={hourly}
                  onChange={handleHourlyChange}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl text-lg font-bold border outline-none transition"
                  style={{ borderColor: '#e5e7eb', color: RPI_DARK }}
                  onFocus={e => (e.target.style.borderColor = RPI_RED)}
                  onBlur={e  => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>
              <span className="text-sm font-semibold flex-shrink-0" style={{ color: '#bbb' }}>/hr</span>
            </div>

            {/* Live results — only shown when a valid rate is entered */}
            {rate > 0 && (
              <div className="mt-4">

                {/* Stat pair */}
                <div className="flex gap-3">
                  <div className="flex-1 rounded-xl px-4 py-3" style={{ background: '#f5f5f5' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#999' }}>
                      Annual Salary
                    </p>
                    <p className="text-2xl font-extrabold tabular-nums" style={{ color: RPI_DARK }}>
                      {formatCurrency(annual)}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#bbb' }}>
                      ${rate}/hr × 2,080 hrs
                    </p>
                  </div>
                  <div className="flex-1 rounded-xl px-4 py-3" style={{ background: '#f5f5f5' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#999' }}>
                      Monthly (gross)
                    </p>
                    <p className="text-2xl font-extrabold tabular-nums" style={{ color: '#555' }}>
                      {formatCurrency(monthly)}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#bbb' }}>
                      before taxes &amp; deductions
                    </p>
                  </div>
                </div>

                {/* Use this salary button */}
                <button
                  onClick={handleUse}
                  disabled={applied}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-200"
                  style={{
                    fontSize:    '0.875rem',
                    border:      `1.5px solid ${applied ? '#059669' : RPI_DARK}`,
                    color:       applied ? '#059669' : RPI_DARK,
                    background:  applied ? 'rgba(5,150,105,0.06)' : 'transparent',
                    cursor:      applied ? 'default' : 'pointer',
                  }}
                  onMouseEnter={e => {
                    if (applied) return
                    e.currentTarget.style.borderColor = RPI_RED
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.background = RPI_RED
                  }}
                  onMouseLeave={e => {
                    if (applied) return
                    e.currentTarget.style.borderColor = RPI_DARK
                    e.currentTarget.style.color = RPI_DARK
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {applied ? (
                    <><CheckIcon /> Applied to salary field</>
                  ) : (
                    <>Use {formatCurrency(annual)} instead <ArrowIcon /></>
                  )}
                </button>
              </div>
            )}

            {/* Disclaimer note */}
            <p className="text-xs mt-4 leading-relaxed" style={{ color: '#bbb' }}>
              Assumes a standard 40-hour work week and does not account for taxes or benefits.
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
