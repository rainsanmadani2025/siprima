import { PrismaClient } from '@prisma/client'

// Create fresh Prisma Client instance
const prisma = new PrismaClient()

// Import templates from the original seed file
const { kbcTemplates } = require('../prisma/seed-kbc-templates.ts')

async function main() {
  console.log('🌱 Seeding RPP Templates with COMPLETE content...\n')
  console.log(`Found ${kbcTemplates.length} templates to seed\n`)

  let successCount = 0
  let skipCount = 0

  for (const template of kbcTemplates) {
    try {
      await prisma.rPPTemplate.create({
        data: {
          tema: template.tema,
          topikKBC: template.topikKBC,
          profilLulusan: template.profilLulusan || '',
          tujuanKBC: template.tujuanKBC || '',
          tujuanProfilLulusan: JSON.stringify(template.tujuanProfilLulusan || {}),
          tujuanPembelajaranMendalam: template.tujuanPembelajaranMendalam || '',
          kerangkaPembelajaran: JSON.stringify(template.kerangkaPembelajaran || {}),
          kegiatanPembelajaran: JSON.stringify(template.kegiatanPembelajaran || {}),
          isActive: true
        }
      })

      console.log(`✅ Template created: ${template.tema}`)
      successCount++
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⚠️  Template already exists: ${template.tema}`)
        skipCount++
      } else {
        console.error(`❌ Error creating template ${template.tema}:`, error.message)
      }
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Seeding completed!`)
  console.log(`   Successfully created: ${successCount}`)
  console.log(`   Skipped (already exists): ${skipCount}`)
  console.log(`   Total templates: ${kbcTemplates.length}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding templates:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
