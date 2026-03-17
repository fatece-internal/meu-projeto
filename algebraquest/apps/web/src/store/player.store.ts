'use client'

import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { Player } from '@algebraquest/shared'

type PlayerState = {
  player: Player | null
  setPlayer: (name: string) => void
  loadPlayer: () => void
  clearPlayer: () => void
}

const STORAGE_KEY = 'aq_player'

export const usePlayerStore = create<PlayerState>((set) => ({
  player: null,

  setPlayer: (name) => {
    if (typeof window === 'undefined') return
    const trimmed = name.trim()
    const existing = window.localStorage.getItem(STORAGE_KEY)
    const existingId =
      existing && (() => {
        try {
          const parsed = JSON.parse(existing) as { id?: string }
          return typeof parsed.id === 'string' ? parsed.id : undefined
        } catch {
          return undefined
        }
      })()
    const id = existingId ?? nanoid()
    const player: Player = { id, name: trimmed }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(player))
    set({ player })
  },

  loadPlayer: () => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as Player
      if (parsed && typeof parsed.id === 'string' && typeof parsed.name === 'string') {
        set({ player: parsed })
      }
    } catch {
      // ignore
    }
  },

  clearPlayer: () => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY)
    set({ player: null })
  },
}))

