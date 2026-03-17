export type Difficulty = 'easy' | 'medium' | 'insane'

export type TopicKey =
  | 'linear' // 2x + 4 = 12
  | 'twoStep' // 3x - 5 = 10
  | 'fractions' // x/3 + 2 = 5
  | 'parentheses' // 2(x + 3) = 14
  | 'negative' // -2x + 8 = 2
  | 'decimal' // 0.5x + 1 = 3.5

export interface Question {
  expression: string // "2x + 4 = 12"
  options: number[] // [4, 2, 8, 6] — always 4 choices
  correctAnswer: number // 4
  resolution: string // "2x + 4 = 12 → 2x = 8 → x = 4"
  hint: string // "Isole o x: subtraia 4 dos dois lados"
}

export interface Player {
  id: string // nanoid, generated on first visit
  name: string // chosen on splash screen
}

export type GameStatus = 'idle' | 'playing' | 'feedback' | 'game_over'

export interface GameState {
  score: number // starts at 0
  lives: number // starts at 3
  timeLeft: number // seconds remaining for current question
  status: GameStatus
  currentQuestion: Question | null
  lastAnswerCorrect: boolean | null
  lastPointsEarned: number
  questionIndex: number // how many questions answered this run
}

export interface RoomConfig {
  difficulty: Difficulty
  topics: TopicKey[]
  seed: string // e.g. "abc-123" — derived from roomId
}

export interface LeaderboardEntry {
  playerName: string
  score: number
  livesLeft: number
  questionsAnswered: number
  timestamp: string // ISO string
}

export interface Room {
  roomId: string
  config: RoomConfig
  leaderboard: LeaderboardEntry[]
  createdAt: string
}
