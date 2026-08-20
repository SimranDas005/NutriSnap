export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-emerald-100 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-emerald-300 rounded-full animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }} />
      </div>
      <div className="text-center space-y-1.5">
        <p className="text-lg font-bold text-gray-700">Analyzing your meal...</p>
        <p className="text-sm text-gray-400 font-medium">Identifying dishes and estimating portions</p>
      </div>
      <div className="flex gap-1.5">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
        <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  )
}
