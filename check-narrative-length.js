import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function verifyNarrativeDetail() {
  const templates = await prisma.rPPTemplate.findMany()

  console.log(`Checking narrative detail for ${templates.length} templates...\n`)

  templates.forEach((t, i) => {
    console.log(`${i+1}. ${t.tema}`)
    console.log(`   tujuanKBC: ${t.tujuanKBC.length} chars - ${t.tujuanKBC.substring(0, 60)}...`)
    console.log(`   tujuanPembelajaranMendalam: ${t.tujuanPembelajaranMendalam.length} chars`)
    console.log(`   materiIntegrasiKBC: ${t.materiIntegrasiKBC.length} chars`)
    console.log(`   tujuanPembelajaran: ${t.tujuanPembelajaran.length} chars`)
    
    const tujuanProfil = JSON.parse(t.tujuanProfilLulusan)
    console.log(`   tujuanProfilLulusan: ${Object.keys(tujuanProfil).length} keys`)
    
    const kegiatan = JSON.parse(t.kegiatanPembelajaran)
    const intiCount = Array.isArray(kegiatan.inti) ? kegiatan.inti.length : 0
    console.log(`   kegiatanPembelajaran: pendahuluan + inti(${intiCount} items) + penutup`)
    console.log()
  })

  await prisma.$disconnect()
}

verifyNarrativeDetail()
