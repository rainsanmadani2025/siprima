import { db } from './src/lib/db'
import * as bcrypt from 'bcryptjs'

async function main() {
  const user = await db.user.findUnique({
    where: { username: 'guru1', role: 'GURU' }
  })

  if (user) {
    console.log('Testing password verification for guru1/GURU...')
    console.log('DB Password hash:', user.password)
    
    const passwordsToTest = ['guru123', 'guru12', 'guru1', 'admin123', 'kepsek123']
    
    for (const pwd of passwordsToTest) {
      const isValid = await bcrypt.compare(pwd, user.password)
      console.log(`Password "${pwd}" (${pwd.length} chars): ${isValid ? '✓ VALID' : '✗ INVALID'}`)
    }
  } else {
    console.log('User not found')
  }

  await db.$disconnect()
}

main()
