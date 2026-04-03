import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper function untuk timeout
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    )
  ])
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tema, kelompokUsia, topikKBC } = body

    if (!tema) {
      return NextResponse.json(
        { success: false, error: 'Tema wajib diisi' },
        { status: 400 }
      )
    }

    console.log('[Generate Template] Starting generation for tema:', tema)

    // Import z-ai-web-dev-sdk dengan cara yang benar
    const ZAI = (await import('z-ai-web-dev-sdk')).default

    console.log('[Generate Template] Creating ZAI instance...')

    // Create ZAI instance dengan timeout
    let zai
    try {
      zai = await withTimeout(
        ZAI.create(),
        10000,
        'Gagal menginisialisasi ZAI SDK. Timeout setelah 10 detik.'
      )
    } catch (initError: any) {
      console.error('[Generate Template] Failed to initialize ZAI:', initError)
      // Cek jika error karena konfigurasi tidak ditemukan
      if (initError.message.includes('Configuration file not found') ||
          initError.message.includes('.z-ai-config')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Konfigurasi AI tidak ditemukan. File .z-ai-config dengan API key diperlukan untuk menggunakan fitur AI. Silakan gunakan template yang sudah tersedia.'
          },
          { status: 503 }
        )
      }
      throw initError
    }

    console.log('[Generate Template] ZAI instance created, generating content...')

    // Generate template menggunakan LLM
    const prompt = `Buat template RPP KBC dalam bentuk JSON untuk tema: ${tema}

Kelompok Usia: ${kelompokUsia || 'Kelompok B (5-6 Tahun)'}
Topik KBC: ${topikKBC || 'Cinta Diri dan Sesama'}

Buat JSON dengan struktur ini:
{
  "tema": "${tema}",
  "topikKBC": "Topik KBC yang relevan",
  "profilLulusan": "Daftar profil lulusan (pisahkan dengan koma)",
  "tujuanKBC": "Tujuan KBC dalam satu paragraf",
  "tujuanProfilLulusan": {
    "Kesehatan": "Tujuan kesehatan",
    "Kemandirian": "Tujuan kemandirian",
    "BernalarKritis": "Tujuan bernalar kritis",
    "Kreatif": "Tujuan kreatif",
    "Berkarakter": "Tujuan berkarakter",
    "Beriman": "Tujuan beriman",
    "Bertakwa": "Tujuan bertakwa"
  },
  "tujuanPembelajaranMendalam": "Daftar 3-5 KD",
  "materiIntegrasiKBC": "Materi integrasi KBC",
  "tujuanPembelajaran": "Tujuan pembelajaran",
  "kerangkaPembelajaran": {
    "praktekPedagogik": "Daftar 3-5 praktek pedagogik",
    "lingkunganPembelajaran": {
      "fisik": "Daftar 3-5 lingkungan fisik",
      "sosial": "Daftar 3-5 lingkungan sosial",
      "psikologis": "Daftar 3-5 lingkungan psikologis",
      "akademik": "Daftar 3-5 lingkungan akademik"
    },
    "kemitraanPembelajaran": "Daftar 3 kemitraan pembelajaran",
    "pemanfaatanDigital": "Daftar 3 pemanfaatan digital"
  },
  "kegiatanPembelajaran": {
    "persiapan": {
      "pemahamanKonsep": "Daftar 3-5 aktivitas",
      "penyiapanAlat": "Daftar 3-5 aktivitas",
      "alatBahan": "Daftar 5-7 alat dan bahan"
    },
    "pelaksanaan": {
      "orientasi": "Daftar 3-5 aktivitas",
      "eksplorasi": "Daftar 3-5 aktivitas",
      "diskusi": "Daftar 3-5 aktivitas",
      "kolaborasi": "Daftar 3-5 aktivitas",
      "refleksi": "Daftar 3-5 aktivitas"
    },
    "pembuatanKarya": {
      "proses": "Daftar 3-5 langkah",
      "hasil": "Daftar 3 hasil karya"
    },
    "presentasi": {
      "persiapan": "Daftar 3-5 langkah",
      "pelaksanaan": "Daftar 3-5 langkah"
    },
    "refleksiAkhir": {
      "refleksiGuru": "Daftar 3-5 aspek",
      "refleksiAnak": "Daftar 3-5 aspek"
    }
  },
  "rubrikPenilaian": {
    "Pemahaman Konsep": {
      "SB": "Deskripsi penilaian Sangat Baik (4) untuk Pemahaman Konsep sesuai tema ${tema}",
      "B": "Deskripsi penilaian Baik (3) untuk Pemahaman Konsep sesuai tema ${tema}",
      "C": "Deskripsi penilaian Cukup (2) untuk Pemahaman Konsep sesuai tema ${tema}",
      "K": "Deskripsi penilaian Kurang (1) untuk Pemahaman Konsep sesuai tema ${tema}"
    },
    "Keterampilan": {
      "SB": "Deskripsi penilaian Sangat Baik (4) untuk Keterampilan sesuai tema ${tema}",
      "B": "Deskripsi penilaian Baik (3) untuk Keterampilan sesuai tema ${tema}",
      "C": "Deskripsi penilaian Cukup (2) untuk Keterampilan sesuai tema ${tema}",
      "K": "Deskripsi penilaian Kurang (1) untuk Keterampilan sesuai tema ${tema}"
    },
    "Sikap & Perilaku": {
      "SB": "Deskripsi penilaian Sangat Baik (4) untuk Sikap & Perilaku sesuai tema ${tema}",
      "B": "Deskripsi penilaian Baik (3) untuk Sikap & Perilaku sesuai tema ${tema}",
      "C": "Deskripsi penilaian Cukup (2) untuk Sikap & Perilaku sesuai tema ${tema}",
      "K": "Deskripsi penilaian Kurang (1) untuk Sikap & Perilaku sesuai tema ${tema}"
    },
    "Kreativitas": {
      "SB": "Deskripsi penilaian Sangat Baik (4) untuk Kreativitas sesuai tema ${tema}",
      "B": "Deskripsi penilaian Baik (3) untuk Kreativitas sesuai tema ${tema}",
      "C": "Deskripsi penilaian Cukup (2) untuk Kreativitas sesuai tema ${tema}",
      "K": "Deskripsi penilaian Kurang (1) untuk Kreativitas sesuai tema ${tema}"
    },
    "Kolaborasi": {
      "SB": "Deskripsi penilaian Sangat Baik (4) untuk Kolaborasi sesuai tema ${tema}",
      "B": "Deskripsi penilaian Baik (3) untuk Kolaborasi sesuai tema ${tema}",
      "C": "Deskripsi penilaian Cukup (2) untuk Kolaborasi sesuai tema ${tema}",
      "K": "Deskripsi penilaian Kurang (1) untuk Kolaborasi sesuai tema ${tema}"
    }
  }
}

Hanya output JSON valid, tanpa penjelasan tambahan.`

    console.log('[Generate Template] Calling AI chat completion...')

    // Call AI dengan timeout 60 detik dan max_tokens yang lebih kecil
    const completion = await withTimeout(
      zai.chat.completions.create({
        messages: [
          {
            role: 'assistant',
            content: 'Buat JSON valid untuk template RPP KBC.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        thinking: { type: 'disabled' },
        max_tokens: 4000
      }),
      60000,
      'AI API tidak merespon dalam waktu 60 detik. Silakan coba lagi.'
    )

    console.log('[Generate Template] AI response received, parsing JSON...')

    // Parse JSON dari response
    const content = completion.choices[0]?.message?.content || ''

    console.log('[Generate Template] Response length:', content.length)
    console.log('[Generate Template] Response first 200 chars:', content.substring(0, 200))
    console.log('[Generate Template] Response last 200 chars:', content.substring(Math.max(0, content.length - 200)))

    let templateData

    try {
      // Cek jika response mengandung HTML (error page)
      if (content.trim().startsWith('<html') || content.trim().startsWith('<!DOCTYPE')) {
        console.error('[Generate Template] AI returned HTML instead of JSON')
        throw new Error('AI mengembalikan error page. Silakan coba lagi.')
      }

      // Cari JSON dalam response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error('[Generate Template] No JSON found in response')
        throw new Error('Tidak dapat menemukan JSON dalam response AI')
      }

      let sanitizedJson = jsonMatch[0]

      // Cek jika JSON terpotong (kurang closing brace/bracket)
      const openBraces = (sanitizedJson.match(/\{/g) || []).length
      const closeBraces = (sanitizedJson.match(/\}/g) || []).length
      const openBrackets = (sanitizedJson.match(/\[/g) || []).length
      const closeBrackets = (sanitizedJson.match(/\]/g) || []).length

      console.log('[Generate Template] Braces count:', { open: openBraces, close: closeBraces })
      console.log('[Generate Template] Brackets count:', { open: openBrackets, close: closeBrackets })

      // Jika kurang closing brace/bracket, JSON terpotong
      if (openBraces > closeBraces || openBrackets > closeBrackets) {
        console.error('[Generate Template] JSON is incomplete - AI response was truncated')
        return NextResponse.json(
          {
            success: false,
            error: 'Response AI terpotong. AI membutuhkan waktu lebih lama untuk menghasilkan konten. Silakan coba lagi dengan tema yang lebih sederhana.'
          },
          { status: 500 }
        )
      }

      // Sanitasi JSON - hapus karakter yang tidak valid
      sanitizedJson = sanitizedJson
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        // Hapus trailing commas
        .replace(/,(\s*[}\]])/g, '$1')

      console.log('[Generate Template] Parsed JSON successfully')

      templateData = JSON.parse(sanitizedJson)
    } catch (error: any) {
      console.error('[Generate Template] Error parsing JSON:', error)
      console.error('[Generate Template] Response content first 500 chars:', content.substring(0, 500))
      console.error('[Generate Template] Response content last 500 chars:', content.substring(Math.max(0, content.length - 500)))
      return NextResponse.json(
        { success: false, error: 'Gagal memformat data template. Silakan coba lagi.' },
        { status: 500 }
      )
    }

    console.log('[Generate Template] JSON parsed successfully, saving to database...')

    // Cek apakah template dengan tema yang sama sudah ada
    const existingTemplate = await db.rPPTemplate.findFirst({
      where: { tema: templateData.tema }
    })

    let savedTemplate

    if (existingTemplate) {
      // Update template yang sudah ada
      console.log('[Generate Template] Template already exists, updating...')
      
      let tujuanPembelajaranMendalamValue = ''
      if (Array.isArray(templateData.tujuanPembelajaranMendalam)) {
        tujuanPembelajaranMendalamValue = templateData.tujuanPembelajaranMendalam.join('\n')
      } else {
        tujuanPembelajaranMendalamValue = String(templateData.tujuanPembelajaranMendalam || '')
      }
      
      savedTemplate = await db.rPPTemplate.update({
        where: { id: existingTemplate.id },
        data: {
          topikKBC: templateData.topikKBC,
          profilLulusan: templateData.profilLulusan,
          tujuanKBC: templateData.tujuanKBC,
          tujuanProfilLulusan: JSON.stringify(templateData.tujuanProfilLulusan),
          tujuanPembelajaranMendalam: tujuanPembelajaranMendalamValue,
          materiIntegrasiKBC: templateData.materiIntegrasiKBC,
          tujuanPembelajaran: templateData.tujuanPembelajaran,
          kerangkaPembelajaran: typeof templateData.kerangkaPembelajaran === 'string'
            ? templateData.kerangkaPembelajaran
            : JSON.stringify(templateData.kerangkaPembelajaran),
          kegiatanPembelajaran: typeof templateData.kegiatanPembelajaran === 'string'
            ? templateData.kegiatanPembelajaran
            : JSON.stringify(templateData.kegiatanPembelajaran),
          rubrikPenilaian: templateData.rubrikPenilaian
            ? JSON.stringify(templateData.rubrikPenilaian)
            : null,
          updatedAt: new Date()
        }
      })
      console.log('[Generate Template] Template updated successfully:', savedTemplate.id)
    } else {
      // Simpan template baru
      console.log('[Generate Template] Creating new template...')
      
      console.log('[DEBUG] tujuanPembelajaranMendalam type:', typeof templateData.tujuanPembelajaranMendalam)
      console.log('[DEBUG] Is array?', Array.isArray(templateData.tujuanPembelajaranMendalam))
      
      let tujuanPembelajaranMendalamValue = ''
      if (Array.isArray(templateData.tujuanPembelajaranMendalam)) {
        tujuanPembelajaranMendalamValue = templateData.tujuanPembelajaranMendalam.join('\n')
        console.log('[DEBUG] Converted array to string, length:', tujuanPembelajaranMendalamValue.length)
      } else {
        tujuanPembelajaranMendalamValue = String(templateData.tujuanPembelajaranMendalam || '')
        console.log('[DEBUG] Converted to string:', tujuanPembelajaranMendalamValue.substring(0, 50))
      }
      
      savedTemplate = await db.rPPTemplate.create({
        data: {
          tema: templateData.tema,
          topikKBC: templateData.topikKBC,
          profilLulusan: templateData.profilLulusan,
          tujuanKBC: templateData.tujuanKBC,
          tujuanProfilLulusan: JSON.stringify(templateData.tujuanProfilLulusan),
          tujuanPembelajaranMendalam: tujuanPembelajaranMendalamValue,
          materiIntegrasiKBC: templateData.materiIntegrasiKBC,
          tujuanPembelajaran: templateData.tujuanPembelajaran,
          kerangkaPembelajaran: typeof templateData.kerangkaPembelajaran === 'string'
            ? templateData.kerangkaPembelajaran
            : JSON.stringify(templateData.kerangkaPembelajaran),
          kegiatanPembelajaran: typeof templateData.kegiatanPembelajaran === 'string'
            ? templateData.kegiatanPembelajaran
            : JSON.stringify(templateData.kegiatanPembelajaran),
          rubrikPenilaian: templateData.rubrikPenilaian
            ? JSON.stringify(templateData.rubrikPenilaian)
            : null,
          isActive: true
        }
      })
      console.log('[Generate Template] Template created successfully:', savedTemplate.id)
    }

    return NextResponse.json({
      success: true,
      updated: !!existingTemplate
    })
  } catch (error: any) {
    console.error('[Generate Template] Error generating template:', error)

    // Handle specific error cases
    const errorMessage = error.message || 'Gagal membuat template'

    if (errorMessage.includes('401') || errorMessage.includes('missing X-Token')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Autentikasi AI gagal. API key tidak valid atau belum dikonfigurasi. Fitur AI memerlukan file .z-ai-config dengan API key yang valid. Silakan gunakan template yang sudah tersedia.'
        },
        { status: 503 }
      )
    }

    if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit tercapai. Akun AI telah mencapai batas request. Silakan tunggu 1-2 menit sebelum mencoba lagi, atau gunakan template yang sudah tersedia.'
        },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}


