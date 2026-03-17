'use client'

import { cn } from '@/lib/utils'
import type { LeaderboardEntry } from '@algebraquest/shared'

export function LeaderboardTable({
  entries,
  currentPlayerId,
}: {
  entries: (LeaderboardEntry & { rank: number; playerId: string })[]
  currentPlayerId: string
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-game-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-game-card/60 font-mono text-game-dim">
          <tr>
            <th className="px-3 py-2">Rank</th>
            <th className="px-3 py-2">Nome</th>
            <th className="px-3 py-2">Score</th>
            <th className="px-3 py-2">Vidas</th>
            <th className="px-3 py-2">Questões</th>
          </tr>
        </thead>
        <tbody className="bg-game-card/30">
          {entries.map((e) => {
            const medal = e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : e.rank === 3 ? '🥉' : null
            const highlight = e.playerId === currentPlayerId
            return (
              <tr
                key={`${e.rank}-${e.playerName}-${e.timestamp}`}
                className={cn(
                  'border-t border-game-border/60',
                  highlight && 'bg-game-cyan/10',
                )}
              >
                <td className="px-3 py-2 font-orbitron text-game-text">
                  {medal ? `${medal} ${e.rank}` : e.rank}
                </td>
                <td className="px-3 py-2 font-mono text-game-text">{e.playerName}</td>
                <td className="px-3 py-2 font-orbitron text-game-cyan">{e.score}</td>
                <td className="px-3 py-2 font-mono text-game-text">{e.livesLeft}</td>
                <td className="px-3 py-2 font-mono text-game-text">{e.questionsAnswered}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

