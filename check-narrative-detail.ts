import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkNarrativeDetail() {
  console.log('Checking narrative detail in Kegiatan Pembelajaran...\n')

  const templates = await prisma.rPPTemplate.findMany({
    where: { isActive: true },
    orderBy: { tema: 'asc' }
  })

  for (const template of templates) {
    console.log(`\n=== ${template.tema} ===`)

    if (!template.kegiatanPembelajaran) {
      console.log('No kegiatanPembelajaran data')
      continue
    }

    const kp = JSON.parse(template.kegiatanPembelajaran as string)

    // Check each tahap
    const tahapList = ['persiapan', 'pelaksanaan', 'pembuatanKarya', 'presentasi', 'refleksiAkhir']

    for (const tahap of tahapList) {
      if (!kp[tahap]) {
        console.log(`  ${tahap}: MISSING`)
        continue
      }

      const fields = Object.keys(kp[tahap])
      console.log(`  ${tahap}:`)
      for (const field of fields) {
        const content = kp[tahap][field] as string
        const lines = content ? content.split('\n').length : 0
        const chars = content ? content.length : 0
        console.log(`    - ${field}: ${chars} chars, ${lines} lines`)
      }
    }
  }

  await prisma.$disconnect()
}

checkNarrativeDetail().catch(console.error)
