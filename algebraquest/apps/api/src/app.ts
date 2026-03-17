import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { roomsRouter } from './routes/rooms.routes'
import { errorMiddleware } from './middlewares/error.middleware'

export const app = express()

app.use(helmet())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  }),
)
app.use(morgan('dev'))
app.use(express.json())
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use(roomsRouter)

app.use(errorMiddleware)

