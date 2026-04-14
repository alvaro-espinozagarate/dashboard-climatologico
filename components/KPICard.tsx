interface Props {
  label:   string
  value:   string
  sub:     string
  danger?: boolean
  warn?:   boolean
}

export function KPICard({ label, value, sub, danger, warn }: Props) {
  const bg    = danger ? "bg-red-50 border-red-200"    : warn ? "bg-amber-50 border-amber-200"    : "bg-white border-gray-200"
  const color = danger ? "text-red-600"                : warn ? "text-amber-600"                  : "text-gray-900"

  return (
    <div className={`rounded-xl p-4 border ${bg}`}>
      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-medium ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  )
}
