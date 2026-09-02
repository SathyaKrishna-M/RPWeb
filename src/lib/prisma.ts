import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Set PRISMA_LOG_QUERIES=1 to see every round trip. Each one costs a
    // network hop to the database, which dominates page time when the two are
    // far apart, so counting them is the way to find pages doing too many.
    log: process.env.PRISMA_LOG_QUERIES ? ["query"] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
