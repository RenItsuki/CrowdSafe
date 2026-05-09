import { useState, useEffect } from 'react'

const styles = {
  header: {
    position: 'relative',
    zIndex: 1000,
    background: 'var(--bg-2)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    height: '56px',
    flexShrink: 0,
  },
  left: { display: 'flex', alignItems: 'center', gap: '12px' },
  logo: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '18px',
    letterSpacing: '-0.02em',
    color: 'var(--text)',
    lineHeight: 1,
  },
  logoAccent: { color: 'var(--critical)' },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'rgba(255,59,48,0.1)',
    border: '1px solid rgba(255,59,48,0.25)',
    borderRadius: '4px',
    padding: '3px 8px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--critical)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--critical)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  clock: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--text-2)',
    letterSpacing: '0.05em',
  },
  statItem: { textAlign: 'center' },
  statNum: {
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text)',
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: 'var(--text-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginTop: '2px',
  },
  divider: { width: '1px', height: '24px', background: 'var(--border)' },
}

export default function Header({ reportCount, onOpenReport }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const hh = String(time.getHours()).padStart(2, '0')
  const mm = String(time.getMinutes()).padStart(2, '0')
  const ss = String(time.getSeconds()).padStart(2, '0')

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <div style={styles.logo}>
          Crowd<span style={styles.logoAccent}>Safe</span>
        </div>
        <div style={styles.badge}>
          <div style={styles.dot} />
          Live
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.statItem}>
          <div style={styles.statNum}>{reportCount}</div>
          <div style={styles.statLabel}>Reports</div>
        </div>
        <div style={styles.divider} />
        <div style={styles.clock}>{hh}:{mm}:{ss}</div>
        <div style={styles.divider} />
        <button
          onClick={onOpenReport}
          style={{
            background: 'var(--critical)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '7px 14px',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '12px',
            cursor: 'pointer',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
          }}
        >
          + Report
        </button>
      </div>
    </header>
  )
}
