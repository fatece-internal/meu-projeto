'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-game-border bg-game-card/60 px-3 py-2 text-sm text-game-text placeholder:text-game-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-cyan focus-visible:border-game-cyan',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

