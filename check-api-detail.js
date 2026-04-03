import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkOneTemplate() {
  const template = await prisma.rPPTemplate.findFirst({
    where: { tema: "Mengenal Nama-Nama Allah (Asmaul Husna)" }
  })

  if (!template) {
    console.log("Template not found!")
    return
  }

  console.log("=== Template Detail ===")
  console.log(`Tema: ${template.tema}`)
  console.log(`\nTopik KBC: ${template.topikKBC}`)
  console.log(`Profil Lulusan: ${template.profilLulusan}`)
  console.log(`\nTujuan KBC:`)
  console.log(template.tujuanKBC)
  console.log(`\nTujuan Pembelajaran Mendalam:`)
  console.log(template.tujuanPembelajaranMendalam)

  console.log(`\nTujuan Profil Lulusan (JSON):`)
  const tujuanProfil = JSON.parse(template.tujuanProfilLulusan)
  for (const [key, value] of Object.entries(tujuanProfil)) {
    console.log(`  ${key}: ${typeof value === 'string' ? value.substring(0, 60) + '...' : value}`)
  }

  console.log(`\nKegiatan Pembelajaran (JSON):`)
  const kegiatan = JSON.parse(template.kegiatanPembelajaran)
  console.log(`  pendahuluan: ${kegiatan.pendahuluan ? kegiatan.pendahuluan.substring(0, 60) + '...' : 'EMPTY'}`)
  console.log(`  inti: ${Array.isArray(kegiatan.inti) ? kegiatan.inti.length + ' items' : 'NOT ARRAY'}`)
  console.log(`  penutup: ${kegiatan.penutup ? kegiatan.penutup.substring(0, 60) + '...' : 'EMPTY'}`)

  await prisma.$disconnect()
}

checkOneTemplate()
