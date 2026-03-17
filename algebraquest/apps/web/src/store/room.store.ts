'use client'

import { create } from 'zustand'
import type { Difficulty, LeaderboardEntry, RoomConfig, TopicKey } from '@algebraquest/shared'
import { api, type RankedServerEntry } from '@/lib/api'
import { usePlayerStore } from './player.store'

type RoomStore = {
  currentRoomId: string | null
  roomConfig: RoomConfig | null
  leaderboard: RankedServerEntry[]
  isLoadingLeaderboard: boolean

  createRoom: (difficulty: Difficulty, topics: TopicKey[]) => Promise<string>
  loadRoom: (roomId: string) => Promise<RoomConfig>
  submitScore: (roomId: string, entry: Omit<LeaderboardEntry, 'timestamp'>) => Promise<{ rank: number }>
  fetchLeaderboard: (roomId: string) => Promise<void>
}

export const useRoomStore = create<RoomStore>((set) => ({
  currentRoomId: null,
  roomConfig: null,
  leaderboard: [],
  isLoadingLeaderboard: false,

  createRoom: async (difficulty, topics) => {
    const result = await api.rooms.create(difficulty, topics)
    set({ currentRoomId: result.roomId })
    return result.roomId
  },

  loadRoom: async (roomId) => {
    const result = await api.rooms.get(roomId)
    set({ currentRoomId: roomId, roomConfig: result.config })
    return result.config
  },

  submitScore: async (roomId, entry) => {
    const player = usePlayerStore.getState().player
    if (!player) throw new Error('PLAYER_NOT_SET')
    const result = await api.rooms.submitScore(roomId, {
      ...entry,
      playerId: player.id,
    })
    return { rank: result.rank }
  },

  fetchLeaderboard: async (roomId) => {
    set({ isLoadingLeaderboard: true })
    try {
      const entries = await api.rooms.getLeaderboard(roomId)
      set({ leaderboard: entries })
    } finally {
      set({ isLoadingLeaderboard: false })
    }
  },
}))

