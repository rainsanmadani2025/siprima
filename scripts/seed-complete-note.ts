import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// KBC Templates data
const kbcTemplates = [
  // Note: All templates from seed-kbc-templates.ts
  // For now, let's directly execute the seed file with modified import
]

async function main() {
  console.log('📋 This script will seed complete templates from seed-kbc-templates.ts')
  console.log('⚠️  Note: Due to file size, we need to run the seed file directly')
  console.log('\nPlease run: bun run prisma/seed-kbc-templates.ts (after modifying the import)')
}

main().finally(() => prisma.$disconnect())
