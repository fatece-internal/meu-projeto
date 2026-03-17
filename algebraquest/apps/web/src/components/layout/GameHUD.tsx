'use client'

import type { Difficulty } from '@algebraquest/shared'
import { DIFFICULTY_CONFIG } from '@algebraquest/shared'
import { LivesDisplay } from '@/components/game/LivesDisplay'
import { ScoreDisplay } from '@/components/game/ScoreDisplay'
import { TimerCircle } from '@/components/game/TimerCircle'

export function GameHUD({
  lives,
  score,
  timeLeft,
  difficulty,
}: {
  lives: number
  score: number
  timeLeft: number
  difficulty: Difficulty
}) {
  const maxTime = DIFFICULTY_CONFIG[difficulty].timeLimit

  return (
    <div className="fixed inset-x-0 top-0 z-20 border-b border-game-border/60 bg-game-base/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <LivesDisplay lives={lives} />
        <ScoreDisplay score={score} />
        <TimerCircle timeLeft={timeLeft} maxTime={maxTime} />
      </div>
    </div>
  )
}

