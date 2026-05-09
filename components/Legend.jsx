import { CATEGORIES } from '../data.js'

export default function Legend() {
  return (
    <div style={wrap}>
      <div style={title}>Legend</div>
      {Object.entries(CATEGORIES).map(([key, cat]) => (
        <div key={key} style={row}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
          <span style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'var(--font-body)' }}>{cat.label}</span>
        </div>
      ))}
    </div>
  )
}

const wrap = {
  position: 'absolute',
  bottom: '24px',
  left: '16px',
  zIndex: 1000,
  background: 'rgba(15,18,21,0.92)',
  border: '1px solid var(--border-2)',
  borderRadius: '10px',
  padding: '12px',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  minWidth: '130px',
}

const title = {
  fontFamily: 'var(--font-mono)',
  fontSize: '9px',
  color: 'var(--text-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '4px',
}

const row = {
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
}
