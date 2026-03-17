'use client'

import { Input } from './input'
import { cn } from '@/lib/utils'

export function NeonInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        'font-mono border-game-cyan/50 focus-visible:ring-game-cyan shadow-[0_0_0_1px_rgba(0,229,255,0.18)] focus-visible:shadow-cyan',
        className,
      )}
      {...props}
    />
  )
}

