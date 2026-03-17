'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CyberButton } from '@/components/ui/CyberButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function GameOverOverlay({
  open,
  score,
  questionsAnswered,
  onRestart,
  onMenu,
  children,
}: {
  open: boolean
  score: number
  questionsAnswered: number
  onRestart: () => void
  onMenu: () => void
  children?: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle className="text-game-yellow">💀 GAME OVER</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="font-orbitron text-5xl text-game-yellow drop-shadow-[0_0_18px_rgba(255,230,0,0.25)]">
                {score}
              </div>
              <div className="font-mono text-game-dim">Questões respondidas: {questionsAnswered}</div>

              {children}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <CyberButton variant="primary" onClick={onRestart}>
                  🔄 JOGAR NOVAMENTE
                </CyberButton>
                <CyberButton variant="ghost" onClick={onMenu}>
                  🏠 MENU
                </CyberButton>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

