import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import UploadBox from '@/components/UploadBox'
import FoodCard from '@/components/FoodCard'
import LoadingScreen from '@/components/LoadingScreen'
import { analyzeImage } from '@/services/analyze'
import { calculateNutrition } from '@/services/nutrition'
import { FoodDetection, NutritionResponse } from '@/types'

type Step = 'upload' | 'loading' | 'review' | 'calculating' | 'done'

interface FoodItem {
  name: string
  confidence: number
  portion: 'small' | 'medium' | 'large'
}

const steps = [
  { key: 'upload', label: 'Upload' },
  { key: 'review', label: 'Review' },
  { key: 'results', label: 'Results' },
]

export default function Home() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('upload')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const currentStepIndex = step === 'upload' || step === 'loading' ? 0 : step === 'review' ? 1 : step === 'calculating' ? 1 : 2

  const handleImage = useCallback(async (file: File) => {
    setImageFile(file)
    setStep('loading')
    setError(null)

    try {
      const result = await analyzeImage(file)
      setFoods(
        result.foods.map((f: FoodDetection) => ({ ...f, portion: 'medium' }))
      )
      setStep('review')
    } catch (e: any) {
      setFoods([{ name: '', confidence: 1, portion: 'medium' }])
      setError(e?.message || 'Unable to analyze image')
      setStep('review')
    }
  }, [])

  const updateFood = useCallback((index: number, updates: Partial<FoodItem>) => {
    setFoods((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ...updates } : f))
    )
  }, [])

  const updatePortion = useCallback((index: number, portion: 'small' | 'medium' | 'large') => {
    updateFood(index, { portion })
  }, [updateFood])

  const removeFood = useCallback((index: number) => {
    setFoods((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const addFood = useCallback(() => {
    setFoods((prev) => [
      ...prev,
      { name: '', confidence: 1, portion: 'medium' },
    ])
  }, [])

  const handleContinue = useCallback(async () => {
    const valid = foods.filter((f) => f.name.trim())
    if (valid.length === 0) return

    setStep('calculating')

    try {
      const result: NutritionResponse = await calculateNutrition(
        valid.map((f) => ({ name: f.name, portion: f.portion as 'small' | 'medium' | 'large' }))
      )
      sessionStorage.setItem('nutrisnap_result', JSON.stringify(result))
      setStep('done')
      router.push('/results')
    } catch {
      alert('Failed to calculate nutrition. Please try again.')
      setStep('review')
    }
  }, [foods, router])

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
        <p className="text-gray-400 text-sm font-medium">Snap a photo. Know your meal.</p>
      </header>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-0 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className={`flex items-center gap-1.5 ${i <= currentStepIndex ? 'text-emerald-600' : 'text-gray-300'}`}>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${i < currentStepIndex
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200'
                  : i === currentStepIndex
                    ? 'bg-white text-emerald-600 border-2 border-emerald-500 shadow-md shadow-emerald-100'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }
              `}>
                {i < currentStepIndex ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={`text-xs font-semibold ${i === currentStepIndex ? 'text-gray-700' : i < currentStepIndex ? 'text-emerald-600' : 'text-gray-400'} hidden sm:inline`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-10 h-0.5 mx-1.5 rounded-full transition-all duration-500 ${i < currentStepIndex ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Upload / Loading */}
      {(step === 'upload' || step === 'loading') && (
        <div className="animate-fade-in-scale">
          <UploadBox onImage={handleImage} loading={step === 'loading'} />
        </div>
      )}

      {step === 'loading' && <LoadingScreen />}

      {/* Review */}
      {step === 'review' && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
            <h2 className="text-lg font-bold text-gray-800">Review & Portions</h2>
          </div>
          <p className="text-sm text-gray-400">Edit the detected foods and choose your portion size for each item.</p>

          {imageFile && (
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-100 group">
              <img src={URL.createObjectURL(imageFile)} alt="Meal" className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] font-semibold text-white/90 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Your meal photo
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl animate-fade-in">
              <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Could not auto-detect: {error}
              </p>
              <p className="text-xs text-amber-700 mt-1 ml-6">Enter the food name manually below.</p>
            </div>
          )}

          {foods.map((food, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <FoodCard
                name={food.name}
                confidence={food.confidence}
                portion={food.portion}
                onNameChange={(name) => updateFood(i, { name })}
                onPortionChange={(portion) => updatePortion(i, portion)}
                onRemove={() => removeFood(i)}
              />
            </div>
          ))}

          <button
            onClick={addFood}
            className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-emerald-400 hover:text-emerald-500 hover:bg-emerald-50/50 transition-all duration-200 font-semibold text-sm active:scale-[0.99]"
          >
            <span className="flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add another food
            </span>
          </button>

          <div className="pt-2">
            <button
              onClick={handleContinue}
              disabled={foods.filter((f) => f.name.trim()).length === 0}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-base hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Calculate Nutrition
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Calculating */}
      {step === 'calculating' && (
        <div className="flex flex-col items-center justify-center py-20 space-y-5 animate-fade-in-scale">
          <div className="relative">
            <div className="w-14 h-14 border-4 border-emerald-100 rounded-full" />
            <div className="absolute inset-0 w-14 h-14 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin" />
            <div className="absolute inset-0 w-14 h-14 border-4 border-transparent border-r-emerald-300 rounded-full animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }} />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-gray-700">Crunching the numbers...</p>
            <p className="text-sm text-gray-400 mt-0.5 font-medium">Looking up nutrition data</p>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
            <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>
      )}
    </main>
  )
}