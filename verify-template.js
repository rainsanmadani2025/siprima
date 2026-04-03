import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function verify() {
  const template = await prisma.rPPTemplate.findFirst({
    where: { tema: { startsWith: "Mengenal Nama-Nama Allah" } }
  })

  if (!template) {
    console.log("❌ Template not found!")
    await prisma.$disconnect()
    return
  }

  console.log("✅ Template Found!\n")
  console.log(`Tema: ${template.tema}`)
  console.log(`Topik KBC: ${template.topikKBC}`)
  console.log(`Profil Lulusan: ${template.profilLulusan}`)
  console.log(`\nTujuan KBC (${template.tujuanKBC.length} chars): ${template.tujuanKBC.substring(0, 80)}...`)
  console.log(`\nTujuan Pembelajaran Mendalam (${template.tujuanPembelajaranMendalam.length} chars): ${template.tujuanPembelajaranMendalam.substring(0, 80)}...`)

  const tujuanProfil = JSON.parse(template.tujuanProfilLulusan)
  console.log(`\nTujuan Profil Lulusan (${Object.keys(tujuanProfil).length} keys):`)
  for (const [key, val] of Object.entries(tujuanProfil)) {
    console.log(`  - ${key}: ${val.substring(0, 50)}...`)
  }

  const kegiatan = JSON.parse(template.kegiatanPembelajaran)
  console.log(`\nKegiatan Pembelajaran (${Object.keys(kegiatan).length} keys):`)
  for (const [key, val] of Object.entries(kegiatan)) {
    const content = typeof val === 'string' ? val : `${Array.isArray(val) ? val.length : '?'} items`
    console.log(`  - ${key}: ${content.substring(0, 50)}...`)
  }

  await prisma.$disconnect()
}

verify()
