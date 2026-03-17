'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePlayerStore } from '@/store/player.store'
import { useGameStore } from '@/store/game.store'
import { useTimer } from '@/hooks/useTimer'
import { useScreenFlash } from '@/hooks/useScreenFlash'
import { useGameSound } from '@/hooks/useGameSound'
import { GameHUD } from '@/components/layout/GameHUD'
import { QuestionCard } from '@/components/game/QuestionCard'
import { FeedbackPanel } from '@/components/game/FeedbackPanel'
import { GameOverOverlay } from '@/components/game/GameOverOverlay'
import { calculateScore } from '@algebraquest/shared'
import { CyberButton } from '@/components/ui/CyberButton'

export default function PlayPage() {
  const router = useRouter()
  const player = usePlayerStore((s) => s.player)
  const loadPlayer = usePlayerStore((s) => s.loadPlayer)

  const config = useGameStore((s) => s.config)
  const initSolo = useGameStore((s) => s.initSolo)
  const submitAnswer = useGameStore((s) => s.submitAnswer)
  const nextQuestion = useGameStore((s) => s.nextQuestion)
  const resetGame = useGameStore((s) => s.resetGame)
  const st = useGameStore((s) => s.gameState)

  const { flash, color } = useScreenFlash()
  const sound = useGameSound()
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    loadPlayer()
  }, [loadPlayer])

  useEffect(() => {
    if (!player) router.replace('/')
  }, [player, router])

  useEffect(() => {
    if (!config) {
      router.replace('/setup?mode=solo')
      return
    }
    if (st.currentQuestion === null) initSolo(config.difficulty, config.topics)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

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

  useTimer()

  const timeBonus = useMemo(() => {
    if (!config) return 0
    return calculateScore(st.timeLeft, config.difficulty).timeBonus
  }, [st.timeLeft, config])

  return (
    <main className="min-h-screen overflow-hidden">
      {config ? (
        <GameHUD lives={st.lives} score={st.score} timeLeft={st.timeLeft} difficulty={config.difficulty} />
      ) : null}

      {flash ? (
        <div
          className="fixed inset-0 z-30 pointer-events-none"
          style={{
            background: color === 'green' ? 'rgba(57,255,20,0.12)' : 'rgba(255,51,102,0.15)',
          }}
        />
      ) : null}

      <div className="mx-auto max-w-2xl px-4 pt-28">
        {st.currentQuestion ? (
          <QuestionCard
            question={st.currentQuestion}
            status={st.status}
            onAnswer={(n) => {
              setShowHint(false)
              submitAnswer(n)
            }}
          />
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

      {st.status === 'feedback' && st.lastAnswerCorrect === false && st.currentQuestion ? (
        <div className="fixed inset-x-0 bottom-28 z-30 flex justify-center px-4">
          {!showHint ? (
            <CyberButton variant="ghost" onClick={() => setShowHint(true)}>
              💡 VER DICA
            </CyberButton>
          ) : (
            <div className="max-w-2xl rounded-xl border border-game-border bg-game-card/50 p-3 font-mono text-game-text">
              💡 {st.currentQuestion.hint}
            </div>
          )}
        </div>
      ) : null}

      <GameOverOverlay
        open={st.status === 'game_over'}
        score={st.score}
        questionsAnswered={st.questionIndex}
        onRestart={() => {
          if (!config) return
          resetGame()
          initSolo(config.difficulty, config.topics)
        }}
        onMenu={() => router.push('/')}
      >
        <div className="flex justify-end">
          <CyberButton variant="ghost" onClick={sound.toggleMute}>
            {sound.isMuted ? '🔇 SOM' : '🔊 SOM'}
          </CyberButton>
        </div>
      </GameOverOverlay>
    </main>
  )
}

