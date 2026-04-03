import * as bcrypt from 'bcryptjs'

async function main() {
  const plainPassword = 'guru123'
  
  // Hash password
  const hashedPassword = await bcrypt.hash(plainPassword, 10)
  console.log('Plain password:', plainPassword)
  console.log('Hashed password:', hashedPassword)
  
  // Verify
  const isValid = await bcrypt.compare(plainPassword, hashedPassword)
  console.log('Verification:', isValid)
  
  // Get password from database
  const { db } = await import('./src/lib/db')
  const user = await db.user.findUnique({
    where: { username: 'guru1', role: 'GURU' }
  })
  
  if (user) {
    console.log('Password in DB:', user.password)
    const dbValid = await bcrypt.compare(plainPassword, user.password)
    console.log('DB Verification:', dbValid)
  }
  
  await db.$disconnect()
}

main()
