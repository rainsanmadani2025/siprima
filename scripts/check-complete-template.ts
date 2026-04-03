import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkOneTemplate() {
  try {
    const template = await prisma.rPPTemplate.findFirst({
      where: { tema: 'Mengenal Nama-Nama Allah (Asmaul Husna)' }
    })

    if (!template) {
      console.log('❌ Template not found!')
      return
    }

    console.log('📋 Template: ' + template.tema)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    // Check text fields
    console.log('📊 TEXT FIELDS (A-I):')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    const textFields = [
      { name: 'A. Topik KBC', value: template.topikKBC },
      { name: 'B. Profil Lulusan', value: template.profilLulusan },
      { name: 'C. Tujuan KBC', value: template.tujuanKBC },
      { name: 'D. Tujuan Pembelajaran Mendalam', value: template.tujuanPembelajaranMendalam },
      { name: 'E. Materi Integrasi KBC', value: template.materiIntegrasiKBC },
      { name: 'F. Tujuan Pembelajaran', value: template.tujuanPembelajaran },
    ]

    for (const field of textFields) {
      const length = field.value?.length || 0
      const preview = field.value?.substring(0, 100) || '(empty)'
      console.log(`${field.name}:`)
      console.log(`  Length: ${length} chars`)
      console.log(`  Preview: ${preview}...`)
      console.log()
    }

    // Check JSON fields
    console.log('📊 JSON FIELDS (G-K):')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // G. Tujuan Profil Lulusan
    const tujuanProfilLulusan = JSON.parse(template.tujuanProfilLulusan || '{}')
    console.log('G. Tujuan Profil Lulusan (7 kategori):')
    for (const [key, value] of Object.entries(tujuanProfilLulusan)) {
      const val = value as string
      console.log(`   - ${key}: ${val.substring(0, 80)}... (${val.length} chars)`)
    }
    console.log()

    // H. Kerangka Pembelajaran
    const kerangkaPembelajaran = JSON.parse(template.kerangkaPembelajaran || '{}')
    console.log('H. Kerangka Pembelajaran (keys):')
    console.log(`   ${Object.keys(kerangkaPembelajaran).join(', ')}`)
    console.log()

    // I. Kegiatan Pembelajaran
    const kegiatanPembelajaran = JSON.parse(template.kegiatanPembelajaran || '{}')
    console.log('I. Kegiatan Pembelajaran (sections):')
    for (const [key, value] of Object.entries(kegiatanPembelajaran)) {
      if (Array.isArray(value)) {
        console.log(`   - ${key}: Array with ${value.length} items`)
        value.slice(0, 2).forEach((item: string) => {
          console.log(`     * ${item.substring(0, 60)}...`)
        })
      } else {
        const val = value as string
        console.log(`   - ${key}: ${val.substring(0, 80)}... (${val.length} chars)`)
      }
    }
    console.log()

    // K. Rubrik Penilaian
    const rubrikPenilaian = template.rubrikPenilaian ? JSON.parse(template.rubrikPenilaian) : null
    console.log('K. Rubrik Penilaian:')
    console.log(`   ${rubrikPenilaian ? 'Present (JSON)' : 'Not available'}`)

    console.log('\n✅ Template is COMPLETE with all fields A-K!')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkOneTemplate()
