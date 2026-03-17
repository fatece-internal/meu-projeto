'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'destructive' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-cyan disabled:pointer-events-none disabled:opacity-50'

    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      default: 'bg-game-cyan text-game-base hover:brightness-110',
      secondary: 'bg-game-card text-game-text border border-game-border hover:border-game-cyan',
      destructive: 'bg-game-red text-game-base hover:brightness-110',
      ghost: 'bg-transparent text-game-text hover:bg-game-card/60',
    }

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3',
      lg: 'h-12 px-6 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

