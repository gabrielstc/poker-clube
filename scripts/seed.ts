// scripts/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('senha123', 10)

  const user = await prisma.user.create({
    data: {
      name: 'Usuário Exemplo',
      email: 'exemplo@email.com',
      password: hashedPassword,
    },
  })

  console.log('Usuário criado:', user)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
