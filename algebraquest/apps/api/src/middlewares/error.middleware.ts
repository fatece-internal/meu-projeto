import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { error as sendError } from '../lib/response'

type AppError = Error & { code?: string; status?: number; details?: unknown }

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (err instanceof ZodError) {
    return sendError(
      res,
      'VALIDATION_ERROR',
      400,
      err.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    )
  }

  const e = err as AppError
  if (e?.code === 'NOT_FOUND' || e?.status === 404) {
    return sendError(res, e.message || 'NOT_FOUND', 404, e.details)
  }

  const message = process.env.NODE_ENV === 'production' ? 'INTERNAL_ERROR' : e?.message || 'INTERNAL_ERROR'
  return sendError(res, message, 500)
}

