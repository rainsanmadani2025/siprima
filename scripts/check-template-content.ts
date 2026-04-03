import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkTemplateContent() {
  try {
    console.log('🔍 Checking RPP Template content...\n')

    const template = await prisma.rPPTemplate.findFirst({
      where: { tema: 'Diriku yang Berharga' }
    })

    if (!template) {
      console.log('❌ Template not found!')
      return
    }

    console.log('📋 Template: ' + template.tema)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    // Check each field's length
    const fields = [
      { name: 'Topik KBC', value: template.topikKBC },
      { name: 'Profil Lulusan', value: template.profilLulusan },
      { name: 'Tujuan KBC', value: template.tujuanKBC },
      { name: 'Tujuan Pembelajaran Mendalam', value: template.tujuanPembelajaranMendalam },
      { name: 'Materi Integrasi KBC', value: template.materiIntegrasiKBC },
      { name: 'Tujuan Pembelajaran', value: template.tujuanPembelajaran },
    ]

    console.log('📊 Field Lengths:\n')
    for (const field of fields) {
      const length = field.value?.length || 0
      const preview = field.value?.substring(0, 100) || '(empty)'
      console.log(`${field.name}:`)
      console.log(`  Length: ${length} chars`)
      console.log(`  Preview: ${preview}${length > 100 ? '...' : ''}`)
      console.log()
    }

    // Check JSON fields
    console.log('📊 JSON Fields:\n')

    const tujuanProfilLulusan = template.tujuanProfilLulusan
      ? JSON.parse(template.tujuanProfilLulusan)
      : {}
    console.log('Tujuan Profil Lulusan:')
    console.log('  ' + JSON.stringify(tujuanProfilLulusan, null, 2).substring(0, 300))
    console.log()

    const kerangkaPembelajaran = template.kerangkaPembelajaran
      ? JSON.parse(template.kerangkaPembelajaran)
      : {}
    console.log('Kerangka Pembelajaran (keys):')
    console.log('  ' + Object.keys(kerangkaPembelajaran).join(', '))
    console.log()

    const kegiatanPembelajaran = template.kegiatanPembelajaran
      ? JSON.parse(template.kegiatanPembelajaran)
      : {}
    console.log('Kegiatan Pembelajaran (keys):')
    console.log('  ' + Object.keys(kegiatanPembelajaran).join(', '))
    console.log()

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTemplateContent()
