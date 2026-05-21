import { Favorite } from '../hooks/useFavorites'
import { LINE_MAP, LineCode } from '../lines'

interface Props {
  favorites: Favorite[]
  onSelect: (linha: LineCode, stationCode: string) => void
  onRemove: (linha: LineCode, stationCode: string) => void
}

export function FavoritesBar({ favorites, onSelect, onRemove }: Props) {
  if (favorites.length === 0) return null

  return (
    <section className="animate-slide-up">
      <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-3 pl-1">
        Favoritos
      </label>
      <div className="flex flex-wrap gap-2">
        {favorites.map(fav => {
          const line = LINE_MAP[fav.linha]
          return (
            <div
              key={`${fav.linha}-${fav.stationCode}`}
              className="flex items-center rounded-full border transition-colors"
              style={{ borderColor: `${line.color}50`, backgroundColor: `${line.color}15` }}
            >
              {/* chip — seleciona linha + estação */}
              <button
                onClick={() => onSelect(fav.linha, fav.stationCode)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 hover:opacity-80 transition-opacity"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: line.color }}
                />
                <span className="text-sm font-medium text-white/80 leading-none">
                  {fav.stationName}
                </span>
                <span
                  className="text-[10px] font-bold px-1 py-0.5 rounded"
                  style={{ backgroundColor: `${line.color}30`, color: line.colorLight }}
                >
                  L{line.number}
                </span>
              </button>

              {/* remover favorito */}
              <button
                onClick={() => onRemove(fav.linha, fav.stationCode)}
                className="pr-2.5 pl-0.5 py-1.5 text-white/25 hover:text-white/60 transition-colors text-xs leading-none"
                title="Remover favorito"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
