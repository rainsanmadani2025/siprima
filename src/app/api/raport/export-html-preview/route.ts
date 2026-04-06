import { NextRequest, NextResponse } from 'next/server'

const scoreLabels: Record<string, string> = {
  BB: 'Belum Berkembang',
  MB: 'Mulai Berkembang',
  BSH: 'Berkembang Sesuai Harapan',
  BSB: 'Berkembang Sangat Baik'
}

function sanitizeHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>')
}

async function createHTMLPreview(data: any): Promise<string> {
  const aspects = [
    { key: 'agama_budi_pekerti', label: 'A. Nilai Agama dan Budi Pekerti' },
    { key: 'jati_diri', label: 'B. Jati Diri' },
    { key: 'literasi_sains', label: 'C. Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa dan Seni' }
  ]

  const scores = ['BB', 'MB', 'BSH', 'BSB']

  let html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview Raport - ${data.studentName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 20px;
      background: #f5f5f5;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #333;
    }
    
    .header h1 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #000;
    }
    
    .header p {
      font-size: 14px;
      color: #666;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .info-item {
      display: flex;
      gap: 10px;
    }
    
    .info-label {
      font-weight: bold;
      min-width: 120px;
    }
    
    .aspect-section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .aspect-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #1a365d;
    }
    
    .score-section {
      margin-bottom: 15px;
    }
    
    .score-label {
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .score-options {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }
    
    .score-option {
      padding: 5px 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 12px;
    }
    
    .score-option.selected {
      background: #4a5568;
      color: white;
      border-color: #4a5568;
    }
    
    .observation-section {
      margin-top: 15px;
    }
    
    .observation-label {
      font-weight: bold;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .observation-text {
      padding: 10px;
      background: #f9f9f9;
      border: 1px dashed #ccc;
      border-radius: 4px;
      min-height: 60px;
      font-size: 12px;
      text-align: justify;
    }
    
    .section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #1a365d;
    }
    
    .attendance-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    
    .attendance-item {
      text-align: center;
    }
    
    .attendance-value {
      font-size: 24px;
      font-weight: bold;
      margin: 10px 0;
    }
    
    .signature-section {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      margin-top: 50px;
      padding-top: 30px;
    }
    
    .signature-item {
      text-align: center;
    }
    
    .signature-title {
      font-weight: bold;
      margin-bottom: 60px;
    }
    
    .signature-name {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .signature-line {
      border-bottom: 1px solid #333;
      margin-bottom: 10px;
    }
    
    .nuptk {
      font-size: 11px;
      color: #666;
    }
    
    .photos-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }
    
    .photo-item {
      aspect-ratio: 1;
      background: #f0f0f0;
      border: 2px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .photo-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .preview-badge {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f59e0b;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: bold;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000;
    }
  </style>
</head>
<body>
  <div class="preview-badge">PREVIEW MODE</div>
  
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>${sanitizeHTML(data.schoolName || 'RA INSAN MADANI')}</h1>
      <p>Laporan Perkembangan Anak</p>
    </div>
    
    <!-- Student Info -->
    <div class="info-grid">
      <div>
        <div class="info-item">
          <span class="info-label">Nama</span>
          <span>: ${sanitizeHTML(data.studentName)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">NIS/NISN</span>
          <span>: ${data.studentNis} / ${data.studentNisn || '-'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Madrasah</span>
          <span>: ${sanitizeHTML(data.schoolName)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Alamat</span>
          <span>: ${sanitizeHTML(data.schoolAddress || '-')}</span>
        </div>
      </div>
      <div>
        <div class="info-item">
          <span class="info-label">Kelas</span>
          <span>: ${data.className}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Fase</span>
          <span>: Pondasi</span>
        </div>
        <div class="info-item">
          <span class="info-label">Semester</span>
          <span>: ${data.semester}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Tahun Ajaran</span>
          <span>: ${data.academicYear}</span>
        </div>
      </div>
    </div>
    
    <!-- Aspects -->
    ${aspects.map(aspect => {
      const assessment = data.assessments[aspect.key]
      const score = assessment?.score || ''
      
      return `
    <div class="aspect-section">
      <div class="aspect-title">${aspect.label}</div>
      
      <div class="score-section">
        <div class="score-label">Penilaian:</div>
        <div class="score-options">
          ${scores.map(s => `
            <div class="score-option ${s === score ? 'selected' : ''}">
              ${s}
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="observation-section">
        <div class="observation-label">Catatan Perkembangan:</div>
        <div class="observation-text">
          ${sanitizeHTML(assessment?.observation || '.....................................................................................................................................................................................................................................')}
        </div>
      </div>
    </div>
      `
    }).join('')}
    
    <!-- Observasi Kegiatan -->
    <div class="section">
      <div class="section-title">Observasi Kegiatan</div>
      <div class="observation-text">
        ${sanitizeHTML(data.assessments?.catatan_perkembangan?.observation || '.....................................................................................................................................................................................................................................')}
      </div>
    </div>
    
    <!-- Catatan Anekdot -->
    <div class="section">
      <div class="section-title">Catatan Anekdot</div>
      <div class="observation-text">
        ${sanitizeHTML(data.assessments?.catatan_perkembangan?.notes || '.....................................................................................................................................................................................................................................')}
      </div>
    </div>
    
    <!-- Dokumentasi Foto -->
    <div class="section">
      <div class="section-title">Dokumentasi Foto</div>
      ${(data.photos || []).length > 0 ? `
        <div class="photos-grid">
          ${data.photos.map((photo: string, index: number) => `
            <div class="photo-item">
              <img src="${photo}" alt="Foto ${index + 1}" />
            </div>
          `).join('')}
        </div>
      ` : '<p style="text-align: center; color: #666; padding: 20px;">Tidak ada foto dokumentasi</p>'}
    </div>
    
    <!-- Ketidakhadiran -->
    <div class="section">
      <div class="section-title">Ketidakhadiran</div>
      <div class="attendance-grid">
        <div class="attendance-item">
          <div>Sakit</div>
          <div class="attendance-value">${data.attendance?.sakit || 0}</div>
          <div>Hari</div>
        </div>
        <div class="attendance-item">
          <div>Izin</div>
          <div class="attendance-value">${data.attendance?.izin || 0}</div>
          <div>Hari</div>
        </div>
        <div class="attendance-item">
          <div>Alpa</div>
          <div class="attendance-value">${data.attendance?.alpa || 0}</div>
          <div>Hari</div>
        </div>
      </div>
    </div>
    
    <!-- Catatan Pendidik -->
    <div class="section">
      <div class="section-title">Catatan Pendidik</div>
      <div class="observation-text">
        ${sanitizeHTML(data.educatorNotes || '.....................................................................................................................................................................................................................................')}
      </div>
    </div>
    
    <!-- Signature Section -->
    <div class="signature-section">
      <div class="signature-item">
        <div class="signature-title">Orang Tua</div>
        <div class="signature-name">${sanitizeHTML(data.parentName || '................................')}</div>
      </div>
      <div class="signature-item">
        <div class="signature-title">Wali Kelas</div>
        <div class="signature-name">${sanitizeHTML(data.teacherName || '................................')}</div>
        <div class="signature-line"></div>
        ${data.teacherNip ? `<div class="nuptk">NUPTK : ${data.teacherNip}</div>` : ''}
      </div>
      <div class="signature-item">
        <div class="signature-title">Mengetahui,<br>Kepala Sekolah</div>
        <div class="signature-name">${sanitizeHTML(data.principalName || '................................')}</div>
        <div class="signature-line"></div>
        ${data.principalNip ? `<div class="nuptk">NUPTK : ${data.principalNip}</div>` : ''}
      </div>
    </div>
  </div>
</body>
</html>`

  return html
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

    const html = await createHTMLPreview(data)

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error: any) {
    console.error('Error generating HTML preview:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal membuat preview HTML' },
      { status: 500 }
    )
  }
}
