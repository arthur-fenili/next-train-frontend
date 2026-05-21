import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchNextTrains, fetchStations, NextTrain, Station } from './api'
import { FavoritesBar } from './components/FavoritesBar'
import { LineSelector } from './components/LineSelector'
import { NextTrainCard } from './components/NextTrainCard'
import { StationDropdown } from './components/StationDropdown'
import { useFavorites } from './hooks/useFavorites'
import { LINE_MAP, LineCode } from './lines'

const REFRESH_INTERVAL = 30_000

function TrainIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 2C8 2 5 4 5 7v10a2 2 0 002 2h1l-1 2h8l-1-2h1a2 2 0 002-2V7c0-3-3-5-7-5z" />
      <circle cx="8.5" cy="14.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="14.5" r="1.5" fill="currentColor" stroke="none" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 10h14" />
    </svg>
  )
}

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform ${spinning ? 'animate-spin' : ''}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 4v5h.582M20 20v-5h-.581M4.582 9A8 8 0 0120 15M19.418 15A8 8 0 014 9" />
    </svg>
  )
}

export default function App() {
  const [selectedLine, setSelectedLine]       = useState<LineCode | null>(null)
  const [stations, setStations]               = useState<Station[]>([])
  const [selectedStation, setSelectedStation] = useState('')
  const [trains, setTrains]                   = useState<NextTrain[]>([])
  const [loadingStations, setLoadingStations] = useState(false)
  const [loadingTrains, setLoadingTrains]     = useState(false)
  const [refreshing, setRefreshing]           = useState(false)
  const [error, setError]                     = useState<string | null>(null)
  const [lastUpdated, setLastUpdated]         = useState<Date | null>(null)

  const intervalRef      = useRef<ReturnType<typeof setInterval> | null>(null)
  // estação a selecionar após a troca de linha via chip de favorito
  const pendingStationRef = useRef<string | null>(null)

  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  const stationMap  = Object.fromEntries(stations.map(s => [s.code, s.name]))
  const stationName = useCallback((code: string) => stationMap[code] ?? code, [stations])
  const lineConfig  = selectedLine ? LINE_MAP[selectedLine] : null

  // Busca estações ao trocar de linha
  useEffect(() => {
    if (!selectedLine) return
    setStations([])
    setSelectedStation('')
    setTrains([])
    setError(null)
    setLoadingStations(true)
    fetchStations(selectedLine)
      .then(data => {
        setStations(data)
        // seleciona estação pendente (vinda de chip de favorito)
        if (pendingStationRef.current) {
          setSelectedStation(pendingStationRef.current)
          pendingStationRef.current = null
        }
      })
      .catch(() => setError('Não foi possível carregar as estações.'))
      .finally(() => setLoadingStations(false))
  }, [selectedLine])

  // Busca trens
  const loadTrains = useCallback(async (isRefresh = false) => {
    if (!selectedLine || !selectedStation) return
    isRefresh ? setRefreshing(true) : setLoadingTrains(true)
    setError(null)
    try {
      const data = await fetchNextTrains(selectedLine, selectedStation)
      setTrains(data)
      setLastUpdated(new Date())
    } catch {
      setError('Não foi possível buscar os próximos trens.')
    } finally {
      setLoadingTrains(false)
      setRefreshing(false)
    }
  }, [selectedLine, selectedStation])

  // Polling ao selecionar estação
  useEffect(() => {
    if (!selectedStation) {
      setTrains([])
      setLastUpdated(null)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    loadTrains()
    intervalRef.current = setInterval(() => loadTrains(true), REFRESH_INTERVAL)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [selectedStation, loadTrains])

  const handleLineChange = (code: LineCode) => {
    setSelectedLine(code)
    setTrains([])
    setLastUpdated(null)
    setError(null)
  }

  // Seleção via chip de favorito — pode exigir troca de linha
  const handleFavoriteSelect = (linha: LineCode, stationCode: string) => {
    if (linha !== selectedLine) {
      pendingStationRef.current = stationCode
      handleLineChange(linha)
    } else {
      setSelectedStation(stationCode)
    }
  }

  return (
    <div className="min-h-full flex flex-col">
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-4 py-4 flex items-center gap-3 transition-colors duration-300"
        style={{
          backgroundColor: lineConfig ? `${lineConfig.colorDark}dd` : '#0f1117ee',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: lineConfig?.color ?? 'rgba(255,255,255,0.1)' }}
        >
          <TrainIcon />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-white leading-tight">Next Train - Centralizer</h1>
          <p className="text-xs text-white/40 leading-tight">Via Mobilidade - Linhas 8 e 9</p>
        </div>
        {selectedStation && (
          <button
            onClick={() => loadTrains(true)}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            title="Atualizar"
          >
            <RefreshIcon spinning={refreshing} />
          </button>
        )}
      </header>

      {/* Conteúdo */}
      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full flex flex-col gap-6">

        {/* Seletor de linha */}
        <section>
          <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-3 pl-1">
            Linha
          </label>
          <LineSelector selected={selectedLine} onChange={handleLineChange} />
        </section>

        {/* Favoritos — aparece entre linha e dropdown quando há pelo menos um */}
        <FavoritesBar
          favorites={favorites}
          onSelect={handleFavoriteSelect}
          onRemove={(linha, code) => {
            const name = favorites.find(f => f.linha === linha && f.stationCode === code)?.stationName ?? code
            toggleFavorite(linha, code, name)
          }}
        />

        {/* Seletor de estação */}
        {selectedLine && (
          <section>
            <StationDropdown
              stations={stations}
              selected={selectedStation}
              line={lineConfig!}
              loading={loadingStations}
              onChange={setSelectedStation}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          </section>
        )}

        {/* Resultado */}
        {selectedStation && (
          <section className="flex flex-col gap-3">
            {loadingTrains && (
              <div className="flex items-center justify-center py-12 gap-3 text-white/30">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-sm">Buscando horários...</span>
              </div>
            )}

            {error && !loadingTrains && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-center">
                <p className="text-red-400 text-sm font-medium">{error}</p>
                <button
                  onClick={() => loadTrains()}
                  className="mt-3 text-xs text-red-400/70 underline underline-offset-2"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!loadingTrains && !error && trains.length === 0 && (
              <div className="rounded-2xl border border-white/8 bg-white/5 p-8 text-center">
                <p className="text-white/40 text-sm">Nenhum trem previsto no momento.</p>
                <p className="text-white/25 text-xs mt-1">A linha pode estar fora do horário de operação.</p>
              </div>
            )}

            {!loadingTrains && trains.map((train, i) => (
              <NextTrainCard
                key={`${train.estacao_destino}-${i}`}
                train={train}
                line={lineConfig!}
                stationName={stationName}
              />
            ))}

            {lastUpdated && !loadingTrains && (
              <p className="text-center text-xs text-white/20 mt-1">
                Atualizado às {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                {' '}· atualiza a cada 30s
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
