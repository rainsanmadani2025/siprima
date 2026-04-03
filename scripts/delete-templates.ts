import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteTemplates() {
  try {
    console.log('🗑️  Deleting all RPP Templates...\n')

    const count = await prisma.rPPTemplate.deleteMany({})

    console.log(`✅ Deleted ${count.count} RPP Templates`)
    return true
  } catch (error) {
    console.error('❌ Error deleting templates:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

deleteTemplates()
