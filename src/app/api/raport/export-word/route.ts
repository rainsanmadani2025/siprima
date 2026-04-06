import { NextRequest, NextResponse } from 'next/server'
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, VerticalAlign, ImageRun } from 'docx'

// Score labels mapping
const scoreLabels: Record<string, string> = {
  BB: 'Belum Berkembang',
  MB: 'Mulai Berkembang',
  BSH: 'Berkembang Sesuai Harapan',
  BSB: 'Berkembang Sangat Baik'
}

function getBase64Image(base64: string): Buffer | null {
  if (!base64) return null

  try {
    // Handle data URL format: data:image/jpeg;base64,/9j/4AAQ...
    if (base64.includes(',')) {
      const base64Data = base64.split(',')[1]
      return Buffer.from(base64Data, 'base64')
    }
    // Handle pure base64 string
    return Buffer.from(base64, 'base64')
  } catch (error) {
    console.error('Error parsing base64 image:', error)
    return null
  }
}

function getImageType(base64: string): { extension: string; mimeType: string } {
  const lower = base64.toLowerCase()

  if (lower.includes('data:image/jpeg') || lower.includes('jpg')) {
    return { extension: 'jpg', mimeType: 'image/jpeg' }
  } else if (lower.includes('data:image/png') || lower.includes('png')) {
    return { extension: 'png', mimeType: 'image/png' }
  } else if (lower.includes('data:image/gif') || lower.includes('gif')) {
    return { extension: 'gif', mimeType: 'image/gif' }
  } else if (lower.includes('data:image/webp') || lower.includes('webp')) {
    return { extension: 'webp', mimeType: 'image/webp' }
  }

  return { extension: 'jpg', mimeType: 'image/jpeg' }
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

  // Student Information - Using 2-column table to match HTML preview
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            // Left column
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.TOP,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: `Nama : ${data.studentName}`, size: 20 })],
                  spacing: { after: 80 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: `NIS/NISN : ${data.studentNis} / ${data.studentNisn || '-'}`, size: 20 })],
                  spacing: { after: 80 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: `Madrasah : ${data.schoolName}`, size: 20 })],
                  spacing: { after: 80 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: `Alamat : ${data.schoolAddress || '-'}`, size: 20 })],
                  spacing: { after: 0 }
                })
              ]
            }),
            // Right column
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.TOP,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: `Kelas : ${data.className}`, size: 20 })],
                  spacing: { after: 80 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: `Fase : Pondasi`, size: 20 })],
                  spacing: { after: 80 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: `Semester : ${data.semester}`, size: 20 })],
                  spacing: { after: 80 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: `Tahun Ajaran : ${data.academicYear}`, size: 20 })],
                  spacing: { after: 0 }
                })
              ]
            })
          ]
        })
      ]
    })
  )

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

    // Scores - Individual checkboxes like HTML: [ ] BB  [X] MB  [ ] BSH  [ ] BSB
    const scores = ['BB', 'MB', 'BSH', 'BSB']
    const scoreRuns: TextRun[] = []

    scores.forEach((s, index) => {
      const isSelected = s === score
      scoreRuns.push(
        new TextRun({
          text: `[${isSelected ? 'X' : ' '}] ${s}`,
          bold: isSelected,
          size: 20
        })
      )

      // Add spacing between scores (not after the last one)
      if (index < scores.length - 1) {
        scoreRuns.push(
          new TextRun({
            text: '    ',
            size: 20
          })
        )
      }
    })

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
        children: scoreRuns,
        spacing: { after: 300 }
      })
    )

    // Notes - with justification
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
        spacing: { after: 400, line: 360 },
        alignment: AlignmentType.JUSTIFIED
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

  // Observasi Kegiatan - with justification
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
      spacing: { after: 400, line: 360 },
      alignment: AlignmentType.JUSTIFIED
    }),
    new Paragraph({
      children: [new TextRun('')],
      border: {
        bottom: { color: '808080', space: 1, style: BorderStyle.SINGLE, size: 3 }
      },
      spacing: { after: 300 }
    })
  )

  // Catatan Anekdot - with justification
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
      spacing: { after: 400, line: 360 },
      alignment: AlignmentType.JUSTIFIED
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
    // Create a 3-column table for photos
    const photoRows: TableRow[] = []
    const photosPerRow = 3

    for (let i = 0; i < photos.length; i += photosPerRow) {
      const rowCells: TableCell[] = []

      for (let j = 0; j < photosPerRow; j++) {
        const photoIndex = i + j
        const photo = photos[photoIndex]

        if (photo) {
          const imageBuffer = getBase64Image(photo)
          const imageType = getImageType(photo)

          if (imageBuffer) {
            rowCells.push(
              new TableCell({
                width: { size: 33.33, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: imageBuffer,
                        transformation: {
                          width: 150,
                          height: 150
                        },
                        type: imageType.mimeType as any
                      })
                    ],
                    alignment: AlignmentType.CENTER
                  })
                ]
              })
            )
          } else {
            // If image parsing fails, show placeholder
            rowCells.push(
              new TableCell({
                width: { size: 33.33, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Foto ${photoIndex + 1}\n(Error loading)`,
                        size: 18,
                        color: '666666'
                      })
                    ],
                    alignment: AlignmentType.CENTER
                  })
                ]
              })
            )
          }
        } else {
          // Empty cell for grid alignment
          rowCells.push(
            new TableCell({
              width: { size: 33.33, type: WidthType.PERCENTAGE },
              children: []
            })
          )
        }
      }

      photoRows.push(new TableRow({ children: rowCells }))
    }

    if (photoRows.length > 0) {
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
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: photoRows
        })
      )
    }
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

  // Catatan Pendidik - with justification
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
      spacing: { after: 400, line: 360 },
      alignment: AlignmentType.JUSTIFIED
    }),
    new Paragraph({
      children: [new TextRun('')],
      border: {
        bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 }
      },
      spacing: { after: 800 }
    })
  )

  // Tanda Tangan Section - Using 3-column table to match HTML preview
  children.push(
    new Paragraph({
      text: '',
      spacing: { before: 600, after: 0 }
    })
  )

  // Create table with 3 equal columns for signatures
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            // Column 1: Orang Tua
            new TableCell({
              width: { size: 33.33, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.TOP,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Orang Tua',
                      bold: true,
                      size: 20
                    })
                  ],
                  spacing: { after: 600 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: data.parentName || '................................',
                      size: 20
                    })
                  ],
                  spacing: { after: 0 }
                })
              ]
            }),
            // Column 2: Wali Kelas
            new TableCell({
              width: { size: 33.33, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.TOP,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Wali Kelas',
                      bold: true,
                      size: 20
                    })
                  ],
                  spacing: { after: 600 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: data.teacherName || '................................',
                      size: 20
                    })
                  ],
                  spacing: { after: 50 }
                }),
                new Paragraph({
                  children: [new TextRun('_'.repeat(30))],
                  spacing: { after: 100 }
                }),
                ...(data.teacherNip ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `NUPTK : ${data.teacherNip}`,
                        size: 16,
                        color: '666666'
                      })
                    ],
                    spacing: { after: 0 }
                  })
                ] : [])
              ]
            }),
            // Column 3: Kepala Sekolah
            new TableCell({
              width: { size: 33.33, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.TOP,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Mengetahui,',
                      bold: true,
                      size: 20
                    })
                  ],
                  spacing: { after: 0 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Kepala Sekolah',
                      bold: true,
                      size: 20
                    })
                  ],
                  spacing: { after: 600 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: data.principalName || '................................',
                      size: 20
                    })
                  ],
                  spacing: { after: 50 }
                }),
                new Paragraph({
                  children: [new TextRun('_'.repeat(30))],
                  spacing: { after: 100 }
                }),
                ...(data.principalNip ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `NUPTK : ${data.principalNip}`,
                        size: 16,
                        color: '666666'
                      })
                    ],
                    spacing: { after: 0 }
                  })
                ] : [])
              ]
            })
          ]
        })
      ]
    })
  )

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
