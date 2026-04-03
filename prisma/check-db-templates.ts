import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkTemplates() {
  console.log('=== CHECKING RPP TEMPLATES IN DATABASE ===\n')

  const templates = await prisma.rPPTemplate.findMany({
    select: {
      id: true,
      tema: true,
      topikKBC: true,
      profilLulusan: true,
      tujuanKBC: true,
      tujuanPembelajaranMendalam: true,
      materiIntegrasiKBC: true,
      tujuanPembelajaran: true,
    }
  })

  console.log(`Total templates: ${templates.length}\n`)

  const fields = [
    'profilLulusan',
    'tujuanKBC',
    'tujuanPembelajaranMendalam',
    'materiIntegrasiKBC',
    'tujuanPembelajaran'
  ]

  fields.forEach(field => {
    const filled = templates.filter(t => t[field] && t[field].length > 10).length
    const empty = templates.filter(t => !t[field] || t[field].length <= 10).length
    console.log(`${field}: ${filled}/${templates.length} filled, ${empty}/${templates.length} empty`)
  })

  console.log('\n=== SAMPLE DATA FROM FIRST TEMPLATE ===\n')
  if (templates.length > 0) {
    const first = templates[0]
    console.log(`Tema: ${first.tema}`)
    console.log(`Topik KBC: ${first.topikKBC}`)
    console.log(`\nProfil Lulusan (${first.profilLulusan?.length || 0} chars):`)
    console.log(first.profilLulusan || 'EMPTY')
    console.log(`\nTujuan KBC (${first.tujuanKBC?.length || 0} chars):`)
    console.log(first.tujuanKBC || 'EMPTY')
    console.log(`\nTujuan Pembelajaran Mendalam (${first.tujuanPembelajaranMendalam?.length || 0} chars):`)
    console.log(first.tujuanPembelajaranMendalam || 'EMPTY')
    console.log(`\nMateri Integrasi KBC (${first.materiIntegrasiKBC?.length || 0} chars):`)
    console.log(first.materiIntegrasiKBC || 'EMPTY')
    console.log(`\nTujuan Pembelajaran (${first.tujuanPembelajaran?.length || 0} chars):`)
    console.log(first.tujuanPembelajaran || 'EMPTY')
  }

  await prisma.$disconnect()
}

checkTemplates()
