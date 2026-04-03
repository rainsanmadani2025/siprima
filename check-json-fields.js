import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkJSONFields() {
  const templates = await prisma.rPPTemplate.findMany()
  console.log(`Checking JSON fields for ${templates.length} templates...\n`)

  let emptyCount = 0

  templates.forEach((t, i) => {
    const tujuanProfil = t.tujuanProfilLulusan ? JSON.parse(t.tujuanProfilLulusan) : null
    const kerangka = t.kerangkaPembelajaran ? JSON.parse(t.kerangkaPembelajaran) : null
    const kegiatan = t.kegiatanPembelajaran ? JSON.parse(t.kegiatanPembelajaran) : null

    const isEmpty = !tujuanProfil || !kerangka || !kegiatan

    console.log(`${i+1}. ${t.tema}`)
    console.log(`   tujuanProfilLulusan: ${tujuanProfil ? Object.keys(tujuanProfil).length + ' keys' : 'EMPTY'}`)
    console.log(`   kerangkaPembelajaran: ${kerangka ? 'EXISTS' : 'EMPTY'}`)
    console.log(`   kegiatanPembelajaran: ${kegiatan && typeof kegiatan === 'object' ? Object.keys(kegiatan).join(', ') : 'EMPTY'}`)

    if (isEmpty) emptyCount++
  })

  console.log(`\n${templates.length - emptyCount}/${templates.length} templates have all JSON fields filled`)
  console.log(`${emptyCount} templates have missing data`)

  await prisma.$disconnect()
}

checkJSONFields()
