'use client'

import { cn } from '@/lib/utils'

export function LivesDisplay({ lives }: { lives: number }) {
  const hearts = [0, 1, 2].map((i) => {
    const active = i < lives
    return (
      <span
        key={i}
        className={cn(
          'inline-block text-xl transition-all duration-300',
          !active && 'grayscale scale-75 opacity-40',
        )}
      >
        {active ? '❤️' : '🖤'}
      </span>
    )
  })
  return <div className="flex gap-1">{hearts}</div>
}

