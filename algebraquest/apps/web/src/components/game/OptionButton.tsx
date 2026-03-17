'use client'

import { cn } from '@/lib/utils'

export function OptionButton({
  value,
  state,
  onClick,
}: {
  value: number
  state: 'idle' | 'correct' | 'wrong' | 'disabled'
  onClick: () => void
}) {
  const base =
    'w-full rounded-lg border px-4 py-4 font-orbitron text-xl transition-all disabled:opacity-70'
  const styles =
    state === 'idle'
      ? 'border-game-border bg-game-card/50 hover:border-game-cyan hover:shadow-cyan'
      : state === 'correct'
        ? 'border-game-green bg-game-green/10 shadow-green animate-correctPop'
        : state === 'wrong'
          ? 'border-game-red bg-game-red/10 shadow-red animate-wrongShake'
          : 'border-game-border bg-game-card/30'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === 'disabled'}
      className={cn(base, styles, state !== 'idle' && state !== 'disabled' && 'pointer-events-none')}
    >
      {value}
    </button>
  )
}

