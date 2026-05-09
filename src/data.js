// ── Constants ───────────────────────────────────────────────

export const ANTHROPIC_API_KEY = 'YOUR_API_KEY_HERE'
export const MODEL = 'claude-sonnet-4-20250514'

export const CATEGORIES = {
  harassment:  { label: 'Harassment',    icon: '⚠', color: '#FF6B00', risk: 3 },
  theft:       { label: 'Theft/Scam',    icon: '💰', color: '#FF3B30', risk: 4 },
  road:        { label: 'Road Hazard',   icon: '🚧', color: '#FFB800', risk: 2 },
  violence:    { label: 'Violence',      icon: '🔴', color: '#FF3B30', risk: 5 },
  lighting:    { label: 'Poor Lighting', icon: '💡', color: '#FFB800', risk: 2 },
  flooding:    { label: 'Flooding',      icon: '🌊', color: '#0A84FF', risk: 3 },
  suspicious:  { label: 'Suspicious',   icon: '👁', color: '#FF6B00', risk: 3 },
  other:       { label: 'Other',         icon: '📍', color: '#8B95A1', risk: 1 },
}

export const RISK_LEVELS = {
  5: { label: 'CRITICAL', color: '#FF3B30' },
  4: { label: 'HIGH',     color: '#FF6B00' },
  3: { label: 'ELEVATED', color: '#FFB800' },
  2: { label: 'MODERATE', color: '#30D158' },
  1: { label: 'LOW',      color: '#0A84FF' },
}

// ── Seed reports (global cities) ────────────────────────────

export const SEED_REPORTS = [
  // New York
  { id: 1,  lat: 40.7549, lng: -73.9840, category: 'harassment', description: 'Aggressive panhandling near Times Sq station entrance', timestamp: Date.now() - 3600000,   upvotes: 14 },
  { id: 2,  lat: 40.7505, lng: -73.9934, category: 'theft',      description: 'Phone snatched on 8th Ave. Be careful near ATMs', timestamp: Date.now() - 7200000,   upvotes: 22 },
  { id: 3,  lat: 40.7614, lng: -73.9776, category: 'suspicious', description: 'Group of individuals following tourists near park', timestamp: Date.now() - 1800000,   upvotes: 8  },
  { id: 4,  lat: 40.7484, lng: -73.9967, category: 'lighting',   description: 'Entire block unlit after 9pm. Very unsafe', timestamp: Date.now() - 86400000,  upvotes: 31 },
  { id: 5,  lat: 40.7580, lng: -73.9855, category: 'road',       description: 'Large pothole swallowing cyclists on Broadway', timestamp: Date.now() - 43200000,  upvotes: 7  },

  // London
  { id: 6,  lat: 51.5074, lng: -0.1278, category: 'theft',      description: 'Multiple phone thefts reported on Oxford St', timestamp: Date.now() - 2700000,   upvotes: 18 },
  { id: 7,  lat: 51.5194, lng: -0.1270, category: 'harassment', description: 'Aggressive vendors near King\'s Cross', timestamp: Date.now() - 5400000,   upvotes: 11 },
  { id: 8,  lat: 51.5014, lng: -0.1419, category: 'suspicious', description: 'Unlicensed touts outside Westminster tube', timestamp: Date.now() - 9000000,   upvotes: 6  },

  // Tokyo
  { id: 9,  lat: 35.6762, lng: 139.6503, category: 'road',      description: 'Manhole cover loose near Shinjuku crossing', timestamp: Date.now() - 14400000,  upvotes: 4  },
  { id: 10, lat: 35.6580, lng: 139.7016, category: 'flooding',  description: 'Underpass flooding risk during heavy rain', timestamp: Date.now() - 21600000,  upvotes: 9  },

  // Mumbai
  { id: 11, lat: 19.0760, lng: 72.8777, category: 'road',       description: 'Massive pothole on Western Express Hwy', timestamp: Date.now() - 3000000,   upvotes: 26 },
  { id: 12, lat: 19.0544, lng: 72.8322, category: 'theft',      description: 'Bag snatching from moving autos reported', timestamp: Date.now() - 6600000,   upvotes: 19 },

  // São Paulo
  { id: 13, lat: -23.5505, lng: -46.6333, category: 'violence',   description: 'Robbery at gunpoint near Paulista Ave at night', timestamp: Date.now() - 1200000,   upvotes: 37 },
  { id: 14, lat: -23.5614, lng: -46.6558, category: 'suspicious', description: 'Scam artists targeting tourists near Ibirapuera', timestamp: Date.now() - 4800000,   upvotes: 15 },

  // Lagos
  { id: 15, lat: 6.5244, lng: 3.3792, category: 'road',         description: 'Flooding makes roads impassable after rain', timestamp: Date.now() - 7800000,   upvotes: 12 },
  { id: 16, lat: 6.4541, lng: 3.3947, category: 'theft',        description: 'One-chance taxi scam active on this route', timestamp: Date.now() - 12000000,  upvotes: 24 },
]
