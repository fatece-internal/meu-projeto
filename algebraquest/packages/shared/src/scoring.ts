import type { Difficulty } from './types'
import { BASE_POINTS, DIFFICULTY_CONFIG } from './constants'

export function calculateScore(
  timeLeft: number,
  difficulty: Difficulty,
): { base: number; timeBonus: number; total: number } {
  const base = BASE_POINTS
  const multiplier = DIFFICULTY_CONFIG[difficulty].multiplier
  const timeBonus = Math.floor(timeLeft * multiplier)
  return { base, timeBonus, total: base + timeBonus }
}

