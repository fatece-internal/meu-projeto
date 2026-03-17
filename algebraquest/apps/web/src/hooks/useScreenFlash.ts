'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/game.store'

export function useScreenFlash(): { flash: boolean; color: 'green' | 'red' | null } {
  const last = useGameStore((s) => s.gameState.lastAnswerCorrect)
  const [flash, setFlash] = useState(false)
  const [color, setColor] = useState<'green' | 'red' | null>(null)

  useEffect(() => {
    if (last === null) return
    setColor(last ? 'green' : 'red')
    setFlash(true)
    const t = window.setTimeout(() => setFlash(false), 600)
    return () => window.clearTimeout(t)
  }, [last])

  return { flash, color }
}

