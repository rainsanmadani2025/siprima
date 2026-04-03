import { db } from './src/lib/db'
import * as bcrypt from 'bcryptjs'

async function main() {
  console.log('Seeding users...')

  // Check existing users
  const existingUsers = await db.user.findMany()
  console.log(`Existing users: ${existingUsers.length}`)

  if (existingUsers.length === 0) {
    console.log('Creating users...')

    // Hash passwords
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const hashedPasswordKepsek = await bcrypt.hash('kepsek123', 10)
    const hashedPasswordGuru = await bcrypt.hash('guru123', 10)
    const hashedPasswordOrtu = await bcrypt.hash('ortu123', 10)

    // Create users
    const users = [
      {
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
        role: 'ADMIN',
        email: 'admin@insanmadani.sch.id',
        isActive: true
      },
      {
        username: 'kepsek',
        password: hashedPasswordKepsek,
        name: 'Budi Santoso',
        role: 'KEPSEK',
        email: 'kepsek@insanmadani.sch.id',
        isActive: true
      },
      {
        username: 'guru1',
        password: hashedPasswordGuru,
        name: 'Ibu Siti Aminah',
        role: 'GURU',
        email: 'guru1@insanmadani.sch.id',
        isActive: true
      },
      {
        username: 'ortu1',
        password: hashedPasswordOrtu,
        name: 'Bapak Ahmad',
        role: 'ORTU',
        email: 'ortu1@gmail.com',
        isActive: true
      }
    ]

    for (const userData of users) {
      const user = await db.user.create({
        data: userData
      })
      console.log(`✓ Created user: ${user.username} (${user.role})`)

      // Create teacher profile for guru
      if (user.role === 'GURU') {
        await db.teacher.create({
          data: {
            userId: user.id,
            nuptk: '12345678901234567890',
            gender: 'Perempuan',
            employmentStatus: 'tetap',
            subjects: 'Matematika, Bahasa Indonesia'
          }
        })
        console.log(`  ✓ Created teacher profile for ${user.username}`)
      }

      // Create parent profile for ortu
      if (user.role === 'ORTU') {
        await db.parent.create({
          data: {
            userId: user.id,
            fatherName: 'Ahmad',
            fatherOccupation: 'Wiraswasta',
            fatherPhone: '081234567890',
            motherName: 'Siti',
            motherOccupation: 'Ibu Rumah Tangga',
            motherPhone: '081234567891'
          }
        })
        console.log(`  ✓ Created parent profile for ${user.username}`)
      }
    }

    console.log('\n✓ Users seeded successfully!')
    console.log('\nLogin credentials:')
    console.log('===================')
    console.log('Admin - Username: admin, Password: admin123')
    console.log('Kepsek - Username: kepsek, Password: kepsek123')
    console.log('Guru - Username: guru1, Password: guru123')
    console.log('Ortu - Username: ortu1, Password: ortu123')
    console.log('===================')
  } else {
    console.log('\nExisting users:')
    existingUsers.forEach(user => {
      console.log(`- ${user.username} (${user.role}): ${user.name}`)
    })
  }
}

main()
  .catch((e) => {
    console.error('Error seeding users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
