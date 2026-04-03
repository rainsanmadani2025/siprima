import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkJsonFields() {
  console.log('=== CHECKING JSON FIELDS IN DATABASE ===\n')

  const template = await prisma.rPPTemplate.findFirst()

  if (!template) {
    console.log('No templates found')
    await prisma.$disconnect()
    return
  }

  console.log('Template ID:', template.id)
  console.log('Tema:', template.tema)
  console.log('\nkerangkaPembelajaran type:', typeof template.kerangkaPembelajaran)
  console.log('kerangkaPembelajaran length:', template.kerangkaPembelajaran?.length || 0)
  console.log('kerangkaPembelajaran first 200 chars:', template.kerangkaPembelajaran?.substring(0, 200))

  console.log('\nkegiatanPembelajaran type:', typeof template.kegiatanPembelajaran)
  console.log('kegiatanPembelajaran length:', template.kegiatanPembelajaran?.length || 0)
  console.log('kegiatanPembelajaran first 200 chars:', template.kegiatanPembelajaran?.substring(0, 200))

  console.log('\ntujuanProfilLulusan type:', typeof template.tujuanProfilLulusan)
  console.log('tujuanProfilLulusan length:', template.tujuanProfilLulusan?.length || 0)
  console.log('tujuanProfilLulusan first 200 chars:', template.tujuanProfilLulusan?.substring(0, 200))

  // Try to parse them
  try {
    const kerangka = JSON.parse(template.kerangkaPembelajaran || '{}')
    console.log('\nkerangkaPembelajaran parsed keys:', Object.keys(kerangka))
    console.log('kerangkaPembelajaran has praktekPedagogik:', 'praktekPedagogik' in kerangka)
    console.log('kerangkaPembelajaran has lingkunganPembelajaran:', 'lingkunganPembelajaran' in kerangka)
  } catch (e) {
    console.log('\nERROR parsing kerangkaPembelajaran:', e.message)
  }

  try {
    const kegiatan = JSON.parse(template.kegiatanPembelajaran || '{}')
    console.log('\nkegiatanPembelajaran parsed keys:', Object.keys(kegiatan))
    console.log('kegiatanPembelajaran has persiapan:', 'persiapan' in kegiatan)
    console.log('kegiatanPembelajaran has pelaksanaan:', 'pelaksanaan' in kegiatan)
  } catch (e) {
    console.log('\nERROR parsing kegiatanPembelajaran:', e.message)
  }

  await prisma.$disconnect()
}

checkJsonFields()
