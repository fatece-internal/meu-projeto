'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NeonInput } from '@/components/ui/NeonInput'
import { CyberButton } from '@/components/ui/CyberButton'
import { usePlayerStore } from '@/store/player.store'

export default function SplashPage() {
  const router = useRouter()
  const player = usePlayerStore((s) => s.player)
  const loadPlayer = usePlayerStore((s) => s.loadPlayer)
  const setPlayer = usePlayerStore((s) => s.setPlayer)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPlayer()
  }, [loadPlayer])

  useEffect(() => {
    if (player?.name) setName(player.name)
  }, [player?.name])

  function validate(n: string) {
    const t = n.trim()
    if (t.length < 2) return 'Nome precisa ter pelo menos 2 caracteres.'
    if (t.length > 16) return 'Nome precisa ter no máximo 16 caracteres.'
    return null
  }

  function onSubmit(mode: 'solo' | 'room') {
    const e = validate(name)
    setError(e)
    if (e) return
    setPlayer(name)
    router.push(`/setup?mode=${mode}`)
  }

  return (
    <main className="min-h-screen px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl text-center">
        <div className="font-orbitron text-[clamp(3rem,7vw,5rem)] text-game-cyan animate-titlePulse">
          ⚡ ALGEBRA QUEST
        </div>
        <div className="mt-2 font-mono text-game-dim">// Desafie sua mente. Quebre o recorde.</div>

        <div className="mt-10 text-left">
          <label className="block font-mono text-xs tracking-widest text-game-dim">JOGADOR</label>
          <NeonInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome..."
            className="mt-2"
            required
            minLength={2}
            maxLength={16}
          />
          {error ? <div className="mt-2 font-mono text-sm text-game-red">{error}</div> : null}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <CyberButton variant="primary" size="lg" onClick={() => onSubmit('solo')}>
            🎮 MODO SOLO
          </CyberButton>
          <CyberButton variant="primary" size="lg" onClick={() => onSubmit('room')}>
            🏆 CRIAR SALA
          </CyberButton>
        </div>
      </div>
    </main>
  )
}

