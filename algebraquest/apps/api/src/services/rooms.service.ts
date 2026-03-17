import type { LeaderboardEntry, Room } from '@prisma/client'
import { nanoid } from 'nanoid'
import { prisma } from '../lib/prisma'

type Difficulty = 'easy' | 'medium' | 'insane'
type TopicKey =
  | 'linear'
  | 'twoStep'
  | 'fractions'
  | 'parentheses'
  | 'negative'
  | 'decimal'

export async function createRoom(difficulty: Difficulty, topics: TopicKey[]): Promise<Room> {
  await prisma.room.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  })

  const roomId = nanoid(6)
  const seed = roomId
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  return prisma.room.create({
    data: {
      roomId,
      seed,
      difficulty,
      topics,
      expiresAt,
    },
  })
}

export async function getRoom(roomId: string): Promise<Room | null> {
  const room = await prisma.room.findFirst({
    where: {
      roomId,
      expiresAt: { gt: new Date() },
    },
  })
  return room
}

export async function submitScore(
  roomId: string,
  data: {
    playerName: string
    playerId: string
    score: number
    livesLeft: number
    questionsAnswered: number
  },
): Promise<{ rank: number; entry: LeaderboardEntry }> {
  const room = await getRoom(roomId)
  if (!room) {
    const e = new Error('ROOM_NOT_FOUND')
    ;(e as Error & { code: string }).code = 'NOT_FOUND'
    throw e
  }

  const entry = await prisma.leaderboardEntry.upsert({
    where: {
      roomId_playerId: {
        roomId,
        playerId: data.playerId,
      },
    },
    update: {
      playerName: data.playerName,
      score: data.score,
      livesLeft: data.livesLeft,
      questionsAnswered: data.questionsAnswered,
    },
    create: {
      roomId,
      playerId: data.playerId,
      playerName: data.playerName,
      score: data.score,
      livesLeft: data.livesLeft,
      questionsAnswered: data.questionsAnswered,
    },
  })

  const higherCount = await prisma.leaderboardEntry.count({
    where: {
      roomId,
      OR: [
        { score: { gt: entry.score } },
        {
          score: entry.score,
          createdAt: { lt: entry.createdAt },
        },
      ],
    },
  })

  return { rank: higherCount + 1, entry }
}

export async function getLeaderboard(
  roomId: string,
): Promise<(LeaderboardEntry & { rank: number })[]> {
  const room = await getRoom(roomId)
  if (!room) {
    const e = new Error('ROOM_NOT_FOUND')
    ;(e as Error & { code: string }).code = 'NOT_FOUND'
    throw e
  }

  const entries = await prisma.leaderboardEntry.findMany({
    where: { roomId },
    orderBy: [{ score: 'desc' }, { createdAt: 'asc' }],
    take: 20,
  })

  return entries.map((e, idx) => ({ ...e, rank: idx + 1 }))
}

