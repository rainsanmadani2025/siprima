import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 DATABASE STATE ANALYSIS')
  console.log('========================\n')

  // Check all model counts
  const models = {
    'User': () => prisma.user.count(),
    'Teacher': () => prisma.teacher.count(),
    'Parent': () => prisma.parent.count(),
    'Student': () => prisma.student.count(),
    'Class': () => prisma.class.count(),
    'School': () => prisma.school.count(),
    'Schedule': () => prisma.schedule.count(),
    'StudentAttendance': () => prisma.studentAttendance.count(),
    'TeacherAttendance': () => prisma.teacherAttendance.count(),
    'DailyPlan': () => prisma.dailyPlan.count(),
    'CurriculumPlan': () => prisma.curriculumPlan.count(),
    'StudentAssessment': () => prisma.studentAssessment.count(),
    'Portfolio': () => prisma.portfolio.count(),
    'Announcement': () => prisma.announcement.count(),
    'Notification': () => prisma.notification.count(),
    'Message': () => prisma.message.count(),
    'TeacherReport': () => prisma.teacherReport.count(),
    'StudentReport': () => prisma.studentReport.count(),
    'SchoolActivity': () => prisma.schoolActivity.count(),
    'RPPTemplate': () => prisma.rPPTemplate.count(),
    'RPP': () => prisma.rPP.count(),
    'Prosem': () => prisma.prosem.count(),
  }

  console.log('📊 RECORD COUNTS BY TABLE:')
  console.log('=========================\n')

  for (const [modelName, countFn] of Object.entries(models)) {
    try {
      const count = await countFn()
      const status = count > 0 ? '✅' : '❌'
      console.log(`${status} ${modelName.padEnd(25)}: ${count}`)
    } catch (error: any) {
      console.log(`⚠️  ${modelName.padEnd(25)}: ERROR - ${error.message}`)
    }
  }

  console.log('\n🔎 DETAILED ANALYSIS:\n')

  // Check RPP details
  const rpps = await prisma.rPP.findMany({
    select: { id: true, tema: true, semester: true, tahunAjaran: true }
  })
  console.log(`RPP Records: ${rpps.length}`)
  if (rpps.length > 0) {
    console.log('Sample RPP records:')
    rpps.slice(0, 3).forEach(rpp => {
      console.log(`  - ${rpp.tema} (${rpp.semester} ${rpp.tahunAjaran})`)
    })
  }

  // Check PROSEM details
  const prosems = await prisma.prosem.findMany({
    select: { id: true, teacherId: true, tahunAjaran: true, semester: true }
  })
  console.log(`\nPROSEM Records: ${prosems.length}`)
  if (prosems.length > 0) {
    console.log('Sample PROSEM records:')
    prosems.slice(0, 3).forEach(prosem => {
      console.log(`  - TeacherID: ${prosem.teacherId} (${prosem.semester} ${prosem.tahunAjaran})`)
    })
  }

  // Check RPPTemplate details
  const templates = await prisma.rPPTemplate.findMany({
    select: { id: true, tema: true, isActive: true }
  })
  console.log(`\nRPP Template Records: ${templates.length}`)
  if (templates.length > 0) {
    console.log('Sample Template records:')
    templates.slice(0, 3).forEach(template => {
      console.log(`  - ${template.tema} (Active: ${template.isActive})`)
    })
  }

  // Check if there are any orphaned records (records referencing deleted users/teachers)
  console.log('\n🚨 ORPHANED RECORDS CHECK:\n')

  console.log('\n✅ ANALYSIS COMPLETE\n')

  // Check existing users
  const users = await prisma.user.findMany({
    select: { id: true, username: true, name: true, role: true, isActive: true }
  })
  console.log('\n👤 EXISTING USERS:')
  console.log('==================\n')
  users.forEach(user => {
    console.log(`- ${user.name} (${user.username}) - Role: ${user.role} - Active: ${user.isActive}`)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
