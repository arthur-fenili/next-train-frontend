import { LINES, LineCode, LineConfig } from '../lines'

interface Props {
  selected: LineCode | null
  onChange: (code: LineCode) => void
}

function LineCard({ line, selected, onClick }: { line: LineConfig; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 relative flex flex-col items-center gap-3 rounded-2xl p-5
        border-2 transition-all duration-200 active:scale-95 cursor-pointer
        ${selected
          ? 'border-transparent shadow-lg scale-[1.02]'
          : 'border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20'
        }
      `}
      style={selected ? { backgroundColor: line.color, boxShadow: `0 8px 32px ${line.color}55` } : {}}
    >
      {/* Número em círculo */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow-inner"
        style={{
          backgroundColor: selected ? 'rgba(0,0,0,0.2)' : line.color,
          color: 'white',
        }}
      >
        {line.number}
      </div>

      <div className="text-center">
        <p className={`text-xs font-medium uppercase tracking-widest ${selected ? 'text-white/70' : 'text-white/50'}`}>
          Linha
        </p>
        <p className={`text-base font-semibold ${selected ? 'text-white' : 'text-white/80'}`}>
          {line.name}
        </p>
      </div>

      {selected && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/80" />
      )}
    </button>
  )
}

export function LineSelector({ selected, onChange }: Props) {
  return (
    <div className="flex gap-3">
      {LINES.map((line) => (
        <LineCard
          key={line.code}
          line={line}
          selected={selected === line.code}
          onClick={() => onChange(line.code)}
        />
      ))}
    </div>
  )
}
