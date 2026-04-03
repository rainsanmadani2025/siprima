import * as bcrypt from 'bcryptjs'

async function main() {
  const plainPassword = 'guru123'
  const dbPassword = '$2b$10$AKyd9na4U2NWYxVbWGcwK.voE3B6M8W7qY3PVa9nQ2HYJSpL0lwy2'
  
  console.log('Testing DB password...')
  console.log('Plain password:', plainPassword)
  console.log('DB password:', dbPassword)
  
  const isValid = await bcrypt.compare(plainPassword, dbPassword)
  console.log('Verification result:', isValid)
  
  if (!isValid) {
    console.log('\nTrying to re-hash with bcryptjs...')
    const newHash = await bcrypt.hash(plainPassword, 10)
    console.log('New hash:', newHash)
    console.log('New verification:', await bcrypt.compare(plainPassword, newHash))
  }
}

main()
