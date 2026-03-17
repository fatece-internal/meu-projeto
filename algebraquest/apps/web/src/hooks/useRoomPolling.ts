'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRoomStore } from '@/store/room.store'
import { useGameStore } from '@/store/game.store'

export function useRoomPolling(roomId: string | null) {
  const status = useGameStore((s) => s.gameState.status)
  const fetchLeaderboard = useRoomStore((s) => s.fetchLeaderboard)
  const [countdown, setCountdown] = useState(10)

  const active = useMemo(() => Boolean(roomId) && status === 'game_over', [roomId, status])

  useEffect(() => {
    if (!active || !roomId) return
    setCountdown(10)

    const interval = window.setInterval(() => {
      setCountdown((c) => (c <= 1 ? 10 : c - 1))
    }, 1000)

    const poll = window.setInterval(() => {
      void fetchLeaderboard(roomId)
    }, 10000)

    void fetchLeaderboard(roomId)

    return () => {
      window.clearInterval(interval)
      window.clearInterval(poll)
    }
  }, [active, roomId, fetchLeaderboard])

  return { isActive: active, countdown }
}

