'use client'

import { cn } from '@/lib/utils'

export function TimerCircle({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const r = 23
  const dash = 138
  const offset = dash - (dash * timeLeft) / maxTime
  const pct = timeLeft / maxTime
  const stroke = pct <= 0.25 ? 'stroke-game-red' : pct <= 0.5 ? 'stroke-game-yellow' : 'stroke-game-cyan'
  const danger = pct <= 0.25

  return (
    <div className={cn('relative h-14 w-14', danger && 'animate-timerPulse')}>
      <svg width="56" height="56" viewBox="0 0 56 56" className="rotate-[-90deg]">
        <circle cx="28" cy="28" r={r} className="stroke-game-border/60" strokeWidth="4" fill="none" />
        <circle
          cx="28"
          cy="28"
          r={r}
          className={cn(stroke, 'transition-[stroke-dashoffset] duration-300 ease-out')}
          strokeWidth="4"
          fill="none"
          strokeDasharray={dash}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-orbitron text-sm text-game-text">
        {timeLeft}
      </div>
    </div>
  )
}

