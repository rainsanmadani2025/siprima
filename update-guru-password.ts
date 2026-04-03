import { db } from './src/lib/db'
import * as bcrypt from 'bcryptjs'

async function main() {
  const newPassword = await bcrypt.hash('guru1', 10)
  
  const user = await db.user.update({
    where: { username: 'guru1' },
    data: { password: newPassword }
  })
  
  console.log('✓ Password guru1 updated to: guru1 (5 chars)')
  console.log('✓ Username: guru1')
  console.log('✓ Password: guru1')
  console.log('✓ Role: Guru')
  
  await db.$disconnect()
}

main()
