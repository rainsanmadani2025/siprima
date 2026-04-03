import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.studentAttendance.deleteMany()
  await prisma.studentAssessment.deleteMany()
  await prisma.dailyPlan.deleteMany()
  await prisma.portfolio.deleteMany()
  await prisma.student.deleteMany()
  await prisma.parent.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.class.deleteMany()
  await prisma.school.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.user.deleteMany()

  // Create School
  console.log('🏫 Creating school...')
  const school = await prisma.school.create({
    data: {
      name: 'RA INSAN MADANI',
      npsn: '12345678',
      address: 'Jl. Pendidikan No. 123, Kota Pendidikan',
      establishedYear: 2010,
      accreditation: 'A',
      totalClasses: 4,
      totalTeachers: 6,
      totalStudents: 40,
      phone: '021-12345678',
      email: 'info@rainsanmadani.sch.id',
      website: 'www.rainsanmadani.sch.id'
    }
  })
  console.log(`  ✅ School created: ${school.name}`)

  // Create Admin User
  console.log('👤 Creating admin user...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator',
      email: 'admin@rainsanmadani.sch.id',
      phone: '081234567890',
      role: 'ADMIN',
      isActive: true
    }
  })
  console.log(`  ✅ Admin user created: ${adminUser.username}`)

  // Create Kepala Sekolah User
  console.log('👤 Creating kepala sekolah user...')
  const kepsekUser = await prisma.user.create({
    data: {
      username: 'kepsek',
      password: await bcrypt.hash('kepsek123', 10),
      name: 'Ibu Siti Aminah, S.Pd',
      email: 'kepsek@rainsanmadani.sch.id',
      phone: '081234567891',
      role: 'KEPSEK',
      isActive: true
    }
  })
  console.log(`  ✅ Kepala sekolah user created: ${kepsekUser.username}`)

  // Create Teachers
  console.log('👨‍🏫 Creating teachers...')
  const teachers = []
  const teacherData = [
    { name: 'Ibu Sari, S.Pd', username: 'guru1', nuptk: '1234567890123456', subjects: 'Matematika, Bahasa Indonesia' },
    { name: 'Ibu Dewi, S.Pd', username: 'guru2', nuptk: '1234567890123457', subjects: 'Agama, Pendidikan Karakter' }
  ]

  for (let i = 0; i < teacherData.length; i++) {
    const user = await prisma.user.create({
      data: {
        username: teacherData[i].username,
        password: await bcrypt.hash('guru123', 10),
        name: teacherData[i].name,
        email: `${teacherData[i].username}@rainsanmadani.sch.id`,
        phone: `08123456789${i + 2}`,
        role: 'GURU',
        isActive: true
      }
    })

    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        nuptk: teacherData[i].nuptk,
        birthPlace: 'Jakarta',
        birthDate: '1990-01-01',
        gender: i % 2 === 0 ? 'Perempuan' : 'Perempuan',
        lastEducation: 'S1 Pendidikan Anak Usia Dini',
        address: `Jl. Guru No. ${i + 1}`,
        employmentStatus: i < 1 ? 'tetap' : 'honorer',
        subjects: teacherData[i].subjects
      }
    })
    teachers.push(teacher)
    console.log(`  ✅ Teacher ${i + 1} created: ${user.name}`)
  }

  // Create Classes
  console.log('🏠 Creating classes...')
  const classes = []
  const classData = [
    { name: 'A1', ageGroup: 'A', teacherId: teachers[0].id },
    { name: 'B1', ageGroup: 'B', teacherId: teachers[1].id }
  ]

  for (let i = 0; i < classData.length; i++) {
    const cls = await prisma.class.create({
      data: {
        name: classData[i].name,
        ageGroup: classData[i].ageGroup,
        teacherId: classData[i].teacherId,
        schoolId: school.id,
        capacity: 15
      }
    })
    classes.push(cls)
    console.log(`  ✅ Class created: ${cls.name}`)
  }

  // Create Parents
  console.log('👨‍👩‍👧 Creating parents...')
  const parents = []
  for (let i = 0; i < 4; i++) {
    const user = await prisma.user.create({
      data: {
        username: `ortu${i + 1}`,
        password: await bcrypt.hash('ortu123', 10),
        name: `Bapak/Ibu Orang Tua ${i + 1}`,
        email: `ortu${i + 1}@example.com`,
        phone: `08223456789${i.toString().padStart(2, '0')}`,
        role: 'ORTU',
        isActive: true
      }
    })

    const parent = await prisma.parent.create({
      data: {
        userId: user.id,
        address: `Jl. Siswa No. ${i + 1}`,
        occupation: 'Wiraswasta',
        fatherName: `Bapak ${i + 1}`,
        fatherOccupation: 'Wiraswasta',
        fatherPhone: `08223456789${i.toString().padStart(2, '0')}`,
        fatherEmail: `ayah${i + 1}@example.com`,
        motherName: `Ibu ${i + 1}`,
        motherOccupation: 'Ibu Rumah Tangga',
        motherPhone: `08223456789${i.toString().padStart(2, '0')}`,
        motherEmail: `ibu${i + 1}@example.com`
      }
    })
    parents.push(parent)
  }
  console.log(`  ✅ Created ${parents.length} parents`)

  // Create Students
  console.log('👶 Creating students...')
  const students = []
  const studentData = [
    { name: 'Ahmad Pratama', nis: '20250001', gender: 'Laki-laki', classIndex: 0, parentIndex: 0 },
    { name: 'Aisyah Sari', nis: '20250002', gender: 'Perempuan', classIndex: 0, parentIndex: 1 },
    { name: 'Muhammad Putra', nis: '20250003', gender: 'Laki-laki', classIndex: 1, parentIndex: 2 },
    { name: 'Fatimah Wati', nis: '20250004', gender: 'Perempuan', classIndex: 1, parentIndex: 3 }
  ]

  for (let i = 0; i < studentData.length; i++) {
    const birthYear = new Date().getFullYear() - (i < 2 ? 5 : 4)
    const student = await prisma.student.create({
      data: {
        name: studentData[i].name,
        nis: studentData[i].nis,
        birthDate: `${birthYear}-01-01`,
        gender: studentData[i].gender,
        address: `Jl. Siswa No. ${i + 1}`,
        parentId: parents[studentData[i].parentIndex].id,
        classId: classes[studentData[i].classIndex].id,
        status: 'aktif'
      }
    })
    students.push(student)
  }
  console.log(`  ✅ Created ${students.length} students`)

  // Create Student Attendance for today
  console.log('📋 Creating student attendance...')
  const today = new Date().toISOString().split('T')[0]
  for (let i = 0; i < students.length; i++) {
    const status = i < 3 ? 'hadir' : 'izin'
    await prisma.studentAttendance.create({
      data: {
        studentId: students[i].id,
        date: today,
        status: status,
        checkInTime: status === 'hadir' ? '07:30' : null,
        checkOutTime: status === 'hadir' ? '13:00' : null
      }
    })
  }
  console.log(`  ✅ Created attendance for ${students.length} students`)

  // Create Daily Plans (RPPH)
  console.log('📝 Creating daily plans...')
  const themes = [
    { theme: 'Diri Sendiri', subTheme: 'Mengenal Anggota Tubuh' },
    { theme: 'Lingkungan', subTheme: 'Mengenal Alam Sekitar' }
  ]

  for (let i = 0; i < 2; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (2 - i))
    const dateStr = date.toISOString().split('T')[0]

    await prisma.dailyPlan.create({
      data: {
        teacherId: teachers[i % 2].id,
        classId: classes[i % 2].id,
        date: dateStr,
        theme: themes[i].theme,
        subTheme: themes[i].subTheme,
        activities: JSON.stringify([
          { time: '07:00-08:00', activity: 'Berdoa dan upacara pagi' },
          { time: '08:00-10:00', activity: 'Kegiatan pembelajaran utama' },
          { time: '10:00-10:30', activity: 'Istirahat dan makan' },
          { time: '10:30-12:00', activity: 'Kegiatan pembelajaran lanjutan' }
        ]),
        materials: JSON.stringify([
          'Buku cerita',
          'Alat peraga',
          'Lembar kerja siswa'
        ]),
        goals: 'Anak dapat mengenal dan memahami materi yang diajarkan',
        status: i === 0 ? 'approved' : 'submitted',
        submittedAt: new Date()
      }
    })
  }
  console.log(`  ✅ Created 2 daily plans`)

  // Create Announcements
  console.log('📢 Creating announcements...')
  const announcements = [
    {
      title: 'Rapat Guru Wali Murid',
      content: 'Diharapkan seluruh guru dan wali murid hadir dalam rapat evaluasi semester ini.',
      category: 'rapat',
      targetAudience: 'all',
      eventDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'important',
      createdBy: adminUser.id
    },
    {
      title: 'Libur Nasional',
      content: 'Sekolah libur dalam rangka hari raya nasional.',
      category: 'umum',
      targetAudience: 'all',
      eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'urgent',
      createdBy: kepsekUser.id
    }
  ]

  for (const announcement of announcements) {
    await prisma.announcement.create({
      data: announcement
    })
  }
  console.log(`  ✅ Created ${announcements.length} announcements`)

  console.log('\n✅ Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`  - School: ${school.name}`)
  console.log(`  - Admin: 1`)
  console.log(`  - Kepala Sekolah: 1`)
  console.log(`  - Teachers: ${teachers.length} (1 tetap, 1 honorer)`)
  console.log(`  - Classes: ${classes.length}`)
  console.log(`  - Students: ${students.length}`)
  console.log(`  - Parents: ${parents.length}`)
  console.log(`  - Daily Plans: 2`)
  console.log(`  - Announcements: ${announcements.length}`)
  console.log('\n🔐 Login credentials:')
  console.log(`  - Admin: admin / admin123`)
  console.log(`  - Kepsek: kepsek / kepsek123`)
  console.log(`  - Guru: guru1-2 / guru123`)
  console.log(`  - Ortu: ortu1-4 / ortu123`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
