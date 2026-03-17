import type { Difficulty, TopicKey } from './types'

export const INITIAL_LIVES = 3
export const BASE_POINTS = 100

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  {
    timeLimit: number // seconds per question
    multiplier: number // time bonus multiplier
    label: string
    numberRange: [number, number] // range for generated numbers
  }
> = {
  easy: { timeLimit: 30, multiplier: 2, label: '🟢 FÁCIL', numberRange: [1, 10] },
  medium: {
    timeLimit: 20,
    multiplier: 4,
    label: '🟡 MÉDIO',
    numberRange: [1, 20],
  },
  insane: { timeLimit: 10, multiplier: 8, label: '🔴 INSANO', numberRange: [1, 50] },
}

export const TOPIC_LABELS: Record<TopicKey, string> = {
  linear: '➕ Linear Simples',
  twoStep: '✌️ Dois Passos',
  fractions: '➗ Frações',
  parentheses: '🔢 Parênteses',
  negative: '➖ Negativos',
  decimal: '🔸 Decimais',
}

