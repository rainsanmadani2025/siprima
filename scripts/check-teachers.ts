import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const allTeachers = await prisma.teacher.findMany({
    include: {
      user: true
    }
  })

  console.log('👨‍🏫 Semua Guru di Database:')
  console.log('=========================')
  for (const teacher of allTeachers) {
    console.log(`\nNama: ${teacher.user.name}`)
    console.log(`Status: ${teacher.employmentStatus}`)
    console.log(`Username: ${teacher.user.username}`)
  }
  console.log(`\n\nTotal: ${allTeachers.length} guru`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
