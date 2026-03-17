import 'dotenv/config'
import { prisma } from '../lib/prisma'

async function main() {
  // Seed intencionalmente mínimo: o jogo funciona sem dados iniciais.
  // Mantemos este arquivo para compatibilidade com `prisma db seed`.
  await prisma.room.deleteMany({ where: { expiresAt: { lt: new Date() } } })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async () => {
    await prisma.$disconnect()
    process.exit(1)
  })

