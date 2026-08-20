import { useState, useCallback } from 'react'

interface Props {
  onImage: (file: File) => void
  loading: boolean
}

export default function UploadBox({ onImage, loading }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback((file: File | null) => {
    setError(null)
    if (!file) return

    const valid = ['image/jpeg', 'image/png']
    if (!valid.includes(file.type)) {
      setError('Please upload a JPG or PNG image.')
      return
    }

    setPreview(URL.createObjectURL(file))
    onImage(file)
  }, [onImage])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null)
  }, [handleFile])

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative overflow-hidden rounded-2xl p-10 text-center cursor-pointer transition-all duration-300
        ${dragging
          ? 'border-2 border-emerald-400 bg-emerald-50/60 scale-[1.02] shadow-lg shadow-emerald-100/50'
          : preview
            ? 'border-2 border-emerald-200 bg-white shadow-md'
            : 'border-2 border-dashed border-gray-300 bg-white/80 hover:border-emerald-400 hover:bg-emerald-50/30 hover:shadow-lg hover:shadow-emerald-100/50'
        }
        ${loading ? 'pointer-events-none opacity-60' : ''}
      `}
    >
      {/* Background decoration */}
      {!preview && !dragging && (
        <>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50/50 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-50/50 rounded-full" />
        </>
      )}

      {preview ? (
        <div className="space-y-4 animate-fade-in-up relative">
          <div className="relative rounded-xl overflow-hidden shadow-md">
            <img src={preview} alt="Preview" className="max-h-64 mx-auto object-cover w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className="text-[10px] font-semibold text-white/90 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider">
                Preview
              </span>
            </div>
          </div>
          {loading && (
            <div className="flex items-center justify-center gap-2.5 text-emerald-600 font-semibold bg-emerald-50/80 backdrop-blur-sm rounded-xl py-3 px-4 border border-emerald-100">
              <div className="w-5 h-5 border-[3px] border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
              Analyzing your meal...
            </div>
          )}
        </div>
      ) : (
        <label className="cursor-pointer block relative z-10">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center shadow-inner animate-float">
              <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.38-1.646 3.75 3.75 0 013.624 5.054A3.75 3.75 0 0118 19.5H6.75z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-700">
                Drop your meal photo here
              </p>
              <p className="text-sm text-gray-400 mt-1.5">
                or <span className="text-emerald-600 font-semibold underline underline-offset-4 decoration-emerald-300">browse files</span>
              </p>
            </div>
            <div className="flex justify-center gap-4 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                JPG
              </span>
              <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                PNG
              </span>
            </div>
          </div>
          <input type="file" accept=".jpg,.jpeg,.png" onChange={handleChange} className="hidden" disabled={loading} />
        </label>
      )}
      {error && (
        <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
          <p className="text-sm text-red-600 font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  )
}
