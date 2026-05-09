import { useState, useEffect } from 'react'
import { useAI } from '../hooks/useAI.js'
import { CATEGORIES } from '../data.js'

const TREND_ICON = { improving: '↓', stable: '→', worsening: '↑' }
const TREND_COLOR = { improving: '#30D158', stable: '#FFB800', worsening: '#FF3B30' }

const TIME_LABELS = ['morning', 'afternoon', 'evening', 'night']
const TIME_ICONS  = ['🌅', '☀️', '🌆', '🌙']

export default function AIPanel({ selectedArea, onClose }) {
  const { analyzeArea, loading } = useAI()
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (!selectedArea) { setResult(null); return }
    setResult(null)
    analyzeArea(selectedArea.reports, `area near (${selectedArea.lat.toFixed(3)}, ${selectedArea.lng.toFixed(3)})`).then(setResult)
  }, [selectedArea])

  if (!selectedArea) return null

  const riskColor = result ? riskToColor(result.riskScore) : 'var(--text-2)'

  return (
    <div style={panelStyle} className="animate-slide">
      {/* Header */}
      <div style={hdr}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--text)', letterSpacing: '-0.01em' }}>
            AI Risk Analysis
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>
            {selectedArea.reports.length} report{selectedArea.reports.length !== 1 ? 's' : ''} in zone
          </div>
        </div>
        <button onClick={onClose} style={closeBtn}>✕</button>
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        {loading && <Skeleton />}

        {!loading && result && (
          <>
            {/* Risk Score */}
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px',
                  background: `${riskColor}18`, border: `1px solid ${riskColor}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px',
                  color: riskColor,
                }}>
                  {result.riskScore}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: riskColor, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: '500' }}>
                    {result.riskLabel}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: TREND_COLOR[result.trend] }}>
                      {TREND_ICON[result.trend]} {result.trend}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>trend</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.6', fontFamily: 'var(--font-body)' }}>
                {result.summary}
              </p>
            </div>

            {/* Time Risk */}
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
              <div style={sectionLabel}>Risk by time of day</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {TIME_LABELS.map((t, i) => {
                  const val = result.timeRisk?.[t] || 1
                  const c = riskToColor(val * 2)
                  return (
                    <div key={t} style={timeCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-2)' }}>{TIME_ICONS[i]} {t}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: c, fontWeight: '500' }}>{val}/5</span>
                      </div>
                      <div style={{ height: '3px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(val / 5) * 100}%`, background: c, borderRadius: '3px', transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Advice */}
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
              <div style={sectionLabel}>Safety advice</div>
              <div style={{
                background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.2)',
                borderRadius: '8px', padding: '12px',
                fontSize: '12px', color: 'var(--text)', lineHeight: '1.6',
                fontFamily: 'var(--font-body)',
              }}>
                ⚡ {result.advice}
              </div>
            </div>

            {/* Primary threat */}
            {result.primaryThreat && (
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
                <div style={sectionLabel}>Primary threat</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)',
                    borderRadius: '6px', padding: '4px 10px',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--critical)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {result.primaryThreat}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Reports list */}
        <div style={{ padding: '16px' }}>
          <div style={sectionLabel}>Reports in zone</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedArea.reports.map(r => {
              const cat = CATEGORIES[r.category] || CATEGORIES.other
              const age = Math.round((Date.now() - r.timestamp) / 3600000)
              return (
                <div key={r.id} style={reportCard(cat.color)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: cat.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cat.label}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-3)' }}>↑{r.upvotes} · {age < 1 ? '<1h' : `${age}h`} ago</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>{r.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {[80, 60, 100, 50].map((w, i) => (
        <div key={i} style={{
          height: '14px', width: `${w}%`,
          background: 'var(--bg-4)', borderRadius: '4px',
          animation: 'pulse 1.5s ease infinite',
          animationDelay: `${i * 0.1}s`,
        }} />
      ))}
      <div style={{ marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', textAlign: 'center', animation: 'pulse 1.5s ease infinite' }}>
        Analyzing zone…
      </div>
    </div>
  )
}

function riskToColor(score) {
  if (score >= 8) return '#FF3B30'
  if (score >= 6) return '#FF6B00'
  if (score >= 4) return '#FFB800'
  if (score >= 2) return '#30D158'
  return '#0A84FF'
}

// Styles
const panelStyle = {
  width: '320px',
  flexShrink: 0,
  background: 'var(--bg-2)',
  borderLeft: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
}

const hdr = {
  padding: '14px 16px',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
}

const closeBtn = {
  background: 'none',
  border: 'none',
  color: 'var(--text-3)',
  cursor: 'pointer',
  fontSize: '14px',
  padding: '4px 6px',
  borderRadius: '4px',
  transition: 'color 0.15s',
}

const sectionLabel = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  color: 'var(--text-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '10px',
}

const timeCard = {
  background: 'var(--bg-3)',
  borderRadius: '8px',
  padding: '10px',
}

const reportCard = (color) => ({
  background: 'var(--bg-3)',
  borderRadius: '8px',
  padding: '10px',
  borderLeft: `2px solid ${color}`,
})
