import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import UploadBox from '@/components/UploadBox'
import LoadingScreen from '@/components/LoadingScreen'
import { analyzeImage } from '@/services/analyze'
import { calculateNutrition } from '@/services/nutrition'
import { AnalyzeResponse, NutritionResponse } from '@/types'

type Step = 'upload' | 'loading' | 'weight' | 'calculating' | 'done'

const steps = [
  { key: 'upload', label: 'Upload' },
  { key: 'results', label: 'Results' },
]

export default function Home() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('upload')
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [dish, setDish] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const currentStepIndex = step === 'upload' || step === 'loading' ? 0 : 1

  const handleImage = useCallback(async (file: File) => {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    setObjectUrl(URL.createObjectURL(file))
    setWeight('')
    setStep('loading')
    setError(null)

    try {
      const detected: AnalyzeResponse = await analyzeImage(file)
      if (!detected.dish || detected.parts.length === 0) {
        throw new Error('Could not identify the dish. Please try another photo.')
      }
      setDish(detected.dish)
      sessionStorage.setItem('nutrisnap_parts', JSON.stringify(detected))
      setStep('weight')
    } catch (e: any) {
      setError(e?.message || 'Unable to analyze image')
      setStep('upload')
    }
  }, [objectUrl])

  const handleCalculate = useCallback(async () => {
    const grams = parseFloat(weight)
    if (!grams || grams <= 0) {
      setError('Please enter the dish weight in grams.')
      return
    }
    setError(null)
    setStep('calculating')

    try {
      const detectedParts: AnalyzeResponse = JSON.parse(sessionStorage.getItem('nutrisnap_parts') || 'null')
      if (!detectedParts) {
        throw new Error('Detection data missing. Please re-upload the photo.')
      }

      const result: NutritionResponse = await calculateNutrition({
        dish,
        weight_grams: grams,
        foods: detectedParts.parts.map((p) => ({
          name: p.name,
        })),
      })

      sessionStorage.setItem('nutrisnap_dish', dish)
      sessionStorage.setItem('nutrisnap_weight', String(grams))
      sessionStorage.setItem('nutrisnap_result', JSON.stringify(result))
      setStep('done')
      router.push('/results')
    } catch (e: any) {
      setError(e?.message || 'Unable to calculate nutrition')
      setStep('weight')
    }
  }, [dish, weight, router])

  const handleBackToUpload = useCallback(() => {
    setStep('upload')
    setDish('')
    setWeight('')
    setError(null)
  }, [])

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

      {error && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl animate-fade-in">
          <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
          <p className="text-xs text-amber-700 mt-1 ml-6">Try uploading a different photo.</p>
        </div>
      )}

      {/* Upload / Loading */}
      {(step === 'upload' || step === 'loading') && (
        <div className="animate-fade-in-scale">
          <UploadBox onImage={handleImage} loading={step === 'loading'} />
        </div>
      )}

      {step === 'loading' && <LoadingScreen />}

      {/* Weight input */}
      {step === 'weight' && (
        <div className="animate-fade-in-scale">
          {objectUrl && (
            <img
              src={objectUrl}
              alt="Uploaded dish"
              className="w-full h-52 object-cover rounded-2xl shadow-lg shadow-gray-200/70 mb-6"
            />
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-extrabold text-gray-800">{dish}</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Enter the total weight of the dish so we can estimate its nutrients.
            </p>

            <div className="mt-5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Dish weight
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 350"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-base font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder:text-gray-300"
                />
                <span className="text-sm font-bold text-gray-400">grams</span>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200/60 hover:shadow-xl hover:shadow-emerald-200/70 transition-all duration-200 active:scale-[0.98]"
            >
              Calculate Nutrition
            </button>

            <button
              onClick={handleBackToUpload}
              className="mt-3 w-full text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Use a different photo
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
