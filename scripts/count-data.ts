import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const students = await prisma.student.count({ where: { status: 'aktif' } })
  const teachersTetap = await prisma.teacher.count({ where: { employmentStatus: 'tetap' } })
  const teachersHonorer = await prisma.teacher.count({ where: { employmentStatus: 'honorer' } })
  const teachersTotal = await prisma.teacher.count()
  const classes = await prisma.class.count()
  const classesA = await prisma.class.count({ where: { ageGroup: 'A' } })
  const classesB = await prisma.class.count({ where: { ageGroup: 'B' } })

  console.log('📊 Data di Database:')
  console.log('===================')
  console.log(`Siswa Aktif: ${students}`)
  console.log(`Guru Tetap: ${teachersTetap}`)
  console.log(`Guru Honorer: ${teachersHonorer}`)
  console.log(`Total Guru: ${teachersTotal}`)
  console.log(`Total Kelas: ${classes}`)
  console.log(`Kelas A: ${classesA}`)
  console.log(`Kelas B: ${classesB}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
