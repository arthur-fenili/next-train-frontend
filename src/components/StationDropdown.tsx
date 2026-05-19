import { Station } from '../api'
import { LineConfig } from '../lines'

interface Props {
  stations: Station[]
  selected: string
  line: LineConfig
  loading: boolean
  onChange: (code: string) => void
}

export function StationDropdown({ stations, selected, line, loading, onChange }: Props) {
  const selectedStation = stations.find((s) => s.code === selected)

  return (
    <div className="animate-slide-up flex flex-col gap-3">
      <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 pl-1">
        Estação
      </label>

      <div className="relative">
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          className="w-full appearance-none rounded-xl px-4 py-4 pr-10 border text-base font-medium focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          style={{
            backgroundColor: '#1e2235',
            borderColor: selected ? line.color : 'rgba(255,255,255,0.1)',
            color: selected ? '#ffffff' : 'rgba(255,255,255,0.4)',
            colorScheme: 'dark',
            '--tw-ring-color': line.color,
          } as React.CSSProperties}
        >
          <option value="" disabled>Selecione uma estação...</option>
          {stations.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Chevron */}
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          {loading ? (
            <svg className="animate-spin h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              style={{ color: selected ? line.color : 'rgba(255,255,255,0.3)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      {/* Confirmação da estação selecionada */}
      {selectedStation && (
        <div
          className="animate-fade-in flex items-center gap-2 rounded-lg px-4 py-3"
          style={{ backgroundColor: `${line.color}18`, border: `1px solid ${line.color}40` }}
        >
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: line.color }} />
          <p className="text-sm text-white/70">
            Você está visualizando os próximos trens para a estação{' '}
            <span className="font-semibold text-white">{selectedStation.name}</span>
          </p>
        </div>
      )}
    </div>
  )
}
