import { useState, useCallback } from 'react'
import { ANTHROPIC_API_KEY, MODEL, CATEGORIES } from '../data.js'

const API_URL = 'https://api.anthropic.com/v1/messages'

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyzeArea = useCallback(async (reports, areaName = 'this area') => {
    if (!reports.length) return null
    setLoading(true)
    setError(null)

    const reportList = reports.map(r => {
      const cat = CATEGORIES[r.category]
      const age = Math.round((Date.now() - r.timestamp) / 3600000)
      return `- [${cat?.label || r.category}] "${r.description}" (${age}h ago, ${r.upvotes} confirmations)`
    }).join('\n')

    const hour = new Date().getHours()
    const timeContext = hour >= 22 || hour < 6 ? 'late night (high risk window)'
      : hour >= 18 ? 'evening'
      : hour >= 12 ? 'afternoon'
      : 'morning'

    const prompt = `You are CrowdSafe AI, a public safety analyst. Analyze these community safety reports for ${areaName} and respond with ONLY a valid JSON object — no markdown, no preamble.

Reports (${reports.length} total):
${reportList}

Current time context: ${timeContext}

Respond with exactly this structure:
{
  "riskScore": <integer 1-10>,
  "riskLabel": "<CRITICAL|HIGH|ELEVATED|MODERATE|LOW>",
  "summary": "<2-3 sentences. Factual, direct, no fluff. What's actually happening here?>",
  "primaryThreat": "<the single biggest risk category>",
  "timeRisk": {
    "morning": <1-5>,
    "afternoon": <1-5>,
    "evening": <1-5>,
    "night": <1-5>
  },
  "advice": "<1 concrete actionable safety tip for someone going here now>",
  "trend": "<improving|stable|worsening>"
}`

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 800,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (!res.ok) throw new Error(`API ${res.status}`)

      const data = await res.json()
      const raw = data.content.map(b => b.text || '').join('')
      const clean = raw.replace(/```json|```/g, '').trim()
      return JSON.parse(clean)
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { analyzeArea, loading, error }
}
