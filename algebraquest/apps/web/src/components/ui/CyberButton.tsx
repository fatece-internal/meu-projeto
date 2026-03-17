'use client'

import { Button, type ButtonProps } from './button'
import { cn } from '@/lib/utils'

type CyberVariant = 'primary' | 'danger' | 'ghost'

export function CyberButton({
  className,
  variant = 'primary',
  ...props
}: Omit<ButtonProps, 'variant'> & { variant?: CyberVariant }) {
  const mapped: ButtonProps['variant'] =
    variant === 'primary' ? 'default' : variant === 'danger' ? 'destructive' : 'ghost'

  return (
    <Button
      className={cn(
        'font-orbitron uppercase tracking-wider shadow-cyan hover:shadow-cyan/80',
        mapped === 'destructive' && 'shadow-red',
        className,
      )}
      variant={mapped}
      {...props}
    />
  )
}

