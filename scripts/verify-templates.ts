import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
  const templates = await prisma.rPPTemplate.findMany({
    orderBy: { tema: 'asc' }
  })
  
  console.log(`\n📊 Verification Report`)
  console.log(`═══════════════════════════════════════`)
  console.log(`Total templates in database: ${templates.length}`)
  console.log(`\n📚 Templates by Topic:`)
  
  const byTopic: Record<string, number> = {}
  for (const t of templates) {
    byTopic[t.topikKBC] = (byTopic[t.topikKBC] || 0) + 1
  }
  
  for (const [topic, count] of Object.entries(byTopic)) {
    console.log(`  - ${topic}: ${count} templates`)
  }
  
  console.log(`\n✅ All Templates:`)
  templates.forEach((t, i) => {
    const tujuanProfilParsed = JSON.parse(t.tujuanProfilLulusan || '{}')
    const kegiatanParsed = JSON.parse(t.kegiatanPembelajaran || '{}')
    const kerangkaParsed = JSON.parse(t.kerangkaPembelajaran || '{}')
    
    console.log(`  ${i + 1}. ${t.tema}`)
    console.log(`     Topik: ${t.topikKBC}`)
    console.log(`     Profil Lulusan: ${t.profilLulusan?.substring(0, 50)}...`)
    console.log(`     Tujuan Profil Lulusan: ${Object.keys(tujuanProfilParsed).length} categories`)
    console.log(`     Kerangka Pembelajaran: ${kerangkaParsed.description?.substring(0, 60)}...`)
    console.log(`     Kegiatan: ${Object.keys(kegiatanParsed).length} sections (pendahuluan, inti[${Array.isArray(kegiatanParsed.inti) ? kegiatanParsed.inti.length : 0}], penutup)`)
    console.log()
  })
  
  // Check for missing fields
  console.log(`\n🔍 Field Integrity Check:`)
  let issues = 0
  for (const t of templates) {
    if (!t.tema) { console.log(`  ⚠️  Template missing tema`); issues++ }
    if (!t.topikKBC) { console.log(`  ⚠️  Template "${t.tema}" missing topikKBC`); issues++ }
    if (!t.tujuanKBC) { console.log(`  ⚠️  Template "${t.tema}" missing tujuanKBC`); issues++ }
    if (!t.tujuanProfilLulusan) { console.log(`  ⚠️  Template "${t.tema}" missing tujuanProfilLulusan`); issues++ }
    if (!t.kegiatanPembelajaran) { console.log(`  ⚠️  Template "${t.tema}" missing kegiatanPembelajaran`); issues++ }
  }
  
  if (issues === 0) {
    console.log(`  ✅ All required fields present`)
  } else {
    console.log(`  ❌ Found ${issues} issues`)
  }
}

verify()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
