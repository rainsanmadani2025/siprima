import { PrismaClient } from '@prisma/client'

// Connect to backup database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:/home/z/my-project/backups/20260324_112000/database_backup.db'
    }
  }
})

async function checkBackupTemplates() {
  try {
    console.log('🔍 Checking BACKUP database for RPP Templates...\n')

    const templates = await prisma.rPPTemplate.findMany({
      where: { isActive: true },
      select: {
        id: true,
        tema: true,
        tujuanKBC: true,
        tujuanPembelajaranMendalam: true,
        tujuanPembelajaran: true
      }
    })

    console.log(`📊 Found ${templates.length} templates in backup\n`)

    if (templates.length === 0) {
      console.log('❌ No templates found in backup!')
      return
    }

    // Check first template content
    const template = templates[0]
    console.log('📋 Sample Template: ' + template.tema)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    const fields = [
      { name: 'Tujuan KBC', value: template.tujuanKBC },
      { name: 'Tujuan Pembelajaran Mendalam', value: template.tujuanPembelajaranMendalam },
      { name: 'Tujuan Pembelajaran', value: template.tujuanPembelajaran },
    ]

    console.log('📊 Field Lengths in BACKUP:\n')
    for (const field of fields) {
      const length = field.value?.length || 0
      console.log(`${field.name}: ${length} chars`)
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkBackupTemplates()
