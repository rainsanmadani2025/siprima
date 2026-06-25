import { NextRequest, NextResponse } from 'next/server'
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, VerticalAlign, HeightRule, ImageRun, ShadingType } from 'docx'
import fs from 'fs'
import path from 'path'

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

async function loadLogo(filename: string): Promise<{ data: Buffer; type: string } | null> {
  try {
    const logoPath = path.join(process.cwd(), 'upload', filename)
    const logoData = fs.readFileSync(logoPath)
    
    if (filename.toLowerCase().includes('.png')) {
      return { data: logoData, type: 'image/png' }
    } else if (filename.toLowerCase().includes('.jpg') || filename.toLowerCase().includes('.jpeg')) {
      return { data: logoData, type: 'image/jpeg' }
    }
    return null
  } catch (error) {
    console.error(`Error loading logo ${filename}:`, error)
    return null
  }
}

async function createWordDocument(data: any) {
  const children: any[] = []

  // Define no borders for tables
  const noBorders = {
    top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  }

  // Load logos
  const kemenagLogo = await loadLogo('Logo Kemenag.png')
  const raLogo = await loadLogo('LOGO RA.png')

  // Header Section with Logos - Using 3-column table for proper vertical alignment
  const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  const noBorders = {
    top: noBorder,
    bottom: noBorder,
    left: noBorder,
    right: noBorder
  }

  const headerCells: TableCell[] = []

  // Left column: Kemenag logo
  if (kemenagLogo) {
    headerCells.push(
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                data: kemenagLogo.data,
                transformation: { width: 60, height: 70 },
                type: kemenagLogo.type as any
              })
            ],
            alignment: AlignmentType.CENTER
          })
        ],
        width: { size: 1500, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        borders: noBorders
      })
    )
  } else {
    headerCells.push(
      new TableCell({
        children: [new Paragraph({ children: [] })],
        width: { size: 1500, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        borders: noBorders
      })
    )
  }

  // Center column: School name
  headerCells.push(
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: data.schoolName || 'RA INSAN MADANI',
              bold: true,
              size: 32,
              color: '000000'
            })
          ],
          alignment: AlignmentType.CENTER
        })
      ],
      width: { size: 5200, type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      borders: noBorders
    })
  )

  // Right column: RA logo
  if (raLogo) {
    headerCells.push(
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                data: raLogo.data,
                transformation: { width: 100, height: 120 },
                type: raLogo.type as any
              })
            ],
            alignment: AlignmentType.CENTER
          })
        ],
        width: { size: 1500, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        borders: noBorders
      })
    )
  } else {
    headerCells.push(
      new TableCell({
        children: [new Paragraph({ children: [] })],
        width: { size: 1500, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        borders: noBorders
      })
    )
  }

  children.push(
    new Table({
      rows: [
        new TableRow({
          children: headerCells,
          height: { value: 1400, rule: HeightRule.AT_LEAST }
        })
      ],
      width: { size: 8200, type: WidthType.DXA }
    })
  )

  children.push(
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

  // Double horizontal line
  children.push(
    new Paragraph({
      children: [new TextRun('')],
      border: {
        bottom: { color: '000000', space: 1, style: BorderStyle.DOUBLE, size: 12 }
      },
      spacing: { after: 300 }
    })
  )

  // Student Information - Using 6-column table to match sample
  // Column layout: Label | : | Value | Label | : | Value
  children.push(
    new Table({
      columnWidths: [1557, 76, 4604, 1558, 123, 1391], // DXA values from sample
      margins: { top: 100, bottom: 100, left: 100, right: 100 },
      rows: [
        new TableRow({
          children: [
            // NAMA
            new TableCell({
              width: { size: 1557, type: WidthType.DXA },
              borders: noBorders,
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Nama  ', size: 20 })],
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: 'NIS/NISN  ', size: 20 })],
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: 'Madrasah  ', size: 20 })],
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: 'Alamat ', size: 20 })],
                  spacing: { line: 280 }
                })
              ]
            }),
            // : column (left)
            new TableCell({
              width: { size: 76, type: WidthType.DXA },
              borders: noBorders,
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: ':', size: 20 })],
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: ':', size: 20 })],
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: ':', size: 20 })],
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: ':', size: 20 })],
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 280 }
                })
              ]
            }),
            // Values column (left)
            new TableCell({
              width: { size: 4604, type: WidthType.DXA },
              borders: noBorders,
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: ` ${data.studentName}`, size: 20 })],
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: ` ${data.studentNis} / ${data.studentNisn || '-'}`, size: 20 })],
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: ` ${data.schoolName}`, size: 20 })],
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: ` ${data.schoolAddress || '-'}`, size: 20 })],
                  spacing: { line: 280 }
                })
              ]
            }),
            // Kelas
            new TableCell({
              width: { size: 1558, type: WidthType.DXA },
              borders: noBorders,
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'Kelas', size: 20 })],
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: 'Fase ', size: 20 })],
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: 'Semester ', size: 20 })],
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: 'Tahun ', size: 20 })],
                  tabStops: [{ type: 'right', position: 1929 }],
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: 'Ajaran ', size: 20 })],
                  spacing: { line: 280 }
                })
              ]
            }),
            // : column (right)
            new TableCell({
              width: { size: 123, type: WidthType.DXA },
              borders: noBorders,
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: ':', size: 20 })],
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: ':', size: 20 })],
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: ':', size: 20 })],
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: ':', size: 20 })],
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: '', size: 20 })],
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 280 }
                })
              ]
            }),
            // Values column (right)
            new TableCell({
              width: { size: 1391, type: WidthType.DXA },
              borders: noBorders,
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: ` ${data.className}`, size: 20 })],
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: ` Pondasi`, size: 20 })],
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: ` ${data.semester}`, size: 20 })],
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: ` ${data.academicYear}`, size: 20 })],
                  spacing: { line: 280 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: '', size: 20 })],
                  spacing: { line: 280 }
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

    // Scores - Using circles like sample: ○ BB ● MB ○ BSH ○ BSB
    const scores = ['BB', 'MB', 'BSH', 'BSB']
    const scoreRuns: TextRun[] = []

    scores.forEach((s, index) => {
      const isSelected = s === score
      // Use Unicode circles: ○ (white) and ● (black)
      scoreRuns.push(
        new TextRun({
          text: `${isSelected ? '\u25CF' : '\u25CB'} ${isSelected ? s : s}`,
          bold: isSelected,
          size: 24
        })
      )

      // Add spacing between scores (not after the last one)
      if (index < scores.length - 1) {
        scoreRuns.push(
          new TextRun({
            text: '    ',
            size: 24
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
                width: { size: 3120, type: WidthType.DXA },
                verticalAlign: VerticalAlign.CENTER,
                borders: cellBorders,
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
                width: { size: 3120, type: WidthType.DXA },
                verticalAlign: VerticalAlign.CENTER,
                borders: cellBorders,
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
              width: { size: 3120, type: WidthType.DXA },
              borders: cellBorders,
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
          columnWidths: [3120, 3120, 3120],
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
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
        bottom: { color: '808080', space: 1, style: BorderStyle.SINGLE, size: 3 }
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
        bottom: { color: '808080', space: 1, style: BorderStyle.SINGLE, size: 3 }
      },
      spacing: { after: 800 }
    })
  )

  // Tanda Tangan Section - 2 rows with 3 columns to match sample
  // Row 1: Orang Tua (left), Empty (center), Wali Kelas (right)
  // Row 2: Empty, Kepala Sekolah (center), Empty
  // No borders for signature table
  children.push(
    new Table({
      columnWidths: [2300, 4000, 3066], // Approximate widths to match sample
      margins: { top: 100, bottom: 100, left: 100, right: 100 },
      rows: [
        // Row 1: Orang Tua, Empty, Wali Kelas
        new TableRow({
          children: [
            // Orang Tua
            new TableCell({
              width: { size: 2300, type: WidthType.DXA },
              borders: noBorders,
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
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 600 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '',
                      size: 20
                    })
                  ],
                  spacing: { after: 600 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '',
                      size: 20
                    })
                  ],
                  spacing: { after: 600 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '',
                      size: 20
                    })
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 0 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: data.parentName || 'Bapak',
                      size: 20
                    })
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 0 }
                })
              ]
            }),
            // Empty center column
            new TableCell({
              width: { size: 4000, type: WidthType.DXA },
              borders: noBorders,
              verticalAlign: VerticalAlign.TOP,
              children: [
                new Paragraph({
                  children: [new TextRun('')]
                })
              ]
            }),
            // Wali Kelas
            new TableCell({
              width: { size: 3066, type: WidthType.DXA },
              borders: noBorders,
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
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 600 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '',
                      size: 20
                    })
                  ],
                  spacing: { after: 600 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '',
                      size: 20
                    })
                  ],
                  spacing: { after: 600 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '',
                      size: 20
                    })
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 50 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${data.teacherName || 'Siti Fatimah'}, S.Pd`,
                      size: 20,
                      underline: {}
                    })
                  ],
                  alignment: AlignmentType.CENTER,
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
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 0 }
                  })
                ] : [])
              ]
            })
          ]
        }),
        // Row 2: Empty, Kepala Sekolah, Empty
        new TableRow({
          children: [
            // Empty left column
            new TableCell({
              width: { size: 2300, type: WidthType.DXA },
              borders: noBorders,
              verticalAlign: VerticalAlign.TOP,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '',
                      size: 20
                    })
                  ],
                  spacing: { after: 600 }
                })
              ]
            }),
            // Kepala Sekolah (center)
            new TableCell({
              width: { size: 4000, type: WidthType.DXA },
              borders: noBorders,
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
                  alignment: AlignmentType.CENTER,
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
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 600 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '',
                      size: 20
                    })
                  ],
                  spacing: { after: 600 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '',
                      size: 20
                    })
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 50 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${data.principalName || 'Neneng Mulyawati'}, S.Pd`,
                      size: 20,
                      underline: {}
                    })
                  ],
                  alignment: AlignmentType.CENTER,
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
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 0 }
                  })
                ] : [])
              ]
            }),
            // Empty right column
            new TableCell({
              width: { size: 3066, type: WidthType.DXA },
              borders: noBorders,
              verticalAlign: VerticalAlign.TOP,
              children: [
                new Paragraph({
                  children: [new TextRun('')]
                })
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
