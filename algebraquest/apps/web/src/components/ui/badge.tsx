'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-game-border bg-game-card/70 px-2.5 py-0.5 text-xs text-game-text',
        className,
      )}
      {...props}
    />
  )
}

