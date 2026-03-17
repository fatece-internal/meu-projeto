'use client'

import type { Difficulty } from '@algebraquest/shared'
import { DIFFICULTY_CONFIG } from '@algebraquest/shared'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { cn } from '@/lib/utils'

export function DifficultyCard({
  difficulty,
  selected,
  onSelect,
}: {
  difficulty: Difficulty
  selected: boolean
  onSelect: (d: Difficulty) => void
}) {
  const cfg = DIFFICULTY_CONFIG[difficulty]
  const tone =
    difficulty === 'easy'
      ? 'border-game-green/40'
      : difficulty === 'medium'
        ? 'border-game-yellow/40'
        : 'border-game-red/40'

  const glow =
    difficulty === 'easy'
      ? 'shadow-green'
      : difficulty === 'medium'
        ? 'shadow-yellow'
        : 'shadow-red'

  return (
    <button type="button" onClick={() => onSelect(difficulty)} className="text-left">
      <Card
        className={cn(
          'h-full transition-all hover:border-game-cyan/60',
          tone,
          selected && cn('border-game-cyan shadow-cyan', glow),
        )}
      >
        <CardHeader>
          <CardTitle className="text-game-text">{cfg.label}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-game-dim font-mono">
          +{cfg.multiplier}x velocidade · {cfg.timeLimit}s por questão
        </CardContent>
      </Card>
    </button>
  )
}

