import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkDB() {
  const templates = await prisma.rPPTemplate.findMany()
  console.log(`Total templates: ${templates.length}`)

  templates.forEach((t, i) => {
    console.log(`\n${i+1}. ${t.tema}`)
    console.log(`  - topikKBC: ${t.topikKBC}`)
    console.log(`  - profilLulusan: ${t.profilLulusan ? t.profilLulusan.substring(0, 50) + '...' : 'EMPTY'}`)
    console.log(`  - tujuanKBC: ${t.tujuanKBC ? t.tujuanKBC.substring(0, 50) + '...' : 'EMPTY'}`)
    console.log(`  - tujuanPembelajaranMendalam: ${t.tujuanPembelajaranMendalam ? t.tujuanPembelajaranMendalam.substring(0, 50) + '...' : 'EMPTY'}`)
    console.log(`  - kerangkaPembelajaran: ${t.kerangkaPembelajaran ? 'EXISTS (' + t.kerangkaPembelajaran.length + ' chars)' : 'EMPTY'}`)
    console.log(`  - kegiatanPembelajaran: ${t.kegiatanPembelajaran ? 'EXISTS (' + t.kegiatanPembelajaran.length + ' chars)' : 'EMPTY'}`)
  })

  await prisma.$disconnect()
}

checkDB()
