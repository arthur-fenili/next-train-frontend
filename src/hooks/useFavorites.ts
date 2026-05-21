import { useState, useCallback } from 'react'
import { LineCode } from '../lines'

export interface Favorite {
  linha: LineCode
  stationCode: string
  stationName: string
}

const STORAGE_KEY = 'next-train-favorites'

function load(): Favorite[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(favs: Favorite[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>(load)

  const toggleFavorite = useCallback((linha: LineCode, stationCode: string, stationName: string) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.linha === linha && f.stationCode === stationCode)
      const next = exists
        ? prev.filter(f => !(f.linha === linha && f.stationCode === stationCode))
        : [...prev, { linha, stationCode, stationName }]
      save(next)
      return next
    })
  }, [])

  const isFavorite = useCallback((linha: LineCode, stationCode: string) => {
    return favorites.some(f => f.linha === linha && f.stationCode === stationCode)
  }, [favorites])

  return { favorites, toggleFavorite, isFavorite }
}
