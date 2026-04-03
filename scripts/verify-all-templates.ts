import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyTemplates() {
  try {
    console.log('🔍 Verifying seeded templates...\n')

    const templates = await prisma.rPPTemplate.findMany({
      where: { isActive: true },
      orderBy: { tema: 'asc' }
    })

    console.log(`📊 Found ${templates.length} templates\n`)

    if (templates.length > 0) {
      console.log('📋 Template List:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      
      for (const template of templates) {
        const tKBC = template.tujuanKBC?.substring(0, 80) || ''
        console.log(`✅ ${template.tema}`)
        console.log(`   Topik: ${template.topikKBC}`)
        console.log(`   Tujuan KBC: ${tKBC}...`)
        console.log()
      }
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyTemplates()
