import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const guruUsers = await prisma.user.findMany({
    where: { role: 'GURU' },
    orderBy: { name: 'asc' }
  })

  console.log('👤 Semua User dengan Role GURU:')
  console.log('============================')
  console.log(`Total: ${guruUsers.length} user\n`)
  
  for (const user of guruUsers) {
    console.log(`Nama: ${user.name}`)
    console.log(`Username: ${user.username}`)
    console.log(`Active: ${user.isActive}`)
    
    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id }
    })
    console.log(`Punya Teacher Profile: ${teacher ? 'YA' : 'TIDAK'}`)
    if (teacher) {
      console.log(`Teacher Status: ${teacher.employmentStatus}`)
    }
    console.log('')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
