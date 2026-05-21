import { useEffect, useRef, useState } from 'react'
import { Station } from '../api'
import { LineCode, LineConfig } from '../lines'

interface Props {
  stations: Station[]
  selected: string
  line: LineConfig
  loading: boolean
  onChange: (code: string) => void
  isFavorite: (linha: LineCode, code: string) => boolean
  onToggleFavorite: (linha: LineCode, code: string, name: string) => void
}

function StarIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? color : 'none'}
      stroke={filled ? color : 'currentColor'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export function StationDropdown({
  stations, selected, line, loading,
  onChange, isFavorite, onToggleFavorite,
}: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const selectedStation = stations.find(s => s.code === selected)

  // fecha ao clicar fora
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // scroll para o item selecionado ao abrir
  useEffect(() => {
    if (!open || !selected || !listRef.current) return
    const el = listRef.current.querySelector(`[data-code="${selected}"]`) as HTMLElement | null
    el?.scrollIntoView({ block: 'nearest' })
  }, [open, selected])

  const handleSelect = (code: string) => {
    onChange(code)
    setOpen(false)
  }

  return (
    <div className="animate-slide-up flex flex-col gap-3">
      <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 pl-1">
        Estação
      </label>

      <div ref={containerRef} className="relative">
        {/* Botão trigger */}
        <button
          type="button"
          onClick={() => !loading && setOpen(o => !o)}
          disabled={loading}
          className="w-full flex items-center justify-between px-4 py-4 rounded-xl border text-base font-medium focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 text-left"
          style={{
            backgroundColor: '#1e2235',
            borderColor: selected ? line.color : 'rgba(255,255,255,0.1)',
            color: selected ? '#ffffff' : 'rgba(255,255,255,0.4)',
            // @ts-expect-error css var
            '--tw-ring-color': line.color,
          }}
        >
          <span className="truncate">
            {selectedStation?.name ?? 'Selecione uma estação...'}
          </span>

          {/* ícone direita */}
          <span className="ml-3 flex-shrink-0">
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <svg
                className={`h-4 w-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: selected ? line.color : 'rgba(255,255,255,0.3)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </span>
        </button>

        {/* Lista flutuante */}
        {open && (
          <div
            ref={listRef}
            className="absolute z-30 w-full mt-1 rounded-xl border overflow-y-auto"
            style={{
              backgroundColor: '#1e2235',
              borderColor: 'rgba(255,255,255,0.1)',
              maxHeight: '15rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {stations.map(s => {
              const favorited = isFavorite(line.code as LineCode, s.code)
              const isSelected = s.code === selected
              return (
                <div
                  key={s.code}
                  data-code={s.code}
                  className="flex items-center group"
                  style={isSelected ? { backgroundColor: `${line.color}20` } : undefined}
                >
                  {/* nome da estação */}
                  <button
                    type="button"
                    onClick={() => handleSelect(s.code)}
                    className="flex-1 text-left px-4 py-3 text-sm transition-colors hover:bg-white/5"
                    style={{ color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)' }}
                  >
                    {s.name}
                  </button>

                  {/* estrela */}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      onToggleFavorite(line.code as LineCode, s.code, s.name)
                    }}
                    className="px-3 py-3 transition-opacity"
                    style={{ opacity: favorited ? 1 : 0.3 }}
                    title={favorited ? 'Remover favorito' : 'Adicionar favorito'}
                  >
                    <StarIcon filled={favorited} color={line.color} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
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
