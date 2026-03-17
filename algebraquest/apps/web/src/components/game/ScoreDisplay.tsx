'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

export function ScoreDisplay({ score }: { score: number }) {
  const mv = useMotionValue(score)
  const rounded = useTransform(mv, (v) => Math.round(v))

  useEffect(() => {
    const controls = animate(mv, score, { duration: 0.35, ease: 'easeOut' })
    return () => controls.stop()
  }, [score, mv])

  return (
    <motion.div className="font-orbitron text-2xl text-game-cyan drop-shadow-[0_0_18px_rgba(0,229,255,0.35)]">
      {rounded}
    </motion.div>
  )
}

