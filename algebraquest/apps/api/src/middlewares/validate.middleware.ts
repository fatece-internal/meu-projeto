import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    })

    if (!result.success) return next(result.error)

    ;(req as Request & { validated: unknown }).validated = result.data
    return next()
  }
}

