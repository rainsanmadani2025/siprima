import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== VERIFIKASI FIELD TEMPLATE ===\n')

  const templates = await prisma.rPPTemplate.findMany({
    where: { isActive: true },
    orderBy: { tema: 'asc' }
  })

  console.log(`Total template aktif: ${templates.length}\n`)

  const fields = [
    'tema',
    'topikKBC',
    'profilLulusan',
    'tujuanKBC',
    'tujuanProfilLulusan',
    'tujuanPembelajaranMendalam',
    'materiIntegrasiKBC',
    'tujuanPembelajaran',
    'kerangkaPembelajaran',
    'kegiatanPembelajaran'
  ]

  let totalMissing = 0
  const fieldStats: Record<string, { filled: number; missing: number; templates: string[] }> = {}

  // Initialize stats
  fields.forEach(field => {
    fieldStats[field] = { filled: 0, missing: 0, templates: [] }
  })

  for (const template of templates) {
    for (const field of fields) {
      const value = template[field as keyof typeof template]
      if (value === null || value === undefined || value === '') {
        fieldStats[field].missing++
        fieldStats[field].templates.push(template.tema)
        totalMissing++
      } else {
        fieldStats[field].filled++
      }
    }
  }

  // Display results
  console.log('STATISTIK PER FIELD:\n')
  for (const field of fields) {
    const stats = fieldStats[field]
    const percentage = ((stats.filled / templates.length) * 100).toFixed(1)
    const status = percentage === '100.0' ? '✓' : '✗'

    console.log(`${status} ${field}:`)
    console.log(`   Terisi: ${stats.filled}/${templates.length} (${percentage}%)`)

    if (stats.missing > 0) {
      console.log(`   Kosong: ${stats.missing} template:`)
      stats.templates.forEach(t => console.log(`     - ${t}`))
    }
    console.log()
  }

  console.log('\n=== RINGKASAN ===')
  console.log(`Total template: ${templates.length}`)
  console.log(`Total field yang dicek: ${fields.length}`)
  console.log(`Total field kosong: ${totalMissing}`)

  const allFieldsComplete = fields.every(field => fieldStats[field].missing === 0)
  if (allFieldsComplete) {
    console.log('\n✓✓✓ SEMUA FIELD 100% TERISI! ✓✓✓')
  } else {
    console.log('\n✗✗✗ ADA FIELD YANG BELUM TERISI! ✗✗✗')
  }

  // Display sample template
  console.log('\n=== CONTOH TEMPLATE ===')
  if (templates.length > 0) {
    const sample = templates[0]
    console.log(`Tema: "${sample.tema}"`)
    console.log(`Topik KBC: ${sample.topikKBC}`)
    console.log(`Profil Lulusan: ${sample.profilLulusan ? '✓ Terisi' : '✗ Kosong'}`)
    console.log(`Tujuan KBC: ${sample.tujuanKBC ? '✓ Terisi' : '✗ Kosong'}`)
    console.log(`Tujuan Profil Lulusan: ${sample.tujuanProfilLulusan ? '✓ Terisi (JSON)' : '✗ Kosong'}`)
    console.log(`Tujuan Pembelajaran Mendalam: ${sample.tujuanPembelajaranMendalam ? '✓ Terisi' : '✗ Kosong'}`)
    console.log(`Materi Integrasi KBC: ${sample.materiIntegrasiKBC ? '✓ Terisi' : '✗ Kosong'}`)
    console.log(`Tujuan Pembelajaran: ${sample.tujuanPembelajaran ? '✓ Terisi' : '✗ Kosong'}`)
    console.log(`Kerangka Pembelajaran: ${sample.kerangkaPembelajaran ? '✓ Terisi (JSON)' : '✗ Kosong'}`)
    console.log(`Kegiatan Pembelajaran: ${sample.kegiatanPembelajaran ? '✓ Terisi (JSON)' : '✗ Kosong'}`)
  }

  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
