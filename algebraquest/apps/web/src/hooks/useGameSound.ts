'use client'

import { useCallback, useMemo, useState } from 'react'

type Beep = { freq: number; dur: number }

function playSequence(seq: Beep[], type: OscillatorType, gainValue: number) {
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext })
    .webkitAudioContext
  const ctx = new AudioCtx()
  const now = ctx.currentTime
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(gainValue, now)
  gain.connect(ctx.destination)

  let t = now
  for (const b of seq) {
    const osc = ctx.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(b.freq, t)
    osc.connect(gain)
    osc.start(t)
    osc.stop(t + b.dur / 1000)
    t += b.dur / 1000
  }

  window.setTimeout(() => void ctx.close(), Math.ceil((t - now) * 1000) + 60)
}

export function useGameSound() {
  const [isMuted, setMuted] = useState(false)

  const correctSeq = useMemo<Beep[]>(() => [{ freq: 440, dur: 80 }, { freq: 660, dur: 90 }], [])
  const wrongSeq = useMemo<Beep[]>(() => [{ freq: 220, dur: 120 }, { freq: 160, dur: 140 }], [])
  const gameOverSeq = useMemo<Beep[]>(
    () => [
      { freq: 220, dur: 160 },
      { freq: 180, dur: 160 },
      { freq: 140, dur: 220 },
    ],
    [],
  )

  const playCorrect = useCallback(() => {
    if (isMuted) return
    playSequence(correctSeq, 'sine', 0.06)
  }, [isMuted, correctSeq])

  const playWrong = useCallback(() => {
    if (isMuted) return
    playSequence(wrongSeq, 'square', 0.05)
  }, [isMuted, wrongSeq])

  const playGameOver = useCallback(() => {
    if (isMuted) return
    playSequence(gameOverSeq, 'triangle', 0.07)
  }, [isMuted, gameOverSeq])

  const playTick = useCallback(() => {
    if (isMuted) return
    playSequence([{ freq: 880, dur: 30 }], 'sine', 0.035)
  }, [isMuted])

  const toggleMute = useCallback(() => setMuted((m) => !m), [])

  return { isMuted, toggleMute, playCorrect, playWrong, playGameOver, playTick }
}

