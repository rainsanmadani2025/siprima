import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const dbAny = db as any
    const models = Object.keys(dbAny).filter(key =>
      typeof dbAny[key] === 'object' &&
      dbAny[key] !== null &&
      typeof dbAny[key].findMany === 'function'
    )

    return NextResponse.json({
      success: true,
      models
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}
