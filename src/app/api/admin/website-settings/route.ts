import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

// GET - Fetch website settings
export async function GET() {
  try {
    let settings = await db.siteSettings.findFirst()

    if (!settings) {
      // Create default row if not exists
      settings = await db.siteSettings.create({ data: defaultSettings })
    }

    return NextResponse.json({
      success: true,
      settings: {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        siteKeywords: settings.siteKeywords,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        contactAddress: settings.contactAddress,
        facebookUrl: settings.facebookUrl,
        instagramUrl: settings.instagramUrl,
        youtubeUrl: settings.youtubeUrl,
        enableRegistration: settings.enableRegistration,
        maintenanceMode: settings.maintenanceMode,
        themeColor: settings.themeColor,
      }
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

    let settings = await db.siteSettings.findFirst()

    if (!settings) {
      // Create if not exists
      settings = await db.siteSettings.create({ data: defaultSettings })
    }

    const updated = await db.siteSettings.update({
      where: { id: settings.id },
      data: {
        siteName: body.siteName,
        siteDescription: body.siteDescription,
        siteKeywords: body.siteKeywords,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        contactAddress: body.contactAddress,
        facebookUrl: body.facebookUrl,
        instagramUrl: body.instagramUrl,
        youtubeUrl: body.youtubeUrl,
        enableRegistration: body.enableRegistration,
        maintenanceMode: body.maintenanceMode,
        themeColor: body.themeColor,
      }
    })

    return NextResponse.json({
      success: true,
      settings: {
        siteName: updated.siteName,
        siteDescription: updated.siteDescription,
        siteKeywords: updated.siteKeywords,
        contactEmail: updated.contactEmail,
        contactPhone: updated.contactPhone,
        contactAddress: updated.contactAddress,
        facebookUrl: updated.facebookUrl,
        instagramUrl: updated.instagramUrl,
        youtubeUrl: updated.youtubeUrl,
        enableRegistration: updated.enableRegistration,
        maintenanceMode: updated.maintenanceMode,
        themeColor: updated.themeColor,
      }
    })
  } catch (error) {
    console.error('Error updating website settings:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update website settings'
    }, { status: 500 })
  }
}