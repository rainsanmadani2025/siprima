import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Starting re-seed with COMPLETE templates...\n')

  try {
    // Step 1: Delete all existing templates
    console.log('🗑️  Deleting all existing templates...')
    const deleteCount = await prisma.rPPTemplate.deleteMany({})
    console.log(`   Deleted ${deleteCount.count} templates\n`)

    // Step 2: Read the original seed file
    console.log('📖 Reading complete template data...')
    const seedFile = readFileSync('/home/z/my-project/prisma/seed-kbc-templates.ts', 'utf-8')
    
    // Extract kbcTemplates array (lines 3-455)
    const lines = seedFile.split('\n')
    const arrayContent = lines.slice(2, 455).join('\n')
    
    // Remove lampiran lines and replace const with var
    const arrayWithoutLampiran = arrayContent.split('\n')
      .filter(line => !line.trim().startsWith('lampiran:'))
      .join('\n')
      .replace(/const /g, 'var ')
    
    // Parse as JavaScript
    const kbcTemplates = eval(`[${arrayWithoutLampiran}]`)
    
    console.log(`   Found ${kbcTemplates.length} templates to seed\n`)

    // Step 3: Insert each template with JSON.stringify for object fields
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
        console.log(`✓ Template "${template.tema}"`)
        successCount++
      } catch (error) {
        console.error(`✗ Failed to seed "${template.tema}":`, error.message)
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
