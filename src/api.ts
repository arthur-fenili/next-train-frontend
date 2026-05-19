const BFF = import.meta.env.VITE_BFF_URL ?? ''

export interface Station {
  code: string
  name: string
}

export interface NextTrain {
  linha: string
  estacao_origem: string
  estacao_destino: string
  estacao_origem_trem: string
  sentido: string
  proximo_em_segundos: number
  proximo_em_minutos: number
  hora_previsto_chegada: string
  atualizado_em: string
  status: string
}

export async function fetchStations(linha: string): Promise<Station[]> {
  const res = await fetch(`${BFF}/lines/${linha}/stations`)
  if (!res.ok) throw new Error(`Erro ${res.status}`)
  return res.json()
}

export async function fetchNextTrains(linha: string, estacao: string): Promise<NextTrain[]> {
  const res = await fetch(`${BFF}/lines/${linha}/stations/${estacao}/next-train`)
  if (!res.ok) throw new Error(`Erro ${res.status}`)
  return res.json()
}
