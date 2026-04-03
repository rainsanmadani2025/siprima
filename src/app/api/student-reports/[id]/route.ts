import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT - Update raport
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      semester,
      academicYear,
      assessments,
      teacherNotes,
      parentSuggestion,
      activities,
      status
    } = body

    const report = await db.studentReport.update({
      where: { id: params.id },
      data: {
        semester: semester || undefined,
        academicYear: academicYear || undefined,
        assessments: assessments ? JSON.stringify(assessments) : undefined,
        teacherNotes: teacherNotes || undefined,
        parentSuggestion: parentSuggestion || undefined,
        activities: activities ? JSON.stringify(activities) : undefined,
        status: status || undefined
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            nis: true
          }
        }
      }
    })

    return NextResponse.json({ report })
  } catch (error) {
    console.error('Error updating student report:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate raport' },
      { status: 500 }
    )
  }
}

// DELETE - Hapus raport
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.studentReport.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Raport berhasil dihapus' })
  } catch (error) {
    console.error('Error deleting student report:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus raport' },
      { status: 500 }
    )
  }
}
