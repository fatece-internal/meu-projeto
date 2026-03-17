import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __aq_prisma: PrismaClient | undefined
}

function createClient(): PrismaClient {
  const log =
    process.env.NODE_ENV === 'development'
      ? (['query', 'warn', 'error'] as const)
      : (['warn', 'error'] as const)
  return new PrismaClient({ log })
}

export const prisma: PrismaClient = globalThis.__aq_prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalThis.__aq_prisma = prisma

