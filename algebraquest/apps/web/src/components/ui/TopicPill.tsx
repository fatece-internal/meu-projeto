'use client'

import type { TopicKey } from '@algebraquest/shared'
import { TOPIC_LABELS } from '@algebraquest/shared'
import { cn } from '@/lib/utils'

export function TopicPill({
  topic,
  selected,
  onToggle,
}: {
  topic: TopicKey
  selected: boolean
  onToggle: (t: TopicKey) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(topic)}
      className={cn(
        'rounded-full border px-3 py-2 text-sm font-mono transition-all',
        selected
          ? 'border-game-cyan bg-game-card/70 text-game-text shadow-cyan'
          : 'border-game-border bg-game-card/30 text-game-dim hover:border-game-cyan/60 hover:text-game-text',
      )}
    >
      {TOPIC_LABELS[topic]}
    </button>
  )
}

