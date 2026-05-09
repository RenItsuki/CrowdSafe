import { useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import { CATEGORIES, RISK_LEVELS } from '../data.js'

// Custom SVG marker factory
function createMarker(category, count = 1) {
  const cat = CATEGORIES[category] || CATEGORIES.other
  const size = Math.min(40, 24 + count * 2)
  const pulse = count > 3

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      ${pulse ? `<circle cx="20" cy="20" r="18" fill="${cat.color}" opacity="0.15"/>` : ''}
      <circle cx="20" cy="20" r="12" fill="${cat.color}" opacity="0.9"/>
      <circle cx="20" cy="20" r="6" fill="white" opacity="0.9"/>
    </svg>`

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function formatAge(ts) {
  const mins = Math.round((Date.now() - ts) / 60000)
  if (mins < 60) return `${mins}m ago`
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`
  return `${Math.round(mins / 1440)}d ago`
}

export default function MapView({ reports, onSelectArea, selectedArea }) {
  const mapRef = useRef(null)
  const leafletRef = useRef(null)
  const markersRef = useRef([])
  const circlesRef = useRef([])

  // Initialize map
  useEffect(() => {
    if (leafletRef.current) return

    leafletRef.current = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 3,
      zoomControl: true,
      attributionControl: false,
    })

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(leafletRef.current)

    L.control.attribution({ prefix: '' }).addTo(leafletRef.current)
  }, [])

  // Render markers + heat circles
  useEffect(() => {
    const map = leafletRef.current
    if (!map) return

    // Clear old
    markersRef.current.forEach(m => m.remove())
    circlesRef.current.forEach(c => c.remove())
    markersRef.current = []
    circlesRef.current = []

    // Group nearby reports (within ~500m)
    const clusters = clusterReports(reports, 0.005)

    clusters.forEach(cluster => {
      const { lat, lng, items } = cluster
      const dominant = dominantCategory(items)
      const cat = CATEGORIES[dominant] || CATEGORIES.other
      const riskScore = Math.min(5, Math.round(items.reduce((s, r) => s + (CATEGORIES[r.category]?.risk || 1), 0) / items.length))

      // Heat circle
      const radius = 300 + items.length * 150
      const circle = L.circle([lat, lng], {
        radius,
        color: cat.color,
        fillColor: cat.color,
        fillOpacity: 0.08 + Math.min(0.22, items.length * 0.03),
        weight: 0,
      }).addTo(map)
      circlesRef.current.push(circle)

      // Marker
      const marker = L.marker([lat, lng], { icon: createMarker(dominant, items.length) })
        .addTo(map)

      // Popup
      const popupHtml = `
        <div style="font-family: 'IBM Plex Mono', monospace; min-width: 220px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
            <div style="width:8px;height:8px;border-radius:50%;background:${cat.color};"></div>
            <span style="font-family:'Syne',sans-serif;font-weight:600;font-size:13px;color:#E8EDF2;">${cat.label}</span>
            <span style="margin-left:auto;font-size:10px;color:#505A64;">${items.length} report${items.length > 1 ? 's' : ''}</span>
          </div>
          ${items.slice(0, 3).map(r => `
            <div style="margin-bottom:8px;padding:8px;background:rgba(255,255,255,0.04);border-radius:6px;border-left:2px solid ${cat.color};">
              <div style="font-size:11px;color:#E8EDF2;margin-bottom:3px;">${r.description}</div>
              <div style="font-size:10px;color:#505A64;">↑${r.upvotes} · ${formatAge(r.timestamp)}</div>
            </div>
          `).join('')}
          <button onclick="window._csAnalyze(${lat},${lng})"
            style="width:100%;margin-top:6px;padding:7px;background:#FF3B30;color:#fff;border:none;border-radius:6px;font-family:'Syne',sans-serif;font-weight:600;font-size:11px;cursor:pointer;letter-spacing:0.04em;text-transform:uppercase;">
            AI Risk Analysis →
          </button>
        </div>`

      marker.bindPopup(popupHtml, { maxWidth: 280 })
      markersRef.current.push(marker)
    })

    // Global callback for popup button
    window._csAnalyze = (lat, lng) => {
      const nearby = reports.filter(r =>
        Math.abs(r.lat - lat) < 0.02 && Math.abs(r.lng - lng) < 0.02
      )
      onSelectArea({ lat, lng, reports: nearby })
    }

    return () => { delete window._csAnalyze }
  }, [reports, onSelectArea])

  return (
    <div
      ref={mapRef}
      style={{ flex: 1, width: '100%', height: '100%' }}
    />
  )
}

// ── Helpers ─────────────────────────────────────────────────

function clusterReports(reports, threshold) {
  const visited = new Set()
  const clusters = []

  reports.forEach((r, i) => {
    if (visited.has(i)) return
    const cluster = { lat: r.lat, lng: r.lng, items: [r] }
    visited.add(i)

    reports.forEach((r2, j) => {
      if (visited.has(j)) return
      if (Math.abs(r.lat - r2.lat) < threshold && Math.abs(r.lng - r2.lng) < threshold) {
        cluster.items.push(r2)
        visited.add(j)
      }
    })

    clusters.push(cluster)
  })

  return clusters
}

function dominantCategory(items) {
  const freq = {}
  items.forEach(r => { freq[r.category] = (freq[r.category] || 0) + (CATEGORIES[r.category]?.risk || 1) })
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'other'
}
