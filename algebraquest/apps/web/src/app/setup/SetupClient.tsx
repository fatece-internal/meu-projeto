'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Difficulty, TopicKey } from '@algebraquest/shared'
import { CyberButton } from '@/components/ui/CyberButton'
import { DifficultyCard } from '@/components/ui/DifficultyCard'
import { TopicPill } from '@/components/ui/TopicPill'
import { usePlayerStore } from '@/store/player.store'
import { useGameStore } from '@/store/game.store'
import { useRoomStore } from '@/store/room.store'

const ALL_TOPICS: TopicKey[] = ['linear', 'twoStep', 'fractions', 'parentheses', 'negative', 'decimal']

export function SetupClient() {
  const router = useRouter()
  const params = useSearchParams()
  const mode = (params.get('mode') === 'room' ? 'room' : 'solo') as 'solo' | 'room'

  const player = usePlayerStore((s) => s.player)
  const loadPlayer = usePlayerStore((s) => s.loadPlayer)

  const initSolo = useGameStore((s) => s.initSolo)
  const createRoom = useRoomStore((s) => s.createRoom)

  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [topics, setTopics] = useState<TopicKey[]>(['linear'])
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    loadPlayer()
  }, [loadPlayer])

  useEffect(() => {
    if (!player) router.replace('/')
  }, [player, router])

  const canStart = useMemo(
    () => Boolean(player) && topics.length > 0 && !isStarting,
    [player, topics, isStarting],
  )

  function toggleTopic(t: TopicKey) {
    setTopics((curr) => (curr.includes(t) ? curr.filter((x) => x !== t) : [...curr, t]))
  }

  async function start() {
    if (!canStart) return
    setIsStarting(true)
    try {
      if (mode === 'solo') {
        initSolo(difficulty, topics)
        router.push('/play')
        return
      }
      const roomId = await createRoom(difficulty, topics)
      router.push(`/room/${roomId}`)
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <main className="min-h-screen px-4 pt-6 pb-10">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="font-mono text-game-dim hover:text-game-text"
        >
          ← VOLTAR
        </button>

        <div className="mt-6 font-orbitron text-3xl text-game-text">CONFIGURAR PARTIDA</div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(['easy', 'medium', 'insane'] as Difficulty[]).map((d) => (
            <DifficultyCard key={d} difficulty={d} selected={difficulty === d} onSelect={setDifficulty} />
          ))}
        </div>

        <div className="mt-10">
          <div className="font-mono text-xs tracking-widest text-game-dim">TÓPICOS (selecionar 1+)</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {ALL_TOPICS.map((t) => (
              <TopicPill key={t} topic={t} selected={topics.includes(t)} onToggle={toggleTopic} />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <CyberButton
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            disabled={!canStart}
            onClick={start}
          >
            🚀 INICIAR
          </CyberButton>
        </div>

        {mode === 'room' ? (
          <div className="mt-6 rounded-xl border border-game-border bg-game-card/40 p-4 font-mono text-sm text-game-dim">
            Você será redirecionado para a sala. Compartilhe o link com seus amigos!
          </div>
        ) : null}
      </div>
    </main>
  )
}

