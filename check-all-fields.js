import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkAllFields() {
  const templates = await prisma.rPPTemplate.findMany()

  console.log(`Checking ALL fields for ${templates.length} templates...\n`)

  const fieldStatus = {
    profilLulusan: { filled: 0, empty: 0 },
    tujuanKBC: { filled: 0, empty: 0 },
    tujuanPembelajaranMendalam: { filled: 0, empty: 0 },
    materiIntegrasiKBC: { filled: 0, empty: 0 },
    tujuanPembelajaran: { filled: 0, empty: 0 },
    kerangkaPembelajaran: { filled: 0, empty: 0 },
    kegiatanPembelajaran: { filled: 0, empty: 0 },
    tujuanProfilLulusan: { filled: 0, empty: 0 },
  }

  templates.forEach((t) => {
    if (t.profilLulusan) fieldStatus.profilLulusan.filled++
    else fieldStatus.profilLulusan.empty++

    if (t.tujuanKBC) fieldStatus.tujuanKBC.filled++
    else fieldStatus.tujuanKBC.empty++

    if (t.tujuanPembelajaranMendalam) fieldStatus.tujuanPembelajaranMendalam.filled++
    else fieldStatus.tujuanPembelajaranMendalam.empty++

    if (t.materiIntegrasiKBC) fieldStatus.materiIntegrasiKBC.filled++
    else fieldStatus.materiIntegrasiKBC.empty++

    if (t.tujuanPembelajaran) fieldStatus.tujuanPembelajaran.filled++
    else fieldStatus.tujuanPembelajaran.empty++

    if (t.kerangkaPembelajaran) fieldStatus.kerangkaPembelajaran.filled++
    else fieldStatus.kerangkaPembelajaran.empty++

    if (t.kegiatanPembelajaran) fieldStatus.kegiatanPembelajaran.filled++
    else fieldStatus.kegiatanPembelajaran.empty++

    if (t.tujuanProfilLulusan) fieldStatus.tujuanProfilLulusan.filled++
    else fieldStatus.tujuanProfilLulusan.empty++
  })

  console.log("Field Status Summary:")
  console.log("=" .repeat(60))
  for (const [field, status] of Object.entries(fieldStatus)) {
    const total = status.filled + status.empty
    const percentage = ((status.filled / total) * 100).toFixed(0)
    console.log(`${field}:`)
    console.log(`  - Filled: ${status.filled}/${total} (${percentage}%)`)
    if (status.empty > 0) {
      console.log(`  - Empty: ${status.empty}/${total}`)
    }
  }

  await prisma.$disconnect()
}

checkAllFields()
