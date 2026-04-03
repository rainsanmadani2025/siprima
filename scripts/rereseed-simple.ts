import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Starting re-seed with COMPLETE templates...\n')

  try {
    // Step 1: Delete all existing templates
    console.log('🗑️  Deleting all existing templates...')
    const deleteCount = await prisma.rPPTemplate.deleteMany({})
    console.log(`   Deleted ${deleteCount.count} templates\n`)

    // Step 2: Import templates directly from extracted file
    console.log('📖 Importing complete template data...')
    const seedModule = await import('/tmp/extracted-templates.ts')
    const kbcTemplates = seedModule.kbcTemplates

    console.log(`   Found ${kbcTemplates.length} templates to seed\n`)

    // Step 3: Insert each template
    console.log('📝 Seeding templates with COMPLETE content...\n')
    
    let successCount = 0
    for (const template of kbcTemplates) {
      try {
        await prisma.rPPTemplate.create({
          data: {
            tema: template.tema,
            topikKBC: template.topikKBC,
            profilLulusan: template.profilLulusan,
            tujuanKBC: template.tujuanKBC,
            tujuanProfilLulusan: JSON.stringify(template.tujuanProfilLulusan),
            tujuanPembelajaranMendalam: template.tujuanPembelajaranMendalam,
            materiIntegrasiKBC: template.materiIntegrasiKBC || '',
            tujuanPembelajaran: template.tujuanPembelajaran || '',
            kerangkaPembelajaran: JSON.stringify(template.kerangkaPembelajaran),
            kegiatanPembelajaran: JSON.stringify(template.kegiatanPembelajaran),
            rubrikPenilaian: template.rubrikPenilaian ? JSON.stringify(template.rubrikPenilaian) : null,
            isActive: true
          }
        })
        console.log(`✓ Template "${template.tema}" (Topik: ${template.topikKBC})`)
        successCount++
      } catch (error) {
        console.error(`✗ Failed to seed "${template.tema}":`, error)
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`✅ Seeding completed!`)
    console.log(`   Success: ${successCount}/${kbcTemplates.length}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
