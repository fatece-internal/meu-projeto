import type { NextFunction, Request, Response } from 'express'
import { success } from '../lib/response'
import * as roomsService from '../services/rooms.service'

function toEntry(e: { playerName: string; score: number; livesLeft: number; questionsAnswered: number; createdAt: Date }) {
  return {
    playerName: e.playerName,
    score: e.score,
    livesLeft: e.livesLeft,
    questionsAnswered: e.questionsAnswered,
    timestamp: e.createdAt.toISOString(),
  }
}

export const roomsController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = (req as Request & { validated: { body: unknown } }).validated as {
        body: { difficulty: 'easy' | 'medium' | 'insane'; topics: string[] }
      }
      const room = await roomsService.createRoom(body.difficulty, body.topics as never)
      return success(
        res,
        {
          roomId: room.roomId,
          seed: room.seed,
          config: { difficulty: room.difficulty, topics: room.topics as string[] },
        },
        201,
      )
    } catch (err) {
      return next(err)
    }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { params } = (req as Request & { validated: { params: unknown } }).validated as {
        params: { roomId: string }
      }
      const room = await roomsService.getRoom(params.roomId)
      if (!room) {
        const e = new Error('ROOM_NOT_FOUND')
        ;(e as Error & { code: string }).code = 'NOT_FOUND'
        throw e
      }
      return success(res, {
        roomId: room.roomId,
        config: { difficulty: room.difficulty, topics: room.topics as string[], seed: room.seed },
      })
    } catch (err) {
      return next(err)
    }
  },

  async submitScore(req: Request, res: Response, next: NextFunction) {
    try {
      const { params, body } = (req as Request & { validated: { params: unknown; body: unknown } })
        .validated as {
        params: { roomId: string }
        body: {
          playerName: string
          playerId: string
          score: number
          livesLeft: number
          questionsAnswered: number
        }
      }

      const result = await roomsService.submitScore(params.roomId, body)
      return success(res, { rank: result.rank, entry: toEntry(result.entry) })
    } catch (err) {
      return next(err)
    }
  },

  async leaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { params } = (req as Request & { validated: { params: unknown } }).validated as {
        params: { roomId: string }
      }
      const entries = await roomsService.getLeaderboard(params.roomId)
      return success(
        res,
        entries.map((e) => ({
          ...toEntry(e),
          rank: e.rank,
        })),
      )
    } catch (err) {
      return next(err)
    }
  },
}

