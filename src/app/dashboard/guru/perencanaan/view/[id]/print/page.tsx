"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

interface RPPData {
  id: string
  tema: string
  subtema: string
  temaProjek: string
  judulKegiatan: string
  pokokBahasan?: string
  fase: string
  kelompokUsia: string
  semester: string
  tahunAjaran: string
  hari?: string
  jumlahPertemuan: string
  kelas?: string
  guru?: string
  namaSekolah: string
  alamatSekolah?: string
  topikKBC?: string
  profilLulusan?: string
  tujuanKBC?: string
  tujuanProfilLulusan?: any
  tujuanPembelajaranMendalam?: string
  materiIntegrasiKBC?: string
  tujuanPembelajaran?: string
  kerangkaPembelajaran?: any
  kegiatanPembelajaran?: any
  rubrikPenilaian?: any
  createdAt: string
  updatedAt: string
}

export default function PrintRPPPage() {
  const params = useParams()
  const [rpp, setRpp] = useState<RPPData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchRPPDetail(params.id as string)
    }
  }, [params.id])

  const fetchRPPDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/rpp/detail?id=${id}`)
      const data = await response.json()
      if (data.success) {
        setRpp(data.rpp)
      }
    } catch (error) {
      console.error('Error fetching RPP detail:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && rpp) {
      window.print()
    }
  }, [loading, rpp])

  const formatText = (text?: string) => {
    if (!text) return '-'
    return text.split('\n').map((line, i) => (
      <p key={i} style={{ marginBottom: '4px' }}>{line}</p>
    ))
  }

  if (loading || !rpp) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <p>Memuat RPP...</p>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'serif', padding: '40px', maxWidth: '210mm', margin: '0 auto', lineHeight: '1.6' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{rpp.namaSekolah}</h1>
        {rpp.alamatSekolah && (
          <p style={{ fontSize: '12px', margin: '0 0 8px 0' }}>{rpp.alamatSekolah}</p>
        )}
        <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>Rencana Pelaksanaan Pembelajaran</h2>
        <p style={{ fontSize: '13px', margin: '0 0 16px 0' }}>Kurikulum Berbasis Cinta (KBC)</p>
        <div style={{ borderBottom: '2px solid #000', paddingBottom: '8px' }}></div>
      </div>

      <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>A. Identitas Pembelajaran</h3>
        <table style={{ width: '100%', fontSize: '13px' }}>
          <tbody>
            <tr><td style={{ width: '200px' }}><strong>Fase:</strong></td><td>{rpp.fase}</td><td style={{ width: '200px' }}><strong>Kelompok Usia:</strong></td><td>{rpp.kelompokUsia}</td></tr>
            <tr><td><strong>Semester:</strong></td><td>{rpp.semester}</td><td><strong>Tahun Ajaran:</strong></td><td>{rpp.tahunAjaran}</td></tr>
            <tr><td><strong>Hari:</strong></td><td>{rpp.hari || '-'}</td><td><strong>Jumlah Pertemuan:</strong></td><td>{rpp.jumlahPertemuan}</td></tr>
            <tr><td><strong>Kelas:</strong></td><td>{rpp.kelas || '-'}</td><td><strong>Guru:</strong></td><td>{rpp.guru || '-'}</td></tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>B. Tema Projek</h3>
        <table style={{ width: '100%', fontSize: '13px' }}>
          <tbody>
            <tr><td style={{ width: '160px', verticalAlign: 'top' }}><strong>Tema:</strong></td><td>{rpp.tema}</td></tr>
            <tr><td style={{ verticalAlign: 'top' }}><strong>Subtema:</strong></td><td>{rpp.subtema}</td></tr>
            <tr><td style={{ verticalAlign: 'top' }}><strong>Tema Projek:</strong></td><td>{rpp.temaProjek}</td></tr>
            <tr><td style={{ verticalAlign: 'top' }}><strong>Judul Kegiatan:</strong></td><td>{rpp.judulKegiatan}</td></tr>
            <tr><td style={{ verticalAlign: 'top' }}><strong>Pokok Bahasan:</strong></td><td>{rpp.pokokBahasan || '-'}</td></tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>C. Topik KBC</h3>
        <div style={{ fontSize: '13px' }}>{formatText(rpp.topikKBC)}</div>
      </div>

      <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>D. Profil Lulusan</h3>
        <div style={{ fontSize: '13px' }}>{formatText(rpp.profilLulusan)}</div>
      </div>

      <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>E. Tujuan KBC</h3>
        <div style={{ fontSize: '13px' }}>{formatText(rpp.tujuanKBC)}</div>
      </div>

      <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>F. Tujuan Profil Lulusan</h3>
        <div style={{ fontSize: '13px' }}>
          {rpp.tujuanProfilLulusan && typeof rpp.tujuanProfilLulusan === 'object' && Object.entries(rpp.tujuanProfilLulusan).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '4px' }}>
              <strong>{key}:</strong> {value as string || '-'}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>G. Tujuan Pembelajaran Mendalam (KD)</h3>
        <div style={{ fontSize: '13px' }}>{formatText(rpp.tujuanPembelajaranMendalam)}</div>
      </div>

      <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>H. Materi Integrasi KBC</h3>
        <div style={{ fontSize: '13px' }}>{formatText(rpp.materiIntegrasiKBC)}</div>
      </div>

      <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>I. Tujuan Pembelajaran</h3>
        <div style={{ fontSize: '13px' }}>{formatText(rpp.tujuanPembelajaran)}</div>
      </div>

      <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>J. Kerangka Pembelajaran</h3>
        <div style={{ fontSize: '13px' }}>
          {rpp.kerangkaPembelajaran && typeof rpp.kerangkaPembelajaran === 'object' && (
            <>
              <div style={{ marginBottom: '8px' }}>
                <strong>Praktek Pedagogik:</strong>
                {formatText(rpp.kerangkaPembelajaran.praktekPedagogik)}
              </div>
              {rpp.kerangkaPembelajaran.lingkunganPembelajaran && (
                <div style={{ marginBottom: '8px' }}>
                  <strong>Lingkungan Pembelajaran:</strong>
                  {Object.entries(rpp.kerangkaPembelajaran.lingkunganPembelajaran).map(([key, value]) => (
                    <div key={key} style={{ marginLeft: '16px', marginBottom: '4px' }}>
                      <strong>{key}:</strong> {value as string}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginBottom: '8px' }}>
                <strong>Kemitraan Pembelajaran:</strong>
                {formatText(rpp.kerangkaPembelajaran.kemitraanPembelajaran)}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Pemanfaatan Digital:</strong>
                {formatText(rpp.kerangkaPembelajaran.pemanfaatanDigital)}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>K. Kegiatan Pembelajaran</h3>
        <div style={{ fontSize: '13px' }}>
          {rpp.kegiatanPembelajaran && typeof rpp.kegiatanPembelajaran === 'object' && (
            <>
              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>1. Tahap Persiapan</h4>
                <div style={{ marginLeft: '16px' }}>
                  <div><strong>a. Pemahaman Konsep:</strong>{formatText(rpp.kegiatanPembelajaran.persiapan?.pemahamanKonsep)}</div>
                  <div><strong>b. Penyiapan Alat:</strong>{formatText(rpp.kegiatanPembelajaran.persiapan?.penyiapanAlat)}</div>
                  <div><strong>c. Alat & Bahan:</strong>{formatText(rpp.kegiatanPembelajaran.persiapan?.alatBahan)}</div>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>2. Tahap Pelaksanaan</h4>
                <div style={{ marginLeft: '16px' }}>
                  <div><strong>a. Orientasi:</strong>{formatText(rpp.kegiatanPembelajaran.pelaksanaan?.orientasi)}</div>
                  <div><strong>b. Eksplorasi:</strong>{formatText(rpp.kegiatanPembelajaran.pelaksanaan?.eksplorasi)}</div>
                  <div><strong>c. Diskusi:</strong>{formatText(rpp.kegiatanPembelajaran.pelaksanaan?.diskusi)}</div>
                  <div><strong>d. Kolaborasi:</strong>{formatText(rpp.kegiatanPembelajaran.pelaksanaan?.kolaborasi)}</div>
                  <div><strong>e. Refleksi:</strong>{formatText(rpp.kegiatanPembelajaran.pelaksanaan?.refleksi)}</div>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>3. Tahap Pembuatan Karya</h4>
                <div style={{ marginLeft: '16px' }}>
                  <div><strong>a. Proses:</strong>{formatText(rpp.kegiatanPembelajaran.pembuatanKarya?.proses)}</div>
                  <div><strong>b. Hasil:</strong>{formatText(rpp.kegiatanPembelajaran.pembuatanKarya?.hasil)}</div>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>4. Tahap Presentasi</h4>
                <div style={{ marginLeft: '16px' }}>
                  <div><strong>a. Persiapan:</strong>{formatText(rpp.kegiatanPembelajaran.presentasi?.persiapan)}</div>
                  <div><strong>b. Pelaksanaan:</strong>{formatText(rpp.kegiatanPembelajaran.presentasi?.pelaksanaan)}</div>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '4px' }}>5. Tahap Refleksi Akhir</h4>
                <div style={{ marginLeft: '16px' }}>
                  <div><strong>a. Refleksi Guru:</strong>{formatText(rpp.kegiatanPembelajaran.refleksiAkhir?.refleksiGuru)}</div>
                  <div><strong>b. Refleksi Anak:</strong>{formatText(rpp.kegiatanPembelajaran.refleksiAkhir?.refleksiAnak)}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}