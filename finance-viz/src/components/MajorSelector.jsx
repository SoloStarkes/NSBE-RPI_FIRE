import { useState, useMemo, useRef } from 'react'
import { salaries, salaryGroups } from '../data/salaries'
import { formatCurrency, formatCurrencyWhole } from '../utils/formatters'

const RPI_RED = '#E2231A'
const RPI_DARK = '#333333'

const GROUP_SHORT = {
  'Architecture': 'Arch',
  'Engineering': 'Eng',
  'Humanities, Arts & Social Sciences': 'HASS',
  'Management/IT': 'Mgmt/IT',
  'Science': 'Science',
  'Advanced Degrees': 'Grad',
}

function RangeBar({ min, max, avg }) {
  const span   = max - min
  const avgPct = ((avg - min) / span) * 100
  return (
    <div className="mt-5">
      <div className="flex justify-between text-sm mb-1.5" style={{ color: '#777' }}>
        <span>{formatCurrency(min)}</span>
        <span>{formatCurrency(max)}</span>
      </div>
      <div className="relative h-2.5 rounded-full" style={{ background: '#e8e8e8' }}>
        <div className="absolute h-2.5 rounded-full w-full" style={{ background: RPI_RED, opacity: 0.18 }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md"
          style={{ left: `calc(${avgPct}% - 10px)`, background: RPI_RED }} />
      </div>
      <p className="text-sm text-center mt-2" style={{ color: '#888' }}>
        Salary range · dot = average
      </p>
    </div>
  )
}

function SalaryPanel({ entry }) {
  return (
    <div className="rounded-2xl p-7 shadow-lg" style={{ background: RPI_DARK, color: '#fff' }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: RPI_RED }}>
          {entry.group}
        </p>
        <span className="text-sm px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0"
          style={{ background: 'rgba(226,35,26,0.15)', color: RPI_RED }}>
          {entry.degree}
        </span>
      </div>

      <h2 className="text-2xl font-bold leading-tight mt-1" style={{ color: '#fff' }}>
        {entry.major}
      </h2>

      <div className="mt-6 mb-1">
        <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#888' }}>
          Average Starting Salary
        </p>
        <p className="font-extrabold mt-2 tabular-nums" style={{ color: '#fff', fontSize: 'clamp(1.4rem, 5.5vw, 2.1rem)', lineHeight: 1.1 }}>
          {formatCurrencyWhole(entry.averageSalary)}
        </p>
      </div>

      <RangeBar min={entry.salaryMin} max={entry.salaryMax} avg={entry.averageSalary} />

      <p className="text-sm mt-5" style={{ color: '#666' }}>
        RPI Class of 2025 · Source: CCPD
      </p>
    </div>
  )
}

function MajorCard({ entry, selected, onClick }) {
  const isSelected = selected?.major === entry.major
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl px-4 py-3.5 transition-all duration-150 border"
      style={{
        background:   isSelected ? RPI_RED : '#fff',
        borderColor:  isSelected ? RPI_RED : '#e5e7eb',
        color:        isSelected ? '#fff'  : RPI_DARK,
        boxShadow:    isSelected ? '0 4px 14px rgba(226,35,26,0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <p className="text-base font-semibold leading-snug">{entry.major}</p>
      <p className="text-sm mt-0.5 font-medium"
        style={{ color: isSelected ? 'rgba(255,255,255,0.75)' : '#777' }}>
        {formatCurrency(entry.averageSalary)} avg
      </p>
    </button>
  )
}

export default function MajorSelector({ onSelect }) {
  const [search,      setSearch]      = useState('')
  const [activeGroup, setActiveGroup] = useState('All')
  const [selected,    setSelected]    = useState(null)
  const panelRef = useRef(null)

  const handleSelect = (entry) => {
    setSelected(entry)
    onSelect?.(entry)
    setTimeout(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return salaries.filter(s => {
      const matchGroup  = activeGroup === 'All' || s.group === activeGroup
      const matchSearch = s.major.toLowerCase().includes(q) || s.group.toLowerCase().includes(q)
      return matchGroup && matchSearch
    })
  }, [search, activeGroup])

  const groups = ['All', ...salaryGroups]

  return (
    <div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: '#bbb' }} fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search majors…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-base border outline-none transition"
          style={{ background: '#fff', borderColor: '#e5e7eb', color: RPI_DARK }}
          onFocus={e => (e.target.style.borderColor = RPI_RED)}
          onBlur={e  => (e.target.style.borderColor = '#e5e7eb')}
        />
      </div>

      {/* Group filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {groups.map(g => {
          const active = activeGroup === g
          return (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background:  active ? RPI_RED : '#fff',
                color:       active ? '#fff'  : '#555',
                border:      `1px solid ${active ? RPI_RED : '#ddd'}`,
              }}
            >
              {g === 'All' ? 'All' : (GROUP_SHORT[g] ?? g)}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Card list */}
        <div className="flex flex-col gap-2">
          {filtered.length === 0 ? (
            <p className="text-base py-8 text-center" style={{ color: '#999' }}>
              No majors match your search.
            </p>
          ) : (
            filtered.map(entry => (
              <MajorCard
                key={entry.major}
                entry={entry}
                selected={selected}
                onClick={() => handleSelect(entry)}
              />
            ))
          )}
        </div>

        {/* Salary detail panel
            Desktop: sticky right column, always visible (shows placeholder when nothing selected).
            Mobile: appears below cards only when a major is selected. */}
        <div ref={panelRef} className="md:sticky md:top-6 self-start">
          {selected ? (
            <SalaryPanel entry={selected} />
          ) : (
            <div className="hidden md:flex rounded-2xl p-7 border-2 border-dashed flex-col items-center justify-center text-center"
              style={{ borderColor: '#ddd', minHeight: '13rem' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ background: 'rgba(226,35,26,0.08)' }}>
                <svg className="w-6 h-6" style={{ color: RPI_RED }} fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <p className="text-base font-semibold" style={{ color: RPI_DARK }}>Select a major</p>
              <p className="text-sm mt-1.5" style={{ color: '#999' }}>
                Tap any card to see salary details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
