import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NutritionCard from '@/components/NutritionCard'
import { NutritionResponse } from '@/types'

export default function Results() {
  const router = useRouter()
  const [data, setData] = useState<NutritionResponse | null>(null)
  const [dish, setDish] = useState<string>('')
  const [weight, setWeight] = useState<string>('')

  useEffect(() => {
    const raw = sessionStorage.getItem('nutrisnap_result')
    if (!raw) {
      router.replace('/')
      return
    }
    setData(JSON.parse(raw))
    setDish(sessionStorage.getItem('nutrisnap_dish') || '')
    setWeight(sessionStorage.getItem('nutrisnap_weight') || '')
  }, [router])

  if (!data) return null

  return (
    <main className="min-h-screen max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-8 animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
            <span className="text-white font-black text-lg">N</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">NutriSnap</h1>
        </div>
        {dish && (
          <h2 className="text-3xl font-black text-gray-900 capitalize mt-3">{dish}</h2>
        )}
        {weight && (
          <p className="text-sm text-gray-400 font-semibold mt-1.5">{weight} g total</p>
        )}
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 animate-pulse" />
          <p className="text-sm text-gray-400 font-medium">Your complete meal breakdown</p>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {data.items.map((item, i) => (
            <span key={i} className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm capitalize">
              {item.name}
            </span>
          ))}
        </div>
      </header>

      {/* Nutrition Card */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <NutritionCard items={data.items} totals={data.totals} />
      </div>

      {/* Action buttons */}
      <div className="mt-8 space-y-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={() => {
            sessionStorage.removeItem('nutrisnap_result')
            router.push('/')
          }}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-base hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 active:scale-[0.98]"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Analyze another meal
          </span>
        </button>

        <button
          onClick={() => {
            sessionStorage.removeItem('nutrisnap_result')
            router.push('/')
          }}
          className="w-full py-2.5 bg-white text-gray-500 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 active:scale-[0.98]"
        >
          Start over
        </button>
      </div>
    </main>
  )
}
