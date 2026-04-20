import { useState, useEffect, useRef, Fragment } from 'react'
import MajorSelector from './MajorSelector'
import InvestmentInputs from './InvestmentInputs'
import CompoundGrowthChart from './CompoundGrowthChart'

const RPI_RED = '#E2231A'
const RPI_DARK = '#333333'
const FADE_UP = 'fadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both'

const STEPS = [
  { num: 1, label: 'Pick Your Major',   shortLabel: 'Major',    desc: 'Load your expected RPI starting salary' },
  { num: 2, label: 'Set Your Strategy', shortLabel: 'Strategy', desc: 'Choose your investment rate & return'   },
  { num: 3, label: 'See the Growth',    shortLabel: 'Growth',   desc: 'Watch your wealth compound to retirement' },
]

function Check() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2.5,8.5 6.5,12 13,4" />
    </svg>
  )
}

function ResetIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

// ── Header step tracker ────────────────────────────────────────────────────
function StepTracker({ currentStep }) {
  return (
    <div className="flex items-center mt-10 flex-wrap gap-y-4">
      {STEPS.map((s, i) => {
        const done   = currentStep > s.num
        const active = currentStep === s.num
        const locked = currentStep < s.num
        return (
          <Fragment key={s.num}>
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500"
                style={{
                  fontSize: '0.95rem',
                  background: done ? RPI_RED : active ? '#ffffff' : 'transparent',
                  color:      done ? '#fff'   : active ? RPI_DARK  : '#606060',
                  border:     locked ? '2px solid #505050' : 'none',
                  boxShadow:  active ? '0 0 0 4px rgba(255,255,255,0.14)' : 'none',
                }}
              >
                {done ? <Check /> : s.num}
              </div>
              <div className="hidden sm:block">
                <p className="text-base font-bold leading-none"
                  style={{ color: locked ? '#606060' : '#e5e7eb' }}>
                  {s.label}
                </p>
                <p className="text-sm leading-none mt-1"
                  style={{ color: locked ? '#505050' : '#6b7280' }}>
                  {s.desc}
                </p>
              </div>
              <p className="text-sm font-bold sm:hidden"
                style={{ color: locked ? '#606060' : '#e5e7eb' }}>
                {s.shortLabel}
              </p>
            </div>
            {i < 2 && (
              <div className="h-px flex-1 mx-4 transition-all duration-700"
                style={{ maxWidth: 72, background: currentStep > i + 1 ? RPI_RED : '#3a3a3a' }} />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

// ── Section label in body ──────────────────────────────────────────────────
function SectionLabel({ num, title, desc, active }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-black flex-shrink-0 mt-0.5 transition-all duration-300"
        style={{
          fontSize: '0.95rem',
          background: active ? RPI_RED : '#e9ecef',
          color:      active ? '#fff'   : '#b0b0b0',
        }}
      >
        {num}
      </div>
      <div>
        <h2 className="font-extrabold leading-tight"
          style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)', color: active ? RPI_DARK : '#c0c0c0' }}>
          {title}
        </h2>
        <p className="text-base mt-1" style={{ color: active ? '#777' : '#c8c8c8' }}>
          {desc}
        </p>
      </div>
    </div>
  )
}

// ── Locked placeholder ─────────────────────────────────────────────────────
function LockedPlaceholder({ message }) {
  return (
    <div className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-20 gap-3"
      style={{ borderColor: '#e0e0e0' }}>
      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#f4f4f4' }}>
        <svg className="w-6 h-6" style={{ color: '#d0d0d0' }} fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <p className="text-base font-semibold" style={{ color: '#bbb' }}>{message}</p>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [resetKey,         setResetKey]         = useState(0)
  const [selectedMajor,    setSelectedMajor]    = useState(null)
  const [investmentParams, setInvestmentParams] = useState(null)
  const [showChart,        setShowChart]        = useState(false)

  const chartRef = useRef(null)
  const currentStep = !selectedMajor ? 1 : !showChart ? 2 : 3

  const handleReset = () => {
    setSelectedMajor(null)
    setInvestmentParams(null)
    setShowChart(false)
    setResetKey(k => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reveal chart 700ms after first investment params — lets audience absorb Step 2 first
  useEffect(() => {
    if (investmentParams && !showChart) {
      const t = setTimeout(() => setShowChart(true), 700)
      return () => clearTimeout(t)
    }
  }, [investmentParams, showChart])

  // Auto-scroll to chart on first reveal only
  useEffect(() => {
    if (!showChart) return
    const t = setTimeout(() => {
      chartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
    return () => clearTimeout(t)
  }, [showChart])

  return (
    <div className="min-h-screen" style={{ background: '#f5f5f5' }}>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header style={{ background: RPI_DARK }}>
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-12">

          {/* Brand row — reset button lives here */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-sm font-black tracking-widest uppercase px-2.5 py-1 rounded"
              style={{ background: RPI_RED, color: '#fff' }}>
              RPI
            </span>
            <div className="w-px h-4 flex-shrink-0" style={{ background: '#4a4a4a' }} />
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#666' }}>
              NSBE · Financial Planning Tool
            </span>

            {/* Reset — only visible after a major is selected */}
            {selectedMajor && (
              <button
                onClick={handleReset}
                className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200"
                style={{ fontSize: '0.875rem', border: '1px solid #505050', color: '#888', background: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = RPI_RED
                  e.currentTarget.style.borderColor = RPI_RED
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = '#505050'
                  e.currentTarget.style.color = '#888'
                }}
              >
                <ResetIcon /> Start Over
              </button>
            )}
          </div>

          {/* Title */}
          <h1 className="font-black leading-none tracking-tight text-white"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)' }}>
            Your Wealth Journey
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-2xl leading-relaxed"
            style={{ color: '#9ca3af', fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)' }}>
            Select your major, decide how much to invest from your first paycheck,
            and discover how compound interest turns a small monthly habit into
            life-changing wealth by retirement.
          </p>

          <StepTracker currentStep={currentStep} />
        </div>
      </header>

      {/* ── BODY ────────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 pt-10 pb-16">

        {/* Steps 1 & 2 side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ── Step 1 ────────────────────────────────────────────────── */}
          <div>
            <SectionLabel num={1} title="Pick Your Major"
              desc="Select your RPI major to load your average starting salary." active />
            <MajorSelector key={resetKey} onSelect={setSelectedMajor} />
          </div>

          {/* ── Step 2 ────────────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-8 self-start">
            {selectedMajor ? (
              <div key={resetKey} style={{ animation: FADE_UP }}>
                <SectionLabel num={2} title="Set Your Strategy"
                  desc="Choose your monthly investment rate, starting age, and expected return." active />

                {/* Selected major chip */}
                <div className="rounded-2xl px-4 py-3 flex items-center gap-3 mb-4"
                  style={{ background: RPI_DARK }}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: RPI_RED }} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold uppercase tracking-widest"
                      style={{ color: 'rgba(255,255,255,0.45)' }}>
                      Selected Major
                    </p>
                    <p className="text-base font-bold leading-snug truncate" style={{ color: '#fff' }}>
                      {selectedMajor.major}
                    </p>
                  </div>
                </div>

                <InvestmentInputs
                  initialSalary={selectedMajor.averageSalary}
                  onChange={setInvestmentParams}
                />
              </div>
            ) : (
              <div>
                <SectionLabel num={2} title="Set Your Strategy"
                  desc="Select a major first to unlock this step." active={false} />
                <LockedPlaceholder message="Waiting for major selection…" />
              </div>
            )}
          </div>
        </div>

        {/* ── Step 3 ──────────────────────────────────────────────────── */}
        {showChart && (
          <div ref={chartRef} className="mt-14 scroll-mt-6" style={{ animation: FADE_UP }}>
            <SectionLabel num={3} title="See the Growth"
              desc="Three market scenarios — your portfolio from starting age to age 65." active />
            <CompoundGrowthChart
              monthlyInvestment={investmentParams.monthlyInvestment}
              startAge={investmentParams.startAge}
              returnRate={investmentParams.returnRate}
              percent={investmentParams.percent}
            />
          </div>
        )}

      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t" style={{ borderColor: '#e5e7eb' }}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-sm" style={{ color: '#aaa' }}>
            RPI Class of 2025 Average Reported Salaries · Source: CCPD
          </p>
          <p className="text-sm" style={{ color: '#aaa' }}>
            For educational use only · Not financial advice
          </p>
        </div>
      </footer>
    </div>
  )
}
