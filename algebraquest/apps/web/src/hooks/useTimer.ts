'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/store/game.store'

export function useTimer() {
  const status = useGameStore((s) => s.gameState.status)
  const tickTimer = useGameStore((s) => s.tickTimer)

  useEffect(() => {
    if (status !== 'playing') return

    const id = setInterval(() => {
      tickTimer()
    }, 1000)

    return () => clearInterval(id)
  }, [status, tickTimer])
}

