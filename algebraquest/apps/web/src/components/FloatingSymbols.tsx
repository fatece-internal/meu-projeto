'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

const SYMBOLS = [
  'x²',
  '+',
  '=',
  '∑',
  '√',
  '∫',
  'Δ',
  'π',
  '÷',
  '×',
  '≠',
  '±',
  '∞',
  'α',
  'β',
  '→',
  '⊥',
  '∥',
  '∈',
  '∀',
] as const

type SymbolSpec = {
  id: string
  symbol: string
  leftPct: number
  delay: number
  duration: number
  size: number
  opacity: number
}

function seededFloat(seed: number): () => number {
  let x = seed | 0
  return () => {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    return ((x >>> 0) / 4294967296) as number
  }
}

export function FloatingSymbols({ className }: { className?: string }) {
  const specs = useMemo<SymbolSpec[]>(() => {
    // determinístico por render SSR/CSR para evitar mismatch
    const rnd = seededFloat(1337)
    return Array.from({ length: 20 }, (_, i) => {
      const symbol = SYMBOLS[i % SYMBOLS.length]
      const leftPct = Math.floor(rnd() * 1000) / 10
      const delay = Math.floor(rnd() * 800) / 100
      const duration = 8 + Math.floor(rnd() * 600) / 100
      const size = 12 + Math.floor(rnd() * 22)
      const opacity = 0.08 + rnd() * 0.18
      return {
        id: `sym_${i}`,
        symbol,
        leftPct,
        delay,
        duration,
        size,
        opacity,
      }
    })
  }, [])

  return (
    <div className={cn('pointer-events-none fixed inset-0 z-0 overflow-hidden', className)}>
      {specs.map((s) => (
        <div
          key={s.id}
          className="absolute bottom-[-10%] font-mono text-game-dim blur-[0.2px]"
          style={{
            left: `${s.leftPct}%`,
            opacity: s.opacity,
            fontSize: `${s.size}px`,
            animation: `aqFloatUp ${s.duration}s linear ${s.delay}s infinite`,
          }}
        >
          {s.symbol}
        </div>
      ))}
      <style jsx global>{`
        @keyframes aqFloatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.18;
          }
          100% {
            transform: translateY(-130vh) translateX(-12px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

