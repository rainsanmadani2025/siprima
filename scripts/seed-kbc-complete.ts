import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding 15 KBC Templates with COMPLETE content...\n')

  // Read the seed file
  const seedFile = path.join(__dirname, '../prisma/seed-kbc-templates.ts')
  const content = fs.readFileSync(seedFile, 'utf8')

  // Extract kbcTemplates array - from line 3 to 454
  const lines = content.split('\n')
  // Remove line 3 which contains "const kbcTemplates = ["
  const arrayContent = lines.slice(3, 454).join('\n')

  // Parse the array - we need to convert it to valid JS
  const templatesCode = `
    const kbcTemplates = ${arrayContent}

    module.exports = { kbcTemplates };
  `

  // Write temp file and require it
  const tempFile = path.join(__dirname, '../temp-templates.js')
  fs.writeFileSync(tempFile, templatesCode)

  // Delete existing templates
  await prisma.rPPTemplate.deleteMany({})
  console.log('🗑️  Cleared existing templates\n')

  const { kbcTemplates } = require('../temp-templates.js')

  let successCount = 0

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
          materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan konsep cinta (Cinta Diri, Cinta Sesama, Cinta Alam, Cinta Ilmu, Cinta Tuhan) melalui berbagai aktivitas yang menekankan pada pengembangan karakter, keterampilan, dan pengetahuan secara terpadu dan menyenangkan.",
          kerangkaPembelajaran: JSON.stringify(template.kerangkaPembelajaran || {}),
          kegiatanPembelajaran: JSON.stringify(template.kegiatanPembelajaran || {}),
          rubrikPenilaian: JSON.stringify(template.rubrikPenilaian || {}),
          isActive: true
        }
      })
      console.log(`✅ Template created: ${template.tema}`)
      successCount++
    } catch (error: any) {
      console.error(`❌ Error creating "${template.tema}":`, error.message)
    }
  }

  // Clean up temp file
  fs.unlinkSync(tempFile)

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Seeding completed!`)
  console.log(`   Successfully created: ${successCount}/${kbcTemplates.length}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
