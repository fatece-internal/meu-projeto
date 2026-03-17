'use client'

import { create } from 'zustand'
import type { Difficulty, GameState, RoomConfig, TopicKey } from '@algebraquest/shared'
import {
  DIFFICULTY_CONFIG,
  INITIAL_LIVES,
  QuestionGenerator,
  calculateScore,
} from '@algebraquest/shared'

const initialGameState: GameState = {
  score: 0,
  lives: INITIAL_LIVES,
  timeLeft: 0,
  status: 'idle',
  currentQuestion: null,
  lastAnswerCorrect: null,
  lastPointsEarned: 0,
  questionIndex: 0,
}

type Config = { difficulty: Difficulty; topics: TopicKey[] }

type GameStore = {
  gameState: GameState
  config: Config | null
  roomConfig: RoomConfig | null
  generator: QuestionGenerator | null

  initSolo: (difficulty: Difficulty, topics: TopicKey[]) => void
  initRoom: (roomConfig: RoomConfig) => void
  nextQuestion: () => void
  submitAnswer: (answer: number, options?: { isTimeout?: boolean }) => void
  tickTimer: () => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: { ...initialGameState },
  config: null,
  roomConfig: null,
  generator: null,

  initSolo: (difficulty, topics) => {
    if (get().gameState.status !== 'idle') return

    const generator = new QuestionGenerator(Math.random().toString(36).slice(2))
    set({
      config: { difficulty, topics },
      roomConfig: null,
      generator,
      gameState: { ...initialGameState },
    })
    get().nextQuestion()
  },

  initRoom: (roomConfig) => {
    if (get().gameState.status !== 'idle') return

    const generator = new QuestionGenerator(roomConfig.seed)
    set({
      config: { difficulty: roomConfig.difficulty, topics: roomConfig.topics },
      roomConfig,
      generator,
      gameState: { ...initialGameState },
    })
    get().nextQuestion()
  },

  nextQuestion: () => {
    const { generator, config, gameState } = get()
    if (!generator || !config) throw new Error('generator/config ausentes')
    if (gameState.status !== 'idle' && gameState.status !== 'feedback') return

    const question = generator.generate(config.difficulty, config.topics)
    const timeLeft = DIFFICULTY_CONFIG[config.difficulty].timeLimit
    set({
      gameState: {
        ...gameState,
        currentQuestion: question,
        timeLeft,
        status: 'playing',
        lastAnswerCorrect: null,
        lastPointsEarned: 0,
        questionIndex: gameState.questionIndex + 1,
      },
    })
  },

  submitAnswer: (answer, options = {}) => {
    const { gameState, config } = get()
    if (gameState.status !== 'playing') return
    if (!config || !gameState.currentQuestion) return

    const isCorrect = !options.isTimeout && answer === gameState.currentQuestion.correctAnswer
    if (isCorrect) {
      const { total } = calculateScore(gameState.timeLeft, config.difficulty)
      set({
        gameState: {
          ...gameState,
          status: 'feedback',
          lastAnswerCorrect: true,
          lastPointsEarned: total,
          score: gameState.score + total,
        },
      })
      return
    }

    const lives = Math.max(0, gameState.lives - 1)
    set({
      gameState: {
        ...gameState,
        status: 'feedback',
        lastAnswerCorrect: false,
        lastPointsEarned: 0,
        lives,
      },
    })

    if (lives === 0) {
      setTimeout(() => {
        const st = get().gameState
        if (st.lives === 0) set({ gameState: { ...st, status: 'game_over' } })
      }, 100)
    }
  },

  tickTimer: () => {
    const { gameState } = get()
    if (gameState.status !== 'playing') return
    if (gameState.timeLeft > 0) {
      set({ gameState: { ...gameState, timeLeft: gameState.timeLeft - 1 } })
      return
    }
    // timeLeft === 0
    get().submitAnswer(-1, { isTimeout: true })
  },

  resetGame: () => {
    set({
      generator: null,
      roomConfig: null,
      config: null,
      gameState: { ...initialGameState },
    })
  },
}))

