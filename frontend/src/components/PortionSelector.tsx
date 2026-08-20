interface Props {
  value: 'small' | 'medium' | 'large'
  onChange: (value: 'small' | 'medium' | 'large') => void
}

const portions: { value: 'small' | 'medium' | 'large'; label: string; icon: string; desc: string }[] = [
  { value: 'small', label: 'Small', icon: '◐', desc: 'Light meal' },
  { value: 'medium', label: 'Medium', icon: '◑', desc: 'Regular' },
  { value: 'large', label: 'Large', icon: '◉', desc: 'Heavy meal' },
]

export default function PortionSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-1.5">
      {portions.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`
            flex-1 flex flex-col items-center py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200
            ${value === p.value
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200/50 scale-[1.02]'
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-100'
            }
          `}
        >
          <span className="text-base leading-none mb-1">{p.icon}</span>
          <span className="font-bold">{p.label}</span>
          <span className="text-[9px] opacity-70 mt-0.5">{p.desc}</span>
        </button>
      ))}
    </div>
  )
}
