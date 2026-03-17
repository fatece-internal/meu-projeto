import { Router } from 'express'
import { z } from 'zod'
import { roomsController } from '../controllers/rooms.controller'
import { validate } from '../middlewares/validate.middleware'

const DifficultySchema = z.union([z.literal('easy'), z.literal('medium'), z.literal('insane')])
const TopicSchema = z.union([
  z.literal('linear'),
  z.literal('twoStep'),
  z.literal('fractions'),
  z.literal('parentheses'),
  z.literal('negative'),
  z.literal('decimal'),
])

const createRoomSchema = z.object({
  body: z.object({
    difficulty: DifficultySchema,
    topics: z.array(TopicSchema).min(1),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
})

const roomIdParamsSchema = z.object({
  params: z.object({ roomId: z.string().min(1) }),
  body: z.any().optional(),
  query: z.object({}).passthrough(),
})

const submitScoreSchema = z.object({
  params: z.object({ roomId: z.string().min(1) }),
  body: z.object({
    playerName: z.string().min(2).max(16),
    playerId: z.string().min(1),
    score: z.number().int().nonnegative(),
    livesLeft: z.number().int().min(0).max(3),
    questionsAnswered: z.number().int().nonnegative(),
  }),
  query: z.object({}).passthrough(),
})

export const roomsRouter = Router()

roomsRouter.post('/api/rooms', validate(createRoomSchema), roomsController.create)
roomsRouter.get('/api/rooms/:roomId', validate(roomIdParamsSchema), roomsController.get)
roomsRouter.post('/api/rooms/:roomId/score', validate(submitScoreSchema), roomsController.submitScore)
roomsRouter.get(
  '/api/rooms/:roomId/leaderboard',
  validate(roomIdParamsSchema),
  roomsController.leaderboard,
)

