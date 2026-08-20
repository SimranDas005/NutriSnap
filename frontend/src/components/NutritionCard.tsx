import { useState } from 'react'
import { NutritionItem, NutritionEntry } from '@/types'

interface Props {
  items: NutritionItem[]
  totals: NutritionEntry
}

function CalorieGauge({ calories, max = 2000 }: { calories: number; max?: number }) {
  const pct = Math.min((calories / max) * 100, 100)
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
        <circle cx="60" cy="60" r="54" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black tracking-tight">{Math.round(calories)}</span>
        <span className="text-sm font-medium text-emerald-100/80 uppercase tracking-widest mt-0.5">kcal</span>
      </div>
    </div>
  )
}

function NutrientTile({ label, value, unit, color, bg }: { label: string; value: number; unit: string; color: string; bg: string }) {
  return (
    <div className={`${bg} rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-white/20 backdrop-blur-sm`}>
      <span className="text-2xl font-black tracking-tight" style={{ color }}>{Math.round(value)}</span>
      <span className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color }}>{label}</span>
      <span className="text-[10px] opacity-60" style={{ color }}>{unit}</span>
    </div>
  )
}

function FoodBreakdownCard({ item, index }: { item: NutritionItem; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-sm shadow-sm">
            {index + 1}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm capitalize leading-tight">{item.name}</h3>
            <p className="text-[11px] text-gray-400 font-medium">{Math.round(item.calories)} kcal</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 text-xs text-gray-400">
            <span className="font-medium text-green-600">{Math.round(item.protein)}g P</span>
            <span className="font-medium text-amber-600">{Math.round(item.carbs)}g C</span>
            <span className="font-medium text-red-600">{Math.round(item.fat)}g F</span>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 animate-fade-in">
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-emerald-50 rounded-xl py-3 text-center">
              <p className="text-lg font-bold text-emerald-700">{Math.round(item.calories)}</p>
              <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">Calories</p>
              <p className="text-[9px] text-emerald-400">kcal</p>
            </div>
            <div className="bg-green-50 rounded-xl py-3 text-center">
              <p className="text-lg font-bold text-green-700">{Math.round(item.protein)}g</p>
              <p className="text-[10px] font-semibold text-green-500 uppercase tracking-wider">Protein</p>
              <p className="text-[9px] text-green-400">grams</p>
            </div>
            <div className="bg-amber-50 rounded-xl py-3 text-center">
              <p className="text-lg font-bold text-amber-700">{Math.round(item.carbs)}g</p>
              <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">Carbs</p>
              <p className="text-[9px] text-amber-400">grams</p>
            </div>
            <div className="bg-red-50 rounded-xl py-3 text-center">
              <p className="text-lg font-bold text-red-700">{Math.round(item.fat)}g</p>
              <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider">Fat</p>
              <p className="text-[9px] text-red-400">grams</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="bg-emerald-50 rounded-xl py-2 text-center">
              <p className="text-sm font-bold text-emerald-700">{Math.round(item.fiber)}g</p>
              <p className="text-[9px] font-semibold text-emerald-500 uppercase tracking-wider">Fiber</p>
            </div>
            <div className="bg-amber-50 rounded-xl py-2 text-center">
              <p className="text-sm font-bold text-amber-700">{Math.round(item.sugar)}g</p>
              <p className="text-[9px] font-semibold text-amber-500 uppercase tracking-wider">Sugar</p>
            </div>
            <div className="bg-red-50 rounded-xl py-2 text-center">
              <p className="text-sm font-bold text-red-700">{Math.round(item.sodium)}mg</p>
              <p className="text-[9px] font-semibold text-red-500 uppercase tracking-wider">Sodium</p>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            <div className="bg-orange-50 rounded-xl py-2 text-center">
              <p className="text-sm font-bold text-orange-700">{Math.round(item.vitamin_a)}µg</p>
              <p className="text-[9px] font-semibold text-orange-500 uppercase tracking-wider">Vit A</p>
            </div>
            <div className="bg-yellow-50 rounded-xl py-2 text-center">
              <p className="text-sm font-bold text-yellow-700">{Math.round(item.vitamin_c)}mg</p>
              <p className="text-[9px] font-semibold text-yellow-500 uppercase tracking-wider">Vit C</p>
            </div>
            <div className="bg-sky-50 rounded-xl py-2 text-center">
              <p className="text-sm font-bold text-sky-700">{Math.round(item.calcium)}mg</p>
              <p className="text-[9px] font-semibold text-sky-500 uppercase tracking-wider">Calcium</p>
            </div>
            <div className="bg-purple-50 rounded-xl py-2 text-center">
              <p className="text-sm font-bold text-purple-700">{Math.round(item.iron)}mg</p>
              <p className="text-[9px] font-semibold text-purple-500 uppercase tracking-wider">Iron</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-gray-500">
            <div className="flex justify-between px-3 py-1.5 bg-gray-50 rounded-lg">
              <span className="font-medium">Calorie share</span>
              <span className="font-bold text-gray-700">{Math.round(item.calories / Math.max(1, item.calories) * 100)}%</span>
            </div>
            <div className="flex justify-between px-3 py-1.5 bg-gray-50 rounded-lg">
              <span className="font-medium">Protein ratio</span>
              <span className="font-bold text-gray-700">{Math.round(item.protein * 4 / Math.max(1, item.calories) * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function NutritionCard({ items, totals }: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false)

  return (
    <div className="space-y-5">
      {/* Hero: Total Calories */}
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-3xl p-6 shadow-xl shadow-emerald-200/50 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-xs font-semibold text-emerald-100/80 uppercase tracking-[0.2em] text-center mb-1">Total Calories</p>
          <CalorieGauge calories={totals.calories} />
          <div className="grid grid-cols-3 gap-3 mt-5">
            <NutrientTile label="Protein" value={totals.protein} unit="grams" color="#22c55e" bg="bg-white/10" />
            <NutrientTile label="Carbs" value={totals.carbs} unit="grams" color="#facc15" bg="bg-white/10" />
            <NutrientTile label="Fat" value={totals.fat} unit="grams" color="#ef4444" bg="bg-white/10" />
          </div>
        </div>
      </div>

      {/* Macro Distribution Summary */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Macronutrient Distribution</p>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Protein', value: totals.protein, color: 'bg-green-500', textColor: 'text-green-700', pct: Math.round(totals.protein * 4 / Math.max(1, totals.calories) * 100) },
            { label: 'Carbohydrates', value: totals.carbs, color: 'bg-amber-500', textColor: 'text-amber-700', pct: Math.round(totals.carbs * 4 / Math.max(1, totals.calories) * 100) },
            { label: 'Fat', value: totals.fat, color: 'bg-red-500', textColor: 'text-red-700', pct: Math.round(totals.fat * 9 / Math.max(1, totals.calories) * 100) },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${m.color}`} />
              <span className="text-xs font-semibold text-gray-600 w-24">{m.label}</span>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${m.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${m.pct}%` }}
                />
              </div>
              <span className={`text-xs font-bold w-14 text-right ${m.textColor}`}>{Math.round(m.value)}g</span>
              <span className="text-[11px] text-gray-400 w-10 text-right">{m.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Nutrients */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detailed Nutrients</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Fiber', value: totals.fiber, unit: 'g', color: 'text-emerald-700', bg: 'bg-emerald-50' },
            { label: 'Sugar', value: totals.sugar, unit: 'g', color: 'text-amber-700', bg: 'bg-amber-50' },
            { label: 'Sodium', value: totals.sodium, unit: 'mg', color: 'text-red-700', bg: 'bg-red-50' },
            { label: 'Vitamin A', value: totals.vitamin_a, unit: 'µg', color: 'text-orange-700', bg: 'bg-orange-50' },
            { label: 'Vitamin C', value: totals.vitamin_c, unit: 'mg', color: 'text-yellow-700', bg: 'bg-yellow-50' },
            { label: 'Calcium', value: totals.calcium, unit: 'mg', color: 'text-sky-700', bg: 'bg-sky-50' },
            { label: 'Iron', value: totals.iron, unit: 'mg', color: 'text-purple-700', bg: 'bg-purple-50' },
          ].map((n) => (
            <div key={n.label} className={`${n.bg} rounded-xl p-3`}>
              <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60" style={{ color: n.color }}>{n.label}</p>
              <p className="text-lg font-black" style={{ color: n.color }}>{Math.round(n.value)}<span className="text-xs font-semibold ml-0.5">{n.unit}</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* Nutri Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Nutri Breakdown
            </span>
            <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showBreakdown ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showBreakdown && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-2.5">
            {items.map((item, i) => (
              <FoodBreakdownCard key={i} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
