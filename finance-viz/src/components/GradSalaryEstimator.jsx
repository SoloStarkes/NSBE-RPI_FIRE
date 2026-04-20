import { useState, useEffect } from 'react'
import { GRAD_MULTIPLIERS } from '../data/gradMultipliers'
import { formatCurrency } from '../utils/formatters'

const RPI_RED  = '#E2231A'
const RPI_DARK = '#333333'

function GradCapIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#999' }}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg className="w-4 h-4 flex-shrink-0"
      style={{ color: '#bbb', transition: 'transform 0.3s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
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

export default function GradSalaryEstimator({ baseSalary, onUse, hasOverride }) {
  const [open,      setOpen]      = useState(false)
  const [selection, setSelection] = useState(null)
  const [applied,   setApplied]   = useState(false)

  // Reset selections when the underlying major changes
  useEffect(() => { setSelection(null); setApplied(false) }, [baseSalary])

  const selected  = GRAD_MULTIPLIERS.find(m => m.key === selection)
  const minSalary = selected ? Math.round(baseSalary * selected.min) : 0
  const maxSalary = selected ? Math.round(baseSalary * selected.max) : 0
  const midpoint  = selected ? Math.round((minSalary + maxSalary) / 2) : 0

  const handleUse = () => {
    if (!selected) return
    onUse(midpoint)
    setApplied(true)
    const t = setTimeout(() => setApplied(false), 2500)
    return () => clearTimeout(t)
  }

  return (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{
        border:     `1px solid ${hasOverride ? 'rgba(5, 150, 105, 0.3)' : '#e8e8e8'}`,
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
        <GradCapIcon />
        <span className="text-sm font-semibold flex-1 leading-snug" style={{ color: '#666' }}>
          Planning grad school? See projected salaries.
        </span>

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

      {/* ── Collapsible body ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s ease' }}>
        <div style={{ overflow: 'hidden' }}>
          <div className="px-4 sm:px-5 pb-5 pt-4" style={{ borderTop: '1px solid #eeeeee', background: '#ffffff' }}>

            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#aaa' }}>
              Degree Level
            </p>

            {/* Degree option cards */}
            <div className="flex flex-col gap-2.5">
              {GRAD_MULTIPLIERS.map(m => {
                const isActive = selection === m.key
                const lo = Math.round(baseSalary * m.min)
                const hi = Math.round(baseSalary * m.max)
                return (
                  <button
                    key={m.key}
                    onClick={() => { setSelection(m.key); if (applied) setApplied(false) }}
                    className="w-full text-left rounded-xl px-5 py-3.5 border transition-all"
                    style={{
                      background:  isActive ? RPI_DARK : '#fafafa',
                      borderColor: isActive ? RPI_DARK : '#efefef',
                      boxShadow:   isActive ? '0 4px 12px rgba(51,51,51,0.15)' : 'none',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full"
                          style={{ background: isActive ? RPI_RED : '#ddd' }} />
                        <p className="text-base font-bold"
                          style={{ color: isActive ? '#fff' : RPI_DARK }}>
                          {m.label}
                        </p>
                      </div>
                      <span className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: isActive ? 'rgba(226,35,26,0.2)' : 'rgba(0,0,0,0.05)',
                          color:      isActive ? RPI_RED : '#777',
                        }}>
                        {m.abbrev}
                      </span>
                    </div>

                    <p className="text-sm mt-1.5 ml-5"
                      style={{ color: isActive ? 'rgba(255,255,255,0.6)' : '#888' }}>
                      {m.desc}
                    </p>

                    {/* Projected range */}
                    <p className="text-base font-extrabold tabular-nums mt-2 ml-5"
                      style={{ color: isActive ? '#fff' : RPI_DARK }}>
                      {formatCurrency(lo)}&thinsp;&ndash;&thinsp;{formatCurrency(hi)}
                    </p>
                    <p className="text-xs ml-5 mt-0.5"
                      style={{ color: isActive ? 'rgba(255,255,255,0.4)' : '#bbb' }}>
                      {(((m.min + m.max) / 2 - 1) * 100).toFixed(0)}% above bachelor's avg · midpoint{' '}
                      {formatCurrency(Math.round((lo + hi) / 2))}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Use midpoint button — only shown when a degree is selected */}
            {selected && (
              <button
                onClick={handleUse}
                disabled={applied}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-200"
                style={{
                  fontSize:   '0.875rem',
                  border:     `1.5px solid ${applied ? '#059669' : RPI_DARK}`,
                  color:      applied ? '#059669' : RPI_DARK,
                  background: applied ? 'rgba(5,150,105,0.06)' : 'transparent',
                  cursor:     applied ? 'default' : 'pointer',
                }}
                onMouseEnter={e => {
                  if (applied) return
                  e.currentTarget.style.borderColor = RPI_RED
                  e.currentTarget.style.color       = '#fff'
                  e.currentTarget.style.background  = RPI_RED
                }}
                onMouseLeave={e => {
                  if (applied) return
                  e.currentTarget.style.borderColor = RPI_DARK
                  e.currentTarget.style.color       = RPI_DARK
                  e.currentTarget.style.background  = 'transparent'
                }}
              >
                {applied ? (
                  <><CheckIcon /> Applied to salary field</>
                ) : (
                  <>Use {formatCurrency(midpoint)} as my salary <ArrowIcon /></>
                )}
              </button>
            )}

            {/* Disclaimer */}
            <p className="text-xs mt-4 leading-relaxed" style={{ color: '#bbb' }}>
              Projected ranges apply general historical multipliers and are not specific to RPI graduates.
              Actual salaries vary by employer, field, location, and individual qualifications.
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
