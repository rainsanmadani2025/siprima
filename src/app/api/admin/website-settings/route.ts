import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch website settings
export async function GET() {
  try {
    // For now, return default settings
    // In production, you might want to store this in the database
    const defaultSettings = {
      siteName: "RA Insan Madani",
      siteDescription: "RA Insan Madani - Membangun generasi berkarakter dan berakhlak mulia",
      siteKeywords: "RA, TK, PAUD, Insan Madani, Sekolah Islam",
      contactEmail: "info@ra-insanmadani.sch.id",
      contactPhone: "+62 812-3456-7890",
      contactAddress: "Jl. Pendidikan No. 123, Kota Bandung, Jawa Barat",
      facebookUrl: "",
      instagramUrl: "",
      youtubeUrl: "",
      enableRegistration: false,
      maintenanceMode: false,
      themeColor: "#3B82F6"
    }

    return NextResponse.json({
      success: true,
      settings: defaultSettings
    })
  } catch (error) {
    console.error('Error fetching website settings:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch website settings'
    }, { status: 500 })
  }
}

// PATCH - Update website settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    // For now, just return success
    // In production, you would save this to database or environment variables
    console.log('Website settings updated:', body)

    return NextResponse.json({
      success: true,
      settings: body
    })
  } catch (error) {
    console.error('Error updating website settings:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update website settings'
    }, { status: 500 })
  }
}
