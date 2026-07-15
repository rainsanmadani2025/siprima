const fs = require('fs')
const path = require('path')

let success = 0

// 1. rpp/list
try {
  fs.writeFileSync(path.join(__dirname, 'src/app/api/rpp/list/route.ts'), `import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')
    const tahunAjaran = searchParams.get('tahunAjaran')
    const search = searchParams.get('search')

    const where: Prisma.RPPWhereInput = {}

    if (semester) {
      where.semester = semester
    }
    if (tahunAjaran) {
      where.tahunAjaran = tahunAjaran
    }
    if (search) {
      where.OR = [
        { tema: { contains: search, mode: 'insensitive' } },
        { subtema: { contains: search, mode: 'insensitive' } },
        { judulKegiatan: { contains: search, mode: 'insensitive' } }
      ]
    }

    const rpps = await db.rPP.findMany({
      where,
      select: {
        id: true,
        tema: true,
        subtema: true,
        temaProjek: true,
        judulKegiatan: true,
        pokokBahasan: true,
        fase: true,
        kelompokUsia: true,
        semester: true,
        tahunAjaran: true,
        hari: true,
        jumlahPertemuan: true,
        kelas: true,
        guru: true,
        namaSekolah: true,
        alamatSekolah: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      rpps
    })
  } catch (error: any) {
    console.error('Error fetching RPP list:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil daftar RPP' },
      { status: 500 }
    )
  }
}`)
  console.log('OK 1/6 rpp/list')
  success++
} catch (e) { console.log('GAGAL 1/6: ' + e.message) }

// 2. prosem/list
try {
  fs.writeFileSync(path.join(__dirname, 'src/app/api/prosem/list/route.ts'), `import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')
    const tahunAjaran = searchParams.get('tahunAjaran')

    const teacher = await db.teacher.findFirst()

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Teacher not found' },
        { status: 404 }
      )
    }

    const where: Prisma.ProsemWhereInput = {
      teacherId: teacher.id
    }

    if (semester) {
      where.semester = semester
    }
    if (tahunAjaran) {
      where.tahunAjaran = tahunAjaran
    }

    const prosems = await db.prosem.findMany({
      where,
      select: {
        id: true,
        teacherId: true,
        tahunAjaran: true,
        semester: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      prosems
    })
  } catch (error: any) {
    console.error('Error fetching PROSEM list:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil daftar PROSEM' },
      { status: 500 }
    )
  }
}`)
  console.log('OK 2/6 prosem/list')
  success++
} catch (e) { console.log('GAGAL 2/6: ' + e.message) }

// 3. prosem/detail
try {
  fs.writeFileSync(path.join(__dirname, 'src/app/api/prosem/detail/route.ts'), `import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID wajib diisi' },
        { status: 400 }
      )
    }

    const prosem = await db.prosem.findUnique({
      where: { id },
      select: {
        id: true,
        teacherId: true,
        tahunAjaran: true,
        semester: true,
        mingguan: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!prosem) {
      return NextResponse.json(
        { success: false, error: 'PROSEM tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      prosem
    })
  } catch (error: any) {
    console.error('Error fetching PROSEM detail:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil detail PROSEM' },
      { status: 500 }
    )
  }
}`)
  console.log('OK 3/6 prosem/detail')
  success++
} catch (e) { console.log('GAGAL 3/6: ' + e.message) }

// 4. prosem/delete
try {
  fs.writeFileSync(path.join(__dirname, 'src/app/api/prosem/delete/route.ts'), `import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID wajib diisi' },
        { status: 400 }
      )
    }

    await db.prosem.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'PROSEM berhasil dihapus'
    })
  } catch (error: any) {
    console.error('Error deleting PROSEM:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus PROSEM' },
      { status: 500 }
    )
  }
}`)
  console.log('OK 4/6 prosem/delete')
  success++
} catch (e) { console.log('GAGAL 4/6: ' + e.message) }

// 5. prosem/save
try {
  fs.writeFileSync(path.join(__dirname, 'src/app/api/prosem/save/route.ts'), `import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, tahunAjaran, semester, mingguan } = body

    const teacher = await db.teacher.findFirst()

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: 'Teacher not found' },
        { status: 404 }
      )
    }

    if (!tahunAjaran || !semester || !mingguan) {
      return NextResponse.json(
        { success: false, error: 'Data tidak lengkap. Mohon isi semua field yang diperlukan.' },
        { status: 400 }
      )
    }

    const mingguanStr = typeof mingguan === 'string' ? mingguan : JSON.stringify(mingguan)

    let prosem

    if (id) {
      prosem = await db.prosem.update({
        where: { id },
        data: {
          tahunAjaran,
          semester,
          mingguan: mingguanStr
        }
      })
    } else {
      prosem = await db.prosem.create({
        data: {
          teacherId: teacher.id,
          tahunAjaran,
          semester,
          mingguan: mingguanStr
        }
      })
    }

    return NextResponse.json({
      success: true,
      prosem
    })
  } catch (error: any) {
    console.error('Error saving PROSEM:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal menyimpan PROSEM' },
      { status: 500 }
    )
  }
}`)
  console.log('OK 5/6 prosem/save')
  success++
} catch (e) { console.log('GAGAL 5/6: ' + e.message) }

// 6. kepsek/data
try {
  fs.writeFileSync(path.join(__dirname, 'src/app/api/kepsek/data/route.ts'), `import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const kepsekUser = await db.user.findFirst({
      where: { role: 'KEPSEK' },
      include: {
        teacher: {
          select: { nuptk: true }
        }
      }
    })

    if (!kepsekUser) {
      return NextResponse.json({
        success: false,
        error: 'Kepala Sekolah tidak ditemukan'
      })
    }

    return NextResponse.json({
      success: true,
      kepsek: {
        name: kepsekUser.name,
        nuptk: kepsekUser.teacher?.nuptk || null
      }
    })
  } catch (error: any) {
    console.error('Error fetching kepsek data:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data Kepala Sekolah' },
      { status: 500 }
    )
  }
}`)
  console.log('OK 6/6 kepsek/data')
  success++
} catch (e) { console.log('GAGAL 6/6: ' + e.message) }

console.log('')
console.log('SELESAI! ' + success + '/6 file diperbaiki.')
console.log('Lanjut: npm run build')