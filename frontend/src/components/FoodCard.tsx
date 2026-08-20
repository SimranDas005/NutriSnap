import { useState } from 'react'
import PortionSelector from './PortionSelector'

interface Props {
  name: string
  confidence: number
  portion: 'small' | 'medium' | 'large'
  onNameChange: (name: string) => void
  onPortionChange: (portion: 'small' | 'medium' | 'large') => void
  onRemove: () => void
}

const confidenceColor = (c: number) => {
  if (c >= 0.85) return 'bg-emerald-100 text-emerald-700'
  if (c >= 0.6) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

const foodEmoji: Record<string, string> = {
  'chicken biryani': '🍗',
  'veg biryani': '🥬',
  'biryani': '🍚',
  'butter chicken': '🍛',
  'naan': '🫓',
  'roti': '🫓',
  'dal': '🥣',
  'rice': '🍚',
  'pulao': '🍚',
  'samosa': '🥟',
  'idli': '🥞',
  'dosa': '🥞',
  'paneer': '🧀',
  'chicken': '🍗',
  'egg': '🥚',
  'fish': '🐟',
  'curry': '🍛',
  'paratha': '🫓',
  'chole': '🥘',
  'pav bhaji': '🥘',
  'gulab jamun': '🍡',
  'jalebi': '🥨',
  'kheer': '🍮',
  'lassi': '🥤',
  'tikka': '🍗',
  'tandoori': '🔥',
}

function getEmoji(name: string): string {
  const lower = name.toLowerCase()
  for (const [key, emoji] of Object.entries(foodEmoji)) {
    if (lower.includes(key)) return emoji
  }
  return '🍽️'
}

export default function FoodCard({ name, confidence, portion, onNameChange, onPortionChange, onRemove }: Props) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={`
      bg-white rounded-xl p-4 shadow-sm transition-all duration-200
      ${focused ? 'ring-2 ring-emerald-400 shadow-md shadow-emerald-100/50' : 'border border-gray-100 hover:border-gray-200 hover:shadow-md'}
    `}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-base shrink-0 shadow-sm">
            {getEmoji(name)}
          </div>
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Enter food name"
              className="text-base font-bold text-gray-800 bg-transparent border-0 border-b-2 border-transparent focus:border-emerald-400 focus:ring-0 outline-none pb-0.5 placeholder-gray-300 transition-colors capitalize"
            />
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${confidenceColor(confidence)}`}>
                {Math.round(confidence * 100)}% confident
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="w-7 h-7 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 active:scale-90"
          aria-label="Remove food"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-wider">Portion size</p>
      <PortionSelector value={portion} onChange={onPortionChange} />
    </div>
  )
}
