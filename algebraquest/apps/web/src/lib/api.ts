import type { Difficulty, LeaderboardEntry, TopicKey } from '@algebraquest/shared'

const BASE = process.env.NEXT_PUBLIC_API_URL

export type RankedServerEntry = LeaderboardEntry & { rank: number; playerId: string }

type ErrorBody = { message?: unknown; details?: unknown }

function readErrorMessage(body: unknown): string {
  if (!body || typeof body !== 'object') return 'HTTP_ERROR'
  const b = body as ErrorBody
  return typeof b.message === 'string' && b.message.length > 0 ? b.message : 'HTTP_ERROR'
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  if (!BASE) throw new Error('NEXT_PUBLIC_API_URL não configurada')
  const res = await fetch(`${BASE}${input}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  const text = await res.text()
  const body = text ? (JSON.parse(text) as unknown) : undefined

  if (!res.ok) {
    throw new Error(readErrorMessage(body))
  }
  return body as T
}

export const api = {
  rooms: {
    async create(difficulty: Difficulty, topics: TopicKey[]) {
      return request<{ roomId: string; seed: string; config: { difficulty: Difficulty; topics: TopicKey[] } }>(
        '/api/rooms',
        {
          method: 'POST',
          body: JSON.stringify({ difficulty, topics }),
        },
      )
    },

    async get(roomId: string) {
      return request<{ roomId: string; config: { difficulty: Difficulty; topics: TopicKey[]; seed: string } }>(
        `/api/rooms/${roomId}`,
      )
    },

    async submitScore(
      roomId: string,
      entry: {
        playerName: string
        playerId: string
        score: number
        livesLeft: number
        questionsAnswered: number
      },
    ) {
      return request<{ rank: number; entry: LeaderboardEntry }>(`/api/rooms/${roomId}/score`, {
        method: 'POST',
        body: JSON.stringify(entry),
      })
    },

    async getLeaderboard(roomId: string) {
      return request<RankedServerEntry[]>(`/api/rooms/${roomId}/leaderboard`)
    },
  },
}

