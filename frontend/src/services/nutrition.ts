import { NutritionRequest, NutritionResponse } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function calculateNutrition(req: NutritionRequest): Promise<NutritionResponse> {
  const res = await fetch(`${API_BASE}/nutrition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Nutrition calculation failed' }))
    throw new Error(err.error || 'Failed to calculate nutrition')
  }

  return res.json()
}
