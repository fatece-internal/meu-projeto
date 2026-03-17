'use client'

import { CyberButton } from '@/components/ui/CyberButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function FeedbackPanel({
  correct,
  pointsEarned,
  timeBonus,
  resolution,
  hint,
  onNext,
}: {
  correct: boolean
  pointsEarned: number
  timeBonus: number
  resolution: string
  hint: string
  onNext: () => void
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 p-4">
      <Card className="mx-auto max-w-2xl animate-slideUp">
        <CardHeader>
          <CardTitle className={correct ? 'text-game-green' : 'text-game-red'}>
            {correct ? '✅ CORRETO!' : '❌ ERRADO!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {correct ? (
            <div className="font-mono text-game-dim">
              +{pointsEarned} pontos · Base: 100 + Bônus de tempo: {timeBonus}
            </div>
          ) : (
            <div className="font-mono text-game-dim">💔 -1 vida</div>
          )}

          <div className="rounded-lg border border-game-border bg-game-card/40 p-3 font-mono text-sm text-game-text">
            {resolution}
          </div>

          {!correct && (
            <div className="rounded-lg border border-game-border bg-game-card/30 p-3 font-mono text-sm text-game-text">
              💡 {hint}
            </div>
          )}

          <div className="pt-2">
            <CyberButton variant="primary" className="w-full" onClick={onNext}>
              PRÓXIMA QUESTÃO →
            </CyberButton>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

