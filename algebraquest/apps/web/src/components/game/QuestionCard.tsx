'use client'

import type { GameStatus, Question } from '@algebraquest/shared'
import { OptionButton } from './OptionButton'

export function QuestionCard({
  question,
  status,
  onAnswer,
}: {
  question: Question
  status: GameStatus
  onAnswer: (n: number) => void
}) {
  const disabled = status !== 'playing'
  return (
    <div className="animate-slideUp">
      <div className="text-center font-orbitron text-game-text drop-shadow-[0_0_22px_rgba(255,255,255,0.08)] text-[clamp(2rem,5vw,4rem)]">
        {question.expression}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((opt) => (
          <OptionButton
            key={opt}
            value={opt}
            state={disabled ? 'disabled' : 'idle'}
            onClick={() => onAnswer(opt)}
          />
        ))}
      </div>
    </div>
  )
}

