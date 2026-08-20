import { AnalyzeResponse } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function analyzeImage(file: File): Promise<AnalyzeResponse> {
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Analysis failed' }))
    throw new Error(err.error || 'Unable to analyze image')
  }

  return res.json()
}
