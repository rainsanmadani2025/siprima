import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function checkData() {
  console.log('=== DATABASE CHECK ===\n')

  // Check all student assessments
  const allAssessments = await db.studentAssessment.findMany({
    orderBy: { createdAt: 'desc' }
  })
  console.log(`Total All Assessments: ${allAssessments.length}`)

  // Check by date
  const today = new Date().toISOString().slice(0, 10)
  const todayAssessments = allAssessments.filter(a =>
    a.createdAt.toISOString().slice(0, 10) === today
  )
  console.log(`Assessments Created Today (${today}): ${todayAssessments.length}`)

  if (todayAssessments.length > 0) {
    console.log('\nToday\'s Assessments:')
    todayAssessments.forEach(a => {
      console.log(`- ID: ${a.id.substring(0,8)}... | Student: ${a.studentId} | Aspect: ${a.aspect} | Score: ${a.score} | Time: ${a.createdAt.toLocaleTimeString()}`)
    })
  }

  // Check students
  const students = await db.student.findMany()
  console.log(`\nTotal Students: ${students.length}`)

  // Check by aspect
  const aspects = ['agama_budi_pekerti', 'jati_diri', 'literasi_sains', 'catatan_perkembangan']
  console.log('\nAssessments by Aspect:')
  for (const aspect of aspects) {
    const count = await db.studentAssessment.count({ where: { aspect } })
    console.log(`- ${aspect}: ${count}`)
  }

  // Check recent assessments (last 10)
  console.log('\n=== LAST 10 ASSESSMENTS ===')
  const recentAssessments = await db.studentAssessment.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      studentId: true,
      aspect: true,
      score: true,
      createdAt: true,
      updatedAt: true
    }
  })
  recentAssessments.forEach(a => {
    console.log(`[${a.createdAt.toISOString().slice(0,19)}] Student: ${a.studentId} | Aspect: ${a.aspect} | Score: ${a.score}`)
  })

  await db.$disconnect()
}

checkData().catch(console.error)
