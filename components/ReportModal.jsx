import { useState, useEffect } from 'react'
import { CATEGORIES } from '../data.js'

export default function ReportModal({ open, onClose, onSubmit, defaultCoords }) {
  const [form, setForm] = useState({ category: 'harassment', description: '', lat: '', lng: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (defaultCoords) {
      setForm(f => ({ ...f, lat: defaultCoords.lat.toFixed(5), lng: defaultCoords.lng.toFixed(5) }))
    }
  }, [defaultCoords])

  useEffect(() => {
    if (open) { setSubmitted(false); setForm(f => ({ ...f, description: '' })) }
  }, [open])

  if (!open) return null

  const handleSubmit = () => {
    if (!form.description.trim() || !form.lat || !form.lng) return
    onSubmit({
      category: form.category,
      description: form.description.trim(),
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
    })
    setSubmitted(true)
    setTimeout(onClose, 1800)
  }

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal} className="animate-fade">
        {/* Header */}
        <div style={hdr}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--text)' }}>
            Submit Report
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>
            Anonymous · Community-verified
          </div>
        </div>

        {submitted ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '16px', color: 'var(--low)' }}>
              Report submitted
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
              Thank you for keeping the community safe
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px' }}>
            {/* Category */}
            <div style={fieldWrap}>
              <label style={label}>Incident type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setForm(f => ({ ...f, category: key }))}
                    style={{
                      padding: '8px 10px',
                      background: form.category === key ? `${cat.color}18` : 'var(--bg-3)',
                      border: `1px solid ${form.category === key ? cat.color : 'var(--border)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      color: form.category === key ? cat.color : 'var(--text-2)',
                      transition: 'all 0.15s',
                      textAlign: 'left',
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={fieldWrap}>
              <label style={label}>What happened?</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe the incident briefly and factually..."
                maxLength={300}
                rows={3}
                style={textarea}
              />
              <div style={{ textAlign: 'right', fontSize: '10px', color: 'var(--text-3)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                {form.description.length}/300
              </div>
            </div>

            {/* Coordinates */}
            <div style={fieldWrap}>
              <label style={label}>Location coordinates</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', marginBottom: '4px' }}>Latitude</div>
                  <input
                    type="number"
                    value={form.lat}
                    onChange={e => setForm(f => ({ ...f, lat: e.target.value }))}
                    placeholder="40.7580"
                    style={input}
                  />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-3)', marginBottom: '4px' }}>Longitude</div>
                  <input
                    type="number"
                    value={form.lng}
                    onChange={e => setForm(f => ({ ...f, lng: e.target.value }))}
                    placeholder="-73.9855"
                    style={input}
                  />
                </div>
              </div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                💡 Tip: Right-click any location on Google Maps → "What's here?" to get coordinates
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button onClick={onClose} style={cancelBtn}>Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!form.description.trim() || !form.lat || !form.lng}
                style={{
                  ...submitBtn,
                  opacity: (!form.description.trim() || !form.lat || !form.lng) ? 0.4 : 1,
                }}
              >
                Submit anonymously
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Styles
const overlay = {
  position: 'fixed', inset: 0, zIndex: 9999,
  background: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  backdropFilter: 'blur(4px)',
}

const modal = {
  background: 'var(--bg-2)',
  border: '1px solid var(--border-2)',
  borderRadius: '16px',
  width: '440px',
  maxWidth: '95vw',
  overflow: 'hidden',
  boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
}

const hdr = {
  padding: '18px 20px 16px',
  borderBottom: '1px solid var(--border)',
  background: 'var(--bg-3)',
}

const fieldWrap = { marginBottom: '18px' }

const label = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  color: 'var(--text-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '8px',
}

const textarea = {
  width: '100%',
  background: 'var(--bg-3)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '10px 12px',
  color: 'var(--text)',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  lineHeight: '1.6',
  resize: 'vertical',
  outline: 'none',
}

const input = {
  width: '100%',
  background: 'var(--bg-3)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '9px 12px',
  color: 'var(--text)',
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  outline: 'none',
}

const cancelBtn = {
  flex: 1,
  padding: '11px',
  background: 'var(--bg-3)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  color: 'var(--text-2)',
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontSize: '12px',
  cursor: 'pointer',
  letterSpacing: '0.03em',
}

const submitBtn = {
  flex: 2,
  padding: '11px',
  background: 'var(--critical)',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: '12px',
  cursor: 'pointer',
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  transition: 'opacity 0.15s',
}
