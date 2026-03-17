'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePlayerStore } from '@/store/player.store'
import { useGameStore } from '@/store/game.store'
import { useRoomStore } from '@/store/room.store'
import { useTimer } from '@/hooks/useTimer'
import { useRoomPolling } from '@/hooks/useRoomPolling'
import { useScreenFlash } from '@/hooks/useScreenFlash'
import { useGameSound } from '@/hooks/useGameSound'
import { GameHUD } from '@/components/layout/GameHUD'
import { QuestionCard } from '@/components/game/QuestionCard'
import { FeedbackPanel } from '@/components/game/FeedbackPanel'
import { GameOverOverlay } from '@/components/game/GameOverOverlay'
import { LeaderboardTable } from '@/components/game/LeaderboardTable'
import { Badge } from '@/components/ui/badge'
import { CyberButton } from '@/components/ui/CyberButton'
import { calculateScore } from '@algebraquest/shared'

export default function RoomPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const roomId = params.id

  const player = usePlayerStore((s) => s.player)
  const loadPlayer = usePlayerStore((s) => s.loadPlayer)

  const loadRoom = useRoomStore((s) => s.loadRoom)
  const submitScore = useRoomStore((s) => s.submitScore)
  const leaderboard = useRoomStore((s) => s.leaderboard)
  const roomConfig = useRoomStore((s) => s.roomConfig)


  const initRoom = useGameStore((s) => s.initRoom)
  const submitAnswer = useGameStore((s) => s.submitAnswer)
  const nextQuestion = useGameStore((s) => s.nextQuestion)
  const resetGame = useGameStore((s) => s.resetGame)
  const st = useGameStore((s) => s.gameState)


  const { flash, color } = useScreenFlash()
  const sound = useGameSound()
  const { countdown } = useRoomPolling(roomId)

  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    loadPlayer()
  }, [loadPlayer])

  useEffect(() => {
    if (!player) router.replace('/')
  }, [player, router])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const cfg = await loadRoom(roomId)
        if (!alive) return
        initRoom(cfg)
      } catch {
        if (!alive) return
        setNotFound(true)
      }
    })()
    return () => {
      alive = false
    }
  }, [roomId, loadRoom, initRoom])

  useEffect(() => {
    if (st.lastAnswerCorrect === true) sound.playCorrect()
    if (st.lastAnswerCorrect === false) sound.playWrong()
  }, [st.lastAnswerCorrect, sound])

  useEffect(() => {
    if (st.status === 'game_over') sound.playGameOver()
  }, [st.status, sound])

  useEffect(() => {
    if (st.status === 'playing' && st.timeLeft <= 5) sound.playTick()
  }, [st.timeLeft, st.status, sound])

  useEffect(() => {
    if (!player) return
    if (!roomConfig) return
    if (st.status !== 'game_over') return
    if (submitted) return
    setSubmitted(true)
    void submitScore(roomId, {
      playerName: player.name,
      score: st.score,
      livesLeft: st.lives,
      questionsAnswered: st.questionIndex,
    })
  }, [st.status, submitted, submitScore, player, roomConfig, st.score, st.lives, st.questionIndex, roomId])

  useTimer()

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return `http://localhost:3000/room/${roomId}`
    return `${window.location.origin}/room/${roomId}`
  }, [roomId])

  const timeBonus = useMemo(() => {
    if (!roomConfig) return 0
    return calculateScore(st.timeLeft, roomConfig.difficulty).timeBonus
  }, [st.timeLeft, roomConfig])

  if (notFound) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-game-bg">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="text-8xl animate-pulse">💀</div>
          
          <div className="space-y-4">
            <h1 className="font-orbitron text-4xl font-bold text-game-cyan tracking-widest drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
              SALA NÃO ENCONTRADA
            </h1>
            <p className="font-mono text-game-dim text-lg">
              Esta sala expirou ou o link está incorreto.
            </p>
          </div>

          <div className="pt-8">
            <CyberButton variant="primary" onClick={() => router.push('/')} className="w-full py-4 text-xl">
              🏠 VOLTAR AO MENU
            </CyberButton>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen overflow-hidden">
      {roomConfig ? (
        <GameHUD lives={st.lives} score={st.score} timeLeft={st.timeLeft} difficulty={roomConfig.difficulty} />
      ) : null}

      {flash ? (
        <div
          className="fixed inset-0 z-30 pointer-events-none"
          style={{
            background: color === 'green' ? 'rgba(57,255,20,0.12)' : 'rgba(255,51,102,0.15)',
          }}
        />
      ) : null}

      {st.status === 'playing' ? (
        <div className="fixed inset-x-0 top-16 z-20 mx-auto max-w-5xl px-4">
          <div className="rounded-xl border border-game-border bg-game-card/40 px-3 py-2 flex items-center justify-between gap-3">
            <div className="font-mono text-sm text-game-dim truncate">
              🔗 Compartilhe: {shareUrl}
            </div>
            <div className="w-32 flex justify-end">
              <CyberButton
                variant="ghost"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareUrl)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  } catch (err) {
                    console.error('Falha ao copiar:', err)
                  }
                }}
              >
                {copied ? '✓ Copiado!' : 'Copiar'}
              </CyberButton>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-2xl px-4 pt-32">
        {st.currentQuestion ? (
          <QuestionCard question={st.currentQuestion} status={st.status} onAnswer={(n) => submitAnswer(n)} />
        ) : null}
      </div>

      {st.status === 'feedback' && st.currentQuestion ? (
        <FeedbackPanel
          correct={Boolean(st.lastAnswerCorrect)}
          pointsEarned={st.lastPointsEarned}
          timeBonus={timeBonus}
          resolution={st.currentQuestion.resolution}
          hint={st.currentQuestion.hint}
          onNext={() => nextQuestion()}
        />
      ) : null}

      <GameOverOverlay
        open={st.status === 'game_over'}
        score={st.score}
        questionsAnswered={st.questionIndex}
        onRestart={() => {
          if (!roomConfig) return
          setSubmitted(false)
          resetGame()
          initRoom(roomConfig)
        }}
        onMenu={() => router.push('/')}
      >
        <div className="flex items-center justify-between gap-3">
          <Badge className="font-mono text-game-dim">ATUALIZA EM {countdown}s</Badge>
          <CyberButton variant="ghost" onClick={sound.toggleMute}>
            {sound.isMuted ? '🔇 SOM' : '🔊 SOM'}
          </CyberButton>
        </div>
        <div className="pt-3">
          {player ? (
            <LeaderboardTable entries={leaderboard} currentPlayerId={player.id} />
          ) : null}
        </div>
      </GameOverOverlay>
    </main>
  )
}

