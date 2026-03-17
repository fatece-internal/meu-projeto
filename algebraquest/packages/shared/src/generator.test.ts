import { describe, expect, it } from 'vitest'
import { QuestionGenerator } from './generator'

describe('QuestionGenerator determinismo por seed', () => {
  it('gera a mesma sequência para a mesma seed + chamadas', () => {
    const seed = 'x7f9a3'
    const topics = ['linear', 'twoStep'] as const

    const a = new QuestionGenerator(seed)
    const b = new QuestionGenerator(seed)

    const qa = Array.from({ length: 10 }, () => a.generate('medium', [...topics]))
    const qb = Array.from({ length: 10 }, () => b.generate('medium', [...topics]))

    expect(qa).toEqual(qb)
  })
})

