import { useState } from 'react'
import { CATEGORIES } from '../data.js'

function timeAgo(ts) {
  const m = Math.round((Date.now() - ts) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (m < 1440) return `${Math.round(m / 60)}h ago`
  return `${Math.round(m / 1440)}d ago`
}

export default function Sidebar({ reports, onSelectArea, activeFilter, onFilter }) {
  const filtered = activeFilter
    ? reports.filter(r => r.category === activeFilter)
    : reports

  const sorted = [...filtered].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div style={sidebar}>
      {/* Filter chips */}
      <div style={filterRow}>
        <button
          onClick={() => onFilter(null)}
          style={chip(activeFilter === null)}
        >
          All
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => onFilter(key === activeFilter ? null : key)}
            style={chip(activeFilter === key, cat.color)}
          >
            {cat.icon}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div style={statsRow}>
        <StatBadge label="Critical" count={reports.filter(r => CATEGORIES[r.category]?.risk >= 4).length} color="#FF3B30" />
        <StatBadge label="High" count={reports.filter(r => CATEGORIES[r.category]?.risk === 3).length} color="#FF6B00" />
        <StatBadge label="Moderate" count={reports.filter(r => CATEGORIES[r.category]?.risk <= 2).length} color="#FFB800" />
      </div>

      {/* Feed */}
      <div style={feed}>
        <div style={feedLabel}>
          <span>Live feed</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>{sorted.length}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingBottom: '16px' }}>
          {sorted.map(r => {
            const cat = CATEGORIES[r.category] || CATEGORIES.other
            return (
              <div
                key={r.id}
                onClick={() => onSelectArea({ lat: r.lat, lng: r.lng, reports: [r] })}
                style={feedItem(cat.color)}
              >
                <div style={feedTop}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: cat.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {cat.label}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)' }}>
                    {timeAgo(r.timestamp)}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.5, margin: '4px 0 6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {r.description}
                </p>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)' }}>
                  ↑ {r.upvotes} confirmations
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatBadge({ label, count, color }) {
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: '500', color }}>{count}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    </div>
  )
}

// Styles
const sidebar = {
  width: '260px',
  flexShrink: 0,
  background: 'var(--bg-2)',
  borderRight: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
}

const filterRow = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  gap: '5px',
  flexWrap: 'wrap',
  flexShrink: 0,
}

const chip = (active, color) => ({
  padding: '4px 8px',
  background: active ? (color ? `${color}20` : 'var(--bg-4)') : 'var(--bg-3)',
  border: `1px solid ${active ? (color || 'var(--border-2)') : 'var(--border)'}`,
  borderRadius: '20px',
  color: active ? (color || 'var(--text)') : 'var(--text-3)',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  fontSize: '11px',
  transition: 'all 0.15s',
})

const statsRow = {
  display: 'flex',
  padding: '10px 12px',
  borderBottom: '1px solid var(--border)',
  flexShrink: 0,
}

const feed = {
  flex: 1,
  overflowY: 'auto',
  padding: '0 12px',
}

const feedLabel = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  color: 'var(--text-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  padding: '12px 0 8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  background: 'var(--bg-2)',
  zIndex: 1,
}

const feedItem = (color) => ({
  background: 'var(--bg-3)',
  borderRadius: '8px',
  padding: '10px',
  cursor: 'pointer',
  borderLeft: `2px solid ${color}`,
  transition: 'background 0.15s',
})

const feedTop = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}
