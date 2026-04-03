import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const templates = await prisma.rPPTemplate.findMany({
    orderBy: { id: 'asc' }
  })

  console.log('=== TEMPLATE NARRATIVE LENGTHS ===\n')

  for (const template of templates) {
    console.log(`\n--- Template ${template.tema} ---`)
    console.log(`Tujuan KBC: ${template.tujuanKBC.length} chars`)
    console.log(`Tujuan Pembelajaran: ${template.tujuanPembelajaran.length} chars`)
    console.log(`Tujuan Pembelajaran Mendalam: ${template.tujuanPembelajaranMendalam.length} chars`)
    console.log(`Materi Integrasi KBC: ${template.materiIntegrasiKBC.length} chars`)

    const tujuanProfilLulusan = JSON.parse(template.tujuanProfilLulusan)
    console.log(`Tujuan Profil Lulusan: ${Object.keys(tujuanProfilLulusan).length} categories`)
    Object.entries(tujuanProfilLulusan).forEach(([key, value]: [string, any]) => {
      console.log(`  - ${key}: ${value.length} chars`)
    })

    const kerangka = JSON.parse(template.kerangkaPembelajaran)
    console.log(`Kerangka Pembelajaran:`)
    console.log(`  - praktekPedagogik: ${kerangka.praktekPedagogik.length} chars`)
    console.log(`  - kemitraanPembelajaran: ${kerangka.kemitraanPembelajaran.length} chars`)
    console.log(`  - pemanfaatanDigital: ${kerangka.pemanfaatanDigital.length} chars`)

    const kegiatan = JSON.parse(template.kegiatanPembelajaran)
    console.log(`Kegiatan Pembelajaran:`)
    Object.entries(kegiatan).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]: [string, any]) => {
          console.log(`  - ${key}.${subKey}: ${subValue.length} chars`)
        })
      }
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
