const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  console.log('Checking database for all templates and profilLulusan...\n')

  const templates = await prisma.rPPTemplate.findMany({
    orderBy: { id: 'asc' }
  })

  console.log(`Total templates found: ${templates.length}\n`)

  let allFilled = true
  const missingProfil = []

  templates.forEach((template, index) => {
    const hasProfil = template.profilLulusan && template.profilLulusan.trim() !== ''
    const status = hasProfil ? '✓' : '✗'

    console.log(`${index + 1}. [${status}] "${template.tema}"`)
    console.log(`   Topik KBC: ${template.topikKBC}`)
    console.log(`   Profil Lulusan: ${hasProfil ? template.profilLulusan : '(KOSONG)'}\n`)

    if (!hasProfil) {
      allFilled = false
      missingProfil.push(template.tema)
    }
  })

  console.log('\n' + '='.repeat(70))
  if (allFilled) {
    console.log('✓ SUKSES: Semua 15 template memiliki profilLulusan yang terisi!')
  } else {
    console.log(`✗ ERROR: ${missingProfil.length} template tidak memiliki profilLulusan:`)
    missingProfil.forEach(tema => console.log(`   - ${tema}`))
  }
  console.log('='.repeat(70))

  // Summary by topikKBC
  console.log('\nRingkasan berdasarkan Topik KBC:\n')
  const summary = {}
  templates.forEach(template => {
    const topik = template.topikKBC
    if (!summary[topik]) summary[topik] = { total: 0, filled: 0 }
    summary[topik].total++
    if (template.profilLulusan && template.profilLulusan.trim() !== '') {
      summary[topik].filled++
    }
  })

  Object.keys(summary).forEach(topik => {
    const s = summary[topik]
    const percentage = Math.round((s.filled / s.total) * 100)
    console.log(`- ${topik}: ${s.filled}/${s.total} terisi (${percentage}%)`)
  })

  await prisma.$disconnect()
}

checkDatabase()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
