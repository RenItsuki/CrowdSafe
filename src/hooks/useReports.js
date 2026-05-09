import { useState, useCallback } from 'react'
import { SEED_REPORTS } from '../data.js'

const STORAGE_KEY = 'crowdsafe_reports'

function loadReports() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge stored user reports with fresh seed data
      const userReports = parsed.filter(r => r.userAdded)
      return [...SEED_REPORTS, ...userReports]
    }
  } catch {}
  return SEED_REPORTS
}

function saveUserReports(reports) {
  try {
    const userReports = reports.filter(r => r.userAdded)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userReports))
  } catch {}
}

export function useReports() {
  const [reports, setReports] = useState(loadReports)

  const addReport = useCallback((report) => {
    const newReport = {
      ...report,
      id: Date.now(),
      timestamp: Date.now(),
      upvotes: 0,
      userAdded: true,
    }
    setReports(prev => {
      const next = [newReport, ...prev]
      saveUserReports(next)
      return next
    })
    return newReport
  }, [])

  const upvoteReport = useCallback((id) => {
    setReports(prev => {
      const next = prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r)
      saveUserReports(next)
      return next
    })
  }, [])

  return { reports, addReport, upvoteReport }
}
