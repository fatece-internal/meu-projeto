import type { Difficulty, Question, TopicKey } from './types'
import { DIFFICULTY_CONFIG } from './constants'

function mulberry32(seed: number): () => number {
  return function (): number {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return (((t ^ (t >>> 14)) >>> 0) / 4294967296) as number
  }
}

function djb2Hash(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return String(n)
  const s = n.toFixed(2)
  return s.replace(/\.?0+$/, '')
}

export class QuestionGenerator {
  private rng: () => number

  constructor(seed: string) {
    this.rng = mulberry32(djb2Hash(seed))
  }

  private randInt(min: number, max: number): number {
    return Math.floor(this.rng() * (max - min + 1)) + min
  }

  private pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.rng() * arr.length)]
  }

  private shuffleInPlace<T>(arr: T[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  // Advance the RNG n times (for competitive rooms, index = question number)
  skipTo(index: number): void {
    for (let i = 0; i < index; i++) this.rng()
  }

  private buildOptions(correct: number): number[] {
    const options = new Set<number>()
    const correctInt = Math.trunc(correct)
    options.add(correctInt)

    const maxAttempts = 200
    let attempts = 0
    while (options.size < 4 && attempts < maxAttempts) {
      attempts++
      const delta = this.randInt(1, 5)
      const sign = this.rng() < 0.5 ? -1 : 1
      let candidate = correctInt + sign * delta
      if (candidate < 0) candidate = Math.abs(candidate)
      options.add(candidate)
    }

    // fallback: fill sequentially if RNG produced collisions
    let bump = 1
    while (options.size < 4) {
      const candidate = Math.max(0, correctInt + bump)
      options.add(candidate)
      bump++
    }

    const arr = Array.from(options)
    this.shuffleInPlace(arr)
    return arr
  }

  generate(difficulty: Difficulty, topics: TopicKey[]): Question {
    if (topics.length === 0) throw new Error('topics array must not be empty')

    const [min, max] = DIFFICULTY_CONFIG[difficulty].numberRange
    const topic = this.pick(topics)

    const a = this.randInt(min, max)
    const b = this.randInt(min, max)

    if (topic === 'linear') {
      const x = this.randInt(min, max)
      const c = a * x + b
      const correctAnswer = x
      return {
        expression: `${a}x + ${b} = ${c}`,
        correctAnswer,
        options: this.buildOptions(correctAnswer),
        resolution: `${a}x + ${b} = ${c} → ${a}x = ${c - b} → x = ${correctAnswer}`,
        hint: `Subtraia ${b} dos dois lados, depois divida por ${a}`,
      }
    }

    if (topic === 'twoStep') {
      const x = this.randInt(min, max)
      const c = a * x - b
      const correctAnswer = x
      return {
        expression: `${a}x - ${b} = ${c}`,
        correctAnswer,
        options: this.buildOptions(correctAnswer),
        resolution: `${a}x - ${b} = ${c} → ${a}x = ${c + b} → x = ${correctAnswer}`,
        hint: `Some ${b} nos dois lados primeiro`,
      }
    }

    if (topic === 'fractions') {
      const xBase = this.randInt(min, max)
      const x = a * xBase
      const c = xBase + b
      const correctAnswer = x
      return {
        expression: `x/${a} + ${b} = ${c}`,
        correctAnswer,
        options: this.buildOptions(correctAnswer),
        resolution: `x/${a} = ${c - b} → x = ${(c - b) * a}`,
        hint: `Subtraia ${b} e multiplique por ${a}`,
      }
    }

    if (topic === 'parentheses') {
      const x = this.randInt(min, max)
      const c = a * (x + b)
      const correctAnswer = x
      return {
        expression: `${a}(x + ${b}) = ${c}`,
        correctAnswer,
        options: this.buildOptions(correctAnswer),
        resolution: `${a}(x + ${b}) = ${c} → x + ${b} = ${c / a} → x = ${correctAnswer}`,
        hint: `Divida por ${a} primeiro, depois subtraia ${b}`,
      }
    }

    if (topic === 'negative') {
      const x = this.randInt(min, max)
      const c = b - a * x
      const correctAnswer = x
      return {
        expression: `-${a}x + ${b} = ${c}`,
        correctAnswer,
        options: this.buildOptions(correctAnswer),
        resolution: `-${a}x + ${b} = ${c} → -${a}x = ${c - b} → x = ${(b - c) / a}`,
        hint: `Subtraia ${b}, depois divida por -${a}`,
      }
    }

    // decimal
    // decimal
    const coeffs = [0.5, 0.25, 0.75] as const
    const coeff = this.pick(coeffs)
    const x = this.randInt(min, max)
    const bPrice = this.randInt(min, max)
    const cVal = coeff * x + bPrice
    const correctAnswer = x
    return {
      expression: `${formatNumber(coeff)}x + ${bPrice} = ${formatNumber(cVal)}`,
      correctAnswer,
      options: this.buildOptions(correctAnswer),
      resolution: `${formatNumber(coeff)}x + ${bPrice} = ${formatNumber(
        cVal,
      )} → ${formatNumber(coeff)}x = ${formatNumber(cVal - bPrice)} → x = ${correctAnswer}`,
      hint: `Subtraia ${bPrice} dos dois lados e depois divida por ${formatNumber(coeff)}`,
    }
  }
}

export function generateQuestion(difficulty: Difficulty, topics: TopicKey[]): Question {
  const seed = Math.random().toString(36).slice(2)
  const gen = new QuestionGenerator(seed)
  return gen.generate(difficulty, topics)
}

