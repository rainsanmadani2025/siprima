import { NextRequest, NextResponse } from 'next/server'
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx'

const scoreLabels: Record<string, string> = {
  BB: 'Belum Berkembang',
  MB: 'Mulai Berkembang',
  BSH: 'Berkembang Sesuai Harapan',
  BSB: 'Berkembang Sangat Baik'
}

async function createWordDocument(data: any) {
  const children: any[] = []

  // Header Section
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.schoolName || 'RA INSAN MADANI',
          bold: true,
          size: 32,
          color: '000000'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Laporan Perkembangan Anak',
          bold: false,
          size: 24,
          color: '666666'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    })
  )

  // Horizontal line
  children.push(
    new Paragraph({
      children: [new TextRun('')],
      border: {
        bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 }
      },
      spacing: { after: 300 }
    })
  )

  // Student Information - Using paragraphs with tabs (NO TABLE)
  const infoData = [
    { label: 'NAMA', value: data.studentName },
    { label: 'NIS/NISN', value: `${data.studentNis} / ${data.studentNisn || '-'}` },
    { label: 'Madrasah', value: data.schoolName },
    { label: 'Alamat', value: data.schoolAddress || '-' },
  ]

  const infoDataRight = [
    { label: 'Kelas', value: data.className },
    { label: 'Fase', value: 'Pondasi' },
    { label: 'Semester', value: data.semester },
    { label: 'Tahun Ajaran', value: data.academicYear }
  ]

  // Left column info
  for (const info of infoData) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${info.label} : ${info.value}`,
            size: 20
          })
        ],
        spacing: { after: 100 },
        tabStops: [
          {
            type: 'left',
            position: 2500
          }
        ]
      })
    )
  }

  // Right column info (aligned to the right side)
  for (const info of infoDataRight) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `\t\t${info.label} : ${info.value}`,
            size: 20
          })
        ],
        spacing: { after: 100 },
        tabStops: [
          {
            type: 'left',
            position: 5000
          },
          {
            type: 'left',
            position: 6000
          }
        ]
      })
    )
  }

  children.push(new Paragraph({ text: '', spacing: { after: 300 } }))

  // Aspects Section
  const aspects = [
    { key: 'agama_budi_pekerti', label: 'A. Nilai Agama dan Budi Pekerti' },
    { key: 'jati_diri', label: 'B. Jati Diri' },
    { key: 'literasi_sains', label: 'C. Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa dan Seni' }
  ]

  for (const aspect of aspects) {
    const assessment = data.assessments[aspect.key]
    const score = assessment?.score || ''

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: aspect.label,
            bold: true,
            size: 22
          })
        ],
        spacing: { before: 300, after: 200 }
      })
    )

    // Scores
    const scores = ['BB', 'MB', 'BSH', 'BSB']
    const scoresText = scores.map(s => {
      const isSelected = s === score
      return `[${isSelected ? 'X' : ' '}] ${s}`
    }).join('  ')

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Penilaian:',
            bold: true,
            size: 20
          })
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: scoresText,
            size: 20
          })
        ],
        spacing: { after: 300 }
      })
    )

    // Notes
    const observation = assessment?.observation || ''
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Catatan Perkembangan:',
            bold: true,
            size: 20
          })
        ],
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: observation || '.....................................................................................................................................................................................................................................',
            size: 20
          })
        ],
        spacing: { after: 400, line: 360 }
      })
    )

    // Separator
    children.push(
      new Paragraph({
        children: [new TextRun('')],
        border: {
          bottom: { color: '808080', space: 1, style: BorderStyle.SINGLE, size: 3 }
        },
        spacing: { after: 300 }
      })
    )
  }

  // Observasi Kegiatan
  const obsKegiatan = data.assessments?.catatan_perkembangan?.observation || ''
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Observasi Kegiatan:',
          bold: true,
          size: 22
        })
      ],
      spacing: { before: 300, after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: obsKegiatan || '.....................................................................................................................................................................................................................................',
          size: 20
        })
      ],
      spacing: { after: 400, line: 360 }
    }),
    new Paragraph({
      children: [new TextRun('')],
      border: {
        bottom: { color: '808080', space: 1, style: BorderStyle.SINGLE, size: 3 }
      },
      spacing: { after: 300 }
    })
  )

  // Catatan Anekdot
  const notes = data.assessments?.catatan_perkembangan?.notes || ''
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Catatan Anekdot:',
          bold: true,
          size: 22
        })
      ],
      spacing: { before: 300, after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: notes || '.....................................................................................................................................................................................................................................',
          size: 20
        })
      ],
      spacing: { after: 400, line: 360 }
    }),
    new Paragraph({
      children: [new TextRun('')],
      border: {
        bottom: { color: '808080', space: 1, style: BorderStyle.SINGLE, size: 3 }
      },
      spacing: { after: 300 }
    })
  )

  // Dokumentasi Foto
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Dokumentasi Foto:',
          bold: true,
          size: 22
        })
      ],
      spacing: { before: 300, after: 200 }
    })
  )

  const photos = data.photos || []
  if (photos.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `(${photos.length} foto dokumentasi)`,
            size: 18,
            italics: true,
            color: '666666'
          })
        ],
        spacing: { after: 200 }
      })
    )
  } else {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '(Tidak ada foto yang diunggah)',
            size: 18,
            italics: true,
            color: '666666'
          })
        ],
        spacing: { after: 200 }
      })
    )
  }

  children.push(
    new Paragraph({
      children: [new TextRun('')],
      border: {
        bottom: { color: '808080', space: 1, style: BorderStyle.SINGLE, size: 3 }
      },
      spacing: { after: 300 }
    })
  )

  // Ketidakhadiran
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Ketidakhadiran:',
          bold: true,
          size: 22
        })
      ],
      spacing: { before: 300, after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Sakit   ${data.attendance.sakit}   Hari`,
          size: 20
        })
      ],
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Izin    ${data.attendance.izin}    Hari`,
          size: 20
        })
      ],
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Alpa    ${data.attendance.alpa}    Hari`,
          size: 20
        })
      ],
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [new TextRun('')],
      border: {
        bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 }
      },
      spacing: { after: 300 }
    })
  )

  // Catatan Pendidik
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Catatan Pendidik:',
          bold: true,
          size: 22
        })
      ],
      spacing: { before: 300, after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: data.educatorNotes || '.....................................................................................................................................................................................................................................',
          size: 20
        })
      ],
      spacing: { after: 400, line: 360 }
    }),
    new Paragraph({
      children: [new TextRun('')],
      border: {
        bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 }
      },
      spacing: { after: 800 }
    })
  )

  // Tanda Tangan Section
  // Row 1: Orang Tua (kiri) dan Wali Kelas (kanan)
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Orang Tua',
          bold: true,
          size: 20
        })
      ],
      spacing: { after: 300 }
    })
  )

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.parentName || 'Nama Orang Tua',
          size: 20
        })
      ],
      spacing: { after: 400 }
    })
  )

  // Tanda tangan di posisi kanan (Wali Kelas)
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Wali Kelas',
          bold: true,
          size: 20
        })
      ],
      spacing: { after: 300 },
      alignment: AlignmentType.RIGHT
    })
  )

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.teacherName || 'Nama Wali Kelas',
          size: 20
        })
      ],
      spacing: { after: 100 },
      alignment: AlignmentType.RIGHT
    })
  )

  children.push(
    new Paragraph({
      children: [new TextRun('_'.repeat(30))],
      spacing: { after: 200 },
      alignment: AlignmentType.RIGHT
    })
  )

  if (data.teacherNip) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `NUPTK/NPK : ${data.teacherNip}`,
            size: 16,
            color: '666666'
          })
        ],
        spacing: { after: 600 },
        alignment: AlignmentType.RIGHT
      })
    )
  } else {
    children.push(new Paragraph({ text: '', spacing: { after: 600 } }))
  }

  // Kepala Sekolah (tengah)
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Mengetahui,',
          bold: true,
          size: 20
        })
      ],
      spacing: { after: 200 },
      alignment: AlignmentType.CENTER
    })
  )

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Kepala Sekolah',
          bold: true,
          size: 20
        })
      ],
      spacing: { after: 300 },
      alignment: AlignmentType.CENTER
    })
  )

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.principalName || 'Nama Kepala Sekolah',
          size: 20
        })
      ],
      spacing: { after: 100 },
      alignment: AlignmentType.CENTER
    })
  )

  children.push(
    new Paragraph({
      children: [new TextRun('_'.repeat(30))],
      spacing: { after: 200 },
      alignment: AlignmentType.CENTER
    })
  )

  if (data.principalNip) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `NUPTK/NPK : ${data.principalNip}`,
            size: 16,
            color: '666666'
          })
        ],
        spacing: { after: 0 },
        alignment: AlignmentType.CENTER
      })
    )
  }

  // Create document
  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  })

  return doc
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.studentName || !data.period) {
      return NextResponse.json(
        { success: false, error: 'Data siswa dan periode diperlukan' },
        { status: 400 }
      )
    }

    const doc = await createWordDocument(data)
    const buffer = await Packer.toBuffer(doc)

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="Raport-${data.studentName}-${data.periodLabel}.docx"`,
      },
    })
  } catch (error: any) {
    console.error('Error generating Word document:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal membuat dokumen Word' },
      { status: 500 }
    )
  }
}
