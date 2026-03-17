import type { Response } from 'express'

export function success<T>(res: Response, data: T, status = 200): Response {
  return res.status(status).json(data)
}

export function error(
  res: Response,
  message: string,
  status: number,
  details?: unknown,
): Response {
  return res.status(status).json({ message, details })
}

