async function testLogin(username, password, role) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, role })
    })

    const data = await response.json()
    console.log(`\n🔐 Login Test - ${username} (${role})`)
    console.log(`Status: ${response.status}`)
    console.log(`Response:`, data)
  } catch (error) {
    console.log(`\n❌ Error testing ${username}:`, error)
  }
}

async function main() {
  await testLogin('admin', 'admin123', 'admin')
  await testLogin('kepsek', 'kepsek123', 'kepsek')
  await testLogin('guru1', 'guru123', 'guru')
  await testLogin('ortu1', 'ortu123', 'ortu')
}

main()
