const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkAssessments() {
  try {
    const assessments = await prisma.studentAssessment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    console.log('=== Data Assessment Terbaru ===\n')
    assessments.forEach((a, i) => {
      console.log(`#${i + 1}`)
      console.log(`  ID: ${a.id}`)
      console.log(`  Student ID: ${a.studentId}`)
      console.log(`  Teacher ID: ${a.teacherId}`)
      console.log(`  Date: ${a.date}`)
      console.log(`  Aspect: ${a.aspect}`)
      console.log(`  Score: ${a.score}`)
      console.log(`  Notes: ${a.notes ? a.notes.substring(0, 50) + '...' : '(kosong)'}`)
      console.log(`  Observation: ${a.observation ? a.observation.substring(0, 50) + '...' : '(kosong)'}`)
      console.log(`  Semester: ${a.semester}`)
      console.log(`  Academic Year: ${a.academicYear}`)
      console.log('')
    })

    // Group by aspect
    const byAspect = assessments.reduce((acc, a) => {
      if (!acc[a.aspect]) acc[a.aspect] = []
      acc[a.aspect].push(a)
      return acc
    }, {})

    console.log('\n=== Group by Aspect ===')
    Object.keys(byAspect).forEach(aspect => {
      console.log(`  ${aspect}: ${byAspect[aspect].length} records`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAssessments()
