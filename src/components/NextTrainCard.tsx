import { NextTrain } from '../api'
import { LineConfig } from '../lines'

interface Props {
  train: NextTrain
  line: LineConfig
  stationName: (code: string) => string
}

function urgencyColor(seconds: number): string {
  if (seconds < 90) return '#ef4444'   // vermelho — chegando
  if (seconds < 300) return '#f97316'  // laranja — menos de 5 min
  return '#22c55e'                      // verde — confortável
}

function formatCountdown(seconds: number): string {
  if (seconds < 60) return '< 1 min'
  const min = Math.round(seconds / 60)
  return `${min} min`
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, { label: string; dot: string }> = {
    plataforma:   { label: 'Na plataforma', dot: '#f97316' },
    deslocamento: { label: 'Em deslocamento', dot: '#60a5fa' },
  }
  const cfg = labels[status] ?? { label: status, dot: '#9ca3af' }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
      <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  )
}

export function NextTrainCard({ train, line, stationName }: Props) {
  const color      = urgencyColor(train.proximo_em_segundos)
  const originName = stationName(train.estacao_origem_trem)

  return (
    <div className="animate-slide-up rounded-2xl border border-white/8 bg-white/5 overflow-hidden">
      {/* Barra colorida no topo */}
      <div className="h-1 w-full" style={{ backgroundColor: line.color }} />

      <div className="p-5">
        {/* Sentido */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">Sentido</span>
          <span className="text-sm font-bold text-white truncate">{train.sentido}</span>
        </div>

        {/* Contagem principal */}
        <div className="flex items-end justify-between mb-4">
          <span
            className="text-5xl font-black tabular-nums leading-none"
            style={{ color }}
          >
            {formatCountdown(train.proximo_em_segundos)}
          </span>

          <div className="text-right">
            <p className="text-xs text-white/40 mb-0.5">Previsto</p>
            <p className="text-xl font-bold text-white/90 tabular-nums">
              {train.hora_previsto_chegada}
            </p>
          </div>
        </div>

        {/* Rodapé: status + posição atual do trem */}
        <div className="flex items-center justify-between pt-3 border-t border-white/8">
          <StatusBadge status={train.status} />
          {originName && (
            <span className="text-xs text-white/30 max-w-[60%] text-right">
              Trem na região de {originName}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
