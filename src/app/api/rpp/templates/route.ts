import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Create fresh Prisma Client instance
const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get templates
    const templates = await prisma.rPPTemplate.findMany({
      where: { isActive: true },
      select: {
        id: true,
        tema: true,
        topikKBC: true,
      },
      orderBy: { tema: 'asc' }
    })

    return NextResponse.json({
      success: true,
      templates: templates
    })
  } catch (error: any) {
    console.error('Error fetching RPP templates:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
