import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const allTeachers = await prisma.teacher.findMany({
    include: {
      user: true
    },
    orderBy: { user: { name: 'asc' } }
  })

  console.log('👨‍🏫 SEMUA GURU DI DATABASE:')
  console.log('============================')
  console.log(`Total: ${allTeachers.length} guru\n`)
  
  allTeachers.forEach((teacher, index) => {
    console.log(`${index + 1}. ${teacher.user.name}`)
    console.log(`   NUPTK: ${teacher.nuptk || '-'}`)
    console.log(`   Status: ${teacher.employmentStatus}`)
    console.log(`   Username: ${teacher.user.username}`)
    console.log(`   ID: ${teacher.id}`)
    console.log(`   UserID: ${teacher.userId}`)
    console.log('')
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
