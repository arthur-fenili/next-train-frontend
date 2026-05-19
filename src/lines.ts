export type LineCode = 'L8' | 'L9'

export interface LineConfig {
  code: LineCode
  number: string
  name: string
  fullName: string
  color: string
  colorDark: string
  colorLight: string
}

export const LINES: LineConfig[] = [
  {
    code: 'L8',
    number: '8',
    name: 'Diamante',
    fullName: 'Linha 8 — Diamante',
    color: '#949488',
    colorDark: '#6b6b60',
    colorLight: '#c4c4b8',
  },
  {
    code: 'L9',
    number: '9',
    name: 'Esmeralda',
    fullName: 'Linha 9 — Esmeralda',
    color: '#219896',
    colorDark: '#186d6b',
    colorLight: '#3abfbd',
  },
]

export const LINE_MAP = Object.fromEntries(LINES.map((l) => [l.code, l])) as Record<LineCode, LineConfig>
