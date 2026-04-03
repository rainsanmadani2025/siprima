'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Heart,
  User,
  Brain,
  MessageCircle,
  Users,
  Palette,
  Calendar,
  FileText,
  Download,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function PenilaianPage() {
  const router = useRouter()
  const [periode, setPeriode] = useState('ganjil-2024-2025')

  // Data penilaian per periode
  const dataPerPeriode: Record<string, any> = {
    'ganjil-2024-2025': {
      nama: 'Semester Ganjil 2024/2025',
      aspekPenilaian: {
        agama: {
          nama: 'Nilai Agama dan Moral',
          icon: Heart,
          deskripsi: 'Perkembangan nilai dan keyakinan agama, perilaku moral, dan etika',
          nilai: 'BSH',
          keterangan: 'Berkembang Sesuai Harapan',
          penilaianHarian: [
            { tanggal: '13 Jan 2025', nilai: 'BSH', catatan: 'Anak mampu berdoa sebelum dan sesudah makan dengan baik' },
            { tanggal: '14 Jan 2025', nilai: 'BSH', catatan: 'Menghormati teman saat bermain bersama' },
            { tanggal: '15 Jan 2025', nilai: 'BSB', catatan: 'Menceritakan kembali kisah nabi dengan lancar' },
            { tanggal: '16 Jan 2025', nilai: 'BSH', catatan: 'Berbagi mainan dengan teman yang lain' },
            { tanggal: '17 Jan 2025', nilai: 'BSH', catatan: 'Mengucapkan terima kasih saat dibantu orang lain' },
          ],
          catatanAnekdot: 'Fauzan menunjukkan perkembangan yang baik dalam kebiasaan berdoa. Ia selalu mengingatkan teman-temannya untuk berdoa sebelum makan. Saat ada teman yang menangis karena mainan diambil, Fauzan dengan sukarela mengembalikan mainan tersebut.',
          dokumentasi: [
            { tanggal: '15 Jan 2025', keterangan: 'Mengikuti kegiatan pengajian' },
            { tanggal: '17 Jan 2025', keterangan: 'Berbagi makanan dengan teman' }
          ]
        },
        fisikMotorik: {
          nama: 'Fisik Motorik',
          icon: User,
          deskripsi: 'Perkembangan motorik kasar dan halus, kesehatan fisik, dan kebugaran',
          nilai: 'BSB',
          keterangan: 'Berkembang Sangat Baik',
          penilaianHarian: [
            { tanggal: '13 Jan 2025', nilai: 'BSB', catatan: 'Melompat dengan satu kaki 5 kali berturut-turut' },
            { tanggal: '14 Jan 2025', nilai: 'BSH', catatan: 'Menangkap bola yang dilempar dari jarak 3 meter' },
            { tanggal: '15 Jan 2025', nilai: 'BSB', catatan: 'Menggambar lingkaran dengan rapi menggunakan pensil' },
            { tanggal: '16 Jan 2025', nilai: 'BSH', catatan: 'Berlari dengan keseimbangan yang baik' },
            { tanggal: '17 Jan 2025', nilai: 'BSB', catatan: 'Menggunting pola bintang dengan tepat' },
          ],
          catatanAnekdot: 'Kemampuan motorik halus Fauzan sangat baik. Ia mampu menggunting pola yang kompleks dengan rapi. Dalam kegiatan olahraga, Fauzan menunjukkan keseimbangan dan koordinasi yang di atas rata-rata teman-temannya.',
          dokumentasi: [
            { tanggal: '15 Jan 2025', keterangan: 'Kegiatan melompat tali' },
            { tanggal: '17 Jan 2025', keterangan: 'Hasil karya menggunting' }
          ]
        },
        kognitif: {
          nama: 'Kognitif',
          icon: Brain,
          deskripsi: 'Perkembangan berpikir logis, memecahkan masalah, dan pemahaman konsep',
          nilai: 'BSH',
          keterangan: 'Berkembang Sesuai Harapan',
          penilaianHarian: [
            { tanggal: '13 Jan 2025', nilai: 'BSH', catatan: 'Mengenal angka 1-20 dengan baik' },
            { tanggal: '14 Jan 2025', nilai: 'BSB', catatan: 'Menghitung benda konkret hingga 10' },
            { tanggal: '15 Jan 2025', nilai: 'BSH', catatan: 'Mengenal warna sekunder (hijau, ungu, orange)' },
            { tanggal: '16 Jan 2025', nilai: 'BSH', catatan: 'Menyusun puzzle 12-24 potongan' },
            { tanggal: '17 Jan 2025', nilai: 'BSB', catatan: 'Mengurutkan angka dari terbesar ke terkecil' },
          ],
          catatanAnekdot: 'Fauzan memiliki kemampuan berhitung yang baik. Ia dapat menghitung benda konkret dengan cepat dan akurat. Dalam kegiatan penyusunan puzzle, Fauzan mampu menyelesaikan puzzle 24 potongan dalam waktu 15 menit.',
          dokumentasi: [
            { tanggal: '15 Jan 2025', keterangan: 'Kegiatan berhitung dengan benda konkret' },
            { tanggal: '17 Jan 2025', keterangan: 'Menyusun puzzle 24 potongan' }
          ]
        },
        bahasa: {
          nama: 'Bahasa',
          icon: MessageCircle,
          deskripsi: 'Perkembangan kemampuan mendengar, berbicara, membaca, dan menulis',
          nilai: 'BSB',
          keterangan: 'Berkembang Sangat Baik',
          penilaianHarian: [
            { tanggal: '13 Jan 2025', nilai: 'BSB', catatan: 'Menceritakan kembali dongeng dengan kalimat lengkap' },
            { tanggal: '14 Jan 2025', nilai: 'BSH', catatan: 'Mengenal huruf A-Z dengan baik' },
            { tanggal: '15 Jan 2025', nilai: 'BSB', catatan: 'Membaca kata-kata sederhana (ibu, ayah, rumah)' },
            { tanggal: '16 Jan 2025', nilai: 'BSH', catatan: 'Menulis nama sendiri dengan rapi' },
            { tanggal: '17 Jan 2025', nilai: 'BSB', catatan: 'Menjawab pertanyaan dengan alasan yang logis' },
          ],
          catatanAnekdot: 'Kemampuan bahasa Fauzan sangat menonjol. Ia sering bertanya dengan kata "mengapa" dan menunggu penjelasan yang logis. Fauzan juga senang menceritakan kembali cerita yang didengar dengan detail yang baik.',
          dokumentasi: [
            { tanggal: '15 Jan 2025', keterangan: 'Kegiatan menceritakan dongeng' },
            { tanggal: '17 Jan 2025', keterangan: 'Belajar membaca kata benda' }
          ]
        },
        sosialEmosional: {
          nama: 'Sosial Emosional',
          icon: Users,
          deskripsi: 'Perkembangan kemampuan bersosialisasi, mengenali emosi, dan mengelola perasaan',
          nilai: 'BSH',
          keterangan: 'Berkembang Sesuai Harapan',
          penilaianHarian: [
            { tanggal: '13 Jan 2025', nilai: 'BSH', catatan: 'Bermain dengan 3-4 teman secara kooperatif' },
            { tanggal: '14 Jan 2025', nilai: 'BSH', catatan: 'Mengungkapkan perasaan senang dan sedih dengan kata-kata' },
            { tanggal: '15 Jan 2025', nilai: 'BSB', catatan: 'Menenangkan teman yang sedang menangis' },
            { tanggal: '16 Jan 2025', nilai: 'BSH', catatan: 'Menunggu giliran dengan sabar' },
            { tanggal: '17 Jan 2025', nilai: 'BSH', catatan: 'Mengikuti aturan permainan dengan baik' },
          ],
          catatanAnekdot: 'Fauzan memiliki empati yang baik terhadap teman-temannya. Ia sering membantu teman yang kesulitan. Ketika ada konflik, Fauzan mencari solusi dengan berdiskusi bukan dengan berkelahi.',
          dokumentasi: [
            { tanggal: '15 Jan 2025', keterangan: 'Bermain peran dokter-dokteran' },
            { tanggal: '17 Jan 2025', keterangan: 'Kegiatan kelompok' }
          ]
        },
        seni: {
          nama: 'Seni',
          icon: Palette,
          deskripsi: 'Perkembangan kreativitas dan ekspresi seni (musik, tari, seni rupa)',
          nilai: 'BSH',
          keterangan: 'Berkembang Sesuai Harapan',
          penilaianHarian: [
            { tanggal: '13 Jan 2025', nilai: 'BSH', catatan: 'Bernyanyi lagu anak dengan tempo yang tepat' },
            { tanggal: '14 Jan 2025', nilai: 'BSH', catatan: 'Menari gerakan dasar (senam irama)' },
            { tanggal: '15 Jan 2025', nilai: 'BSB', catatan: 'Menggambar dengan variasi warna yang kreatif' },
            { tanggal: '16 Jan 2025', nilai: 'BSH', catatan: 'Mengenal alat musik (angklung, rebana)' },
            { tanggal: '17 Jan 2025', nilai: 'BSH', catatan: 'Membuat karya kolase dengan bahan alam' },
          ],
          catatanAnekdot: 'Fauzan sangat menyukai kegiatan seni. Ia sering mengeksplorasi warna-warna baru dalam lukisannya. Dalam kegiatan musik, Fauzan dapat mengikuti irama dengan baik dan senang mencoba berbagai alat musik.',
          dokumentasi: [
            { tanggal: '15 Jan 2025', keterangan: 'Melukis dengan cat air' },
            { tanggal: '17 Jan 2025', keterangan: 'Bermain angklung' }
          ]
        }
      }
    },
    'genap-2024-2025': {
      nama: 'Semester Genap 2024/2025',
      aspekPenilaian: {
        agama: {
          nama: 'Nilai Agama dan Moral',
          icon: Heart,
          deskripsi: 'Perkembangan nilai dan keyakinan agama, perilaku moral, dan etika',
          nilai: 'BSB',
          keterangan: 'Berkembang Sangat Baik',
          penilaianHarian: [
            { tanggal: '10 Jul 2025', nilai: 'BSB', catatan: 'Hafalan surat pendek (Al-Ikhlas) meningkat baik' },
            { tanggal: '11 Jul 2025', nilai: 'BSB', catatan: 'Menghafasi doa harian dengan lancar' },
            { tanggal: '12 Jul 2025', nilai: 'BSH', catatan: 'Berbagi dengan teman tanpa diminta' },
            { tanggal: '13 Jul 2025', nilai: 'BSB', catatan: 'Menceritakan kisah nabi dengan detail lengkap' },
            { tanggal: '14 Jul 2025', nilai: 'BSB', catatan: 'Menolong teman yang kesulitan tugas' },
          ],
          catatanAnekdot: 'Fauzan menunjukkan perkembangan yang sangat baik dalam hal hafalan doa dan surat pendek. Ia aktif mengingatkan teman-temannya untuk berdoa dan hafalannya meningkat signifikan dibanding semester ganjil.',
          dokumentasi: [
            { tanggal: '12 Jul 2025', keterangan: 'Menghafal surat Al-Ikhlas' },
            { tanggal: '14 Jul 2025', keterangan: 'Berbagi snack dengan teman' }
          ]
        },
        fisikMotorik: {
          nama: 'Fisik Motorik',
          icon: User,
          deskripsi: 'Perkembangan motorik kasar dan halus, kesehatan fisik, dan kebugaran',
          nilai: 'BSB',
          keterangan: 'Berkembang Sangat Baik',
          penilaianHarian: [
            { tanggal: '10 Jul 2025', nilai: 'BSB', catatan: 'Melompat dengan 2 kaki dengan ketinggian 30cm' },
            { tanggal: '11 Jul 2025', nilai: 'BSB', catatan: 'Menangkap bola dari jarak 5 meter' },
            { tanggal: '12 Jul 2025', nilai: 'BSB', catatan: 'Menulis nama dan alamat lengkap dengan rapi' },
            { tanggal: '13 Jul 2025', nilai: 'BSB', catatan: 'Bersepeda roda 2 tanpa bantuan' },
            { tanggal: '14 Jul 2025', nilai: 'BSB', catatan: 'Membuat origami sederhana (kertas pesawat)' },
          ],
          catatanAnekdot: 'Motorik kasar Fauzan sangat berkembang. Ia sudah dapat bersepeda dengan roda 2 tanpa bantuan. Koordinasi mata-tangan sangat baik terlihat dari kemampuannya membuat origami yang cukup kompleks.',
          dokumentasi: [
            { tanggal: '12 Jul 2025', keterangan: 'Kegiatan bersepeda' },
            { tanggal: '14 Jul 2025', keterangan: 'Karya origami pesawat' }
          ]
        },
        kognitif: {
          nama: 'Kognitif',
          icon: Brain,
          deskripsi: 'Perkembangan berpikir logis, memecahkan masalah, dan pemahaman konsep',
          nilai: 'BSB',
          keterangan: 'Berkembang Sangat Baik',
          penilaianHarian: [
            { tanggal: '10 Jul 2025', nilai: 'BSB', catatan: 'Mengenal angka 1-50 dengan baik' },
            { tanggal: '11 Jul 2025', nilai: 'BSB', catatan: 'Menghitung penjumlahan 1-10 dengan cepat' },
            { tanggal: '12 Jul 2025', nilai: 'BSB', catatan: 'Mengenal bentuk geometri (lingkaran, persegi, segitiga)' },
            { tanggal: '13 Jul 2025', nilai: 'BSB', catatan: 'Menyusun puzzle 30-50 potongan' },
            { tanggal: '14 Jul 2025', nilai: 'BSB', catatan: 'Mengurutkan dari terbesar ke terkecil dengan benar' },
          ],
          catatanAnekdot: 'Kemampuan kognitif Fauzan meningkat sangat baik. Ia sudah dapat menghitung penjumlahan sederhana dan memahami konsep geometri dasar. Puzzle yang dapat diselesaikan meningkat dari 24 menjadi 50 potongan.',
          dokumentasi: [
            { tanggal: '12 Jul 2025', keterangan: 'Kegiatan berhitung dengan benda konkret' },
            { tanggal: '14 Jul 2025', keterangan: 'Menyusun puzzle 50 potongan' }
          ]
        },
        bahasa: {
          nama: 'Bahasa',
          icon: MessageCircle,
          deskripsi: 'Perkembangan kemampuan mendengar, berbicara, membaca, dan menulis',
          nilai: 'BSB',
          keterangan: 'Berkembang Sangat Baik',
          penilaianHarian: [
            { tanggal: '10 Jul 2025', nilai: 'BSB', catatan: 'Menceritakan pengalaman liburan dengan detail' },
            { tanggal: '11 Jul 2025', nilai: 'BSB', catatan: 'Membaca kalimat sederhana dengan lancar' },
            { tanggal: '12 Jul 2025', nilai: 'BSB', catatan: 'Menulis kalimat pendek dengan benar' },
            { tanggal: '13 Jul 2025', nilai: 'BSB', catatan: 'Menjawab pertanyaan "mengapa" dengan alasan logis' },
            { tanggal: '14 Jul 2025', nilai: 'BSB', catatan: 'Menyusun kata menjadi kalimat yang benar' },
          ],
          catatanAnekdot: 'Kemampuan bahasa Fauzan sangat menonjol. Ia sudah dapat membaca kalimat sederhana dan mulai belajar menulis kalimat pendek. Kemampuannya dalam menjelaskan alasan dan argumentasi juga berkembang dengan baik.',
          dokumentasi: [
            { tanggal: '12 Jul 2025', keterangan: 'Membaca buku cerita' },
            { tanggal: '14 Jul 2025', keterangan: 'Menulis kalimat tentang liburan' }
          ]
        },
        sosialEmosional: {
          nama: 'Sosial Emosional',
          icon: Users,
          deskripsi: 'Perkembangan kemampuan bersosialisasi, mengenali emosi, dan mengelola perasaan',
          nilai: 'BSB',
          keterangan: 'Berkembang Sangat Baik',
          penilaianHarian: [
            { tanggal: '10 Jul 2025', nilai: 'BSB', catatan: 'Memimpin permainan kelompok dengan baik' },
            { tanggal: '11 Jul 2025', nilai: 'BSB', catatan: 'Mengenali dan mengekspresikan berbagai emosi' },
            { tanggal: '12 Jul 2025', nilai: 'BSB', catatan: 'Membantu menyelesaikan konflik antar teman' },
            { tanggal: '13 Jul 2025', nilai: 'BSH', catatan: 'Menunggu giliran dengan sabar' },
            { tanggal: '14 Jul 2025', nilai: 'BSB', catatan: 'Berkasihat jujur dan terbuka' },
          ],
          catatanAnekdot: 'Fauzan mulai menunjukkan kemampuan kepemimpinan yang baik. Ia sering memimpin permainan kelompok dan membantu menyelesaikan konflik antar teman. Keterbukaannya dalam berkata-kata juga meningkat signifikan.',
          dokumentasi: [
            { tanggal: '12 Jul 2025', keterangan: 'Memimpin permainan kelompok' },
            { tanggal: '14 Jul 2025', keterangan: 'Kegiatan bermain peran' }
          ]
        },
        seni: {
          nama: 'Seni',
          icon: Palette,
          deskripsi: 'Perkembangan kreativitas dan ekspresi seni (musik, tari, seni rupa)',
          nilai: 'BSB',
          keterangan: 'Berkembang Sangat Baik',
          penilaianHarian: [
            { tanggal: '10 Jul 2025', nilai: 'BSB', catatan: 'Bernyanyi lagu anak dengan syair yang lengkap' },
            { tanggal: '11 Jul 2025', nilai: 'BSB', catatan: 'Menari dengan gerakan kreatif dan imajinatif' },
            { tanggal: '12 Jul 2025', nilai: 'BSB', catatan: 'Menggambar pemandangan dengan komposisi baik' },
            { tanggal: '13 Jul 2025', nilai: 'BSB', catatan: 'Memainkan angklung dengan irama yang benar' },
            { tanggal: '14 Jul 2025', nilai: 'BSB', catatan: 'Membuat karya seni dari barang bekas' },
          ],
          catatanAnekdot: 'Kreativitas Fauzan berkembang sangat baik. Ia sering membuat karya seni dari barang bekas dan ide-idenya sangat unik. Kemampuan musiknya juga meningkat, ia sudah dapat memainkan angklung dengan irama yang benar.',
          dokumentasi: [
            { tanggal: '12 Jul 2025', keterangan: 'Melukis pemandangan taman' },
            { tanggal: '14 Jul 2025', keterangan: 'Mainan dari barang bekas' }
          ]
        }
      }
    },
    'ganjil-2023-2024': {
      nama: 'Semester Ganjil 2023/2024',
      aspekPenilaian: {
        agama: {
          nama: 'Nilai Agama dan Moral',
          icon: Heart,
          deskripsi: 'Perkembangan nilai dan keyakinan agama, perilaku moral, dan etika',
          nilai: 'BSH',
          keterangan: 'Berkembang Sesuai Harapan',
          penilaianHarian: [
            { tanggal: '10 Okt 2023', nilai: 'BSH', catatan: 'Mulai belajar berdoa sebelum dan sesudah makan' },
            { tanggal: '11 Okt 2023', nilai: 'BSH', catatan: 'Belajar menghormati teman saat bermain' },
            { tanggal: '12 Okt 2023', nilai: 'BSH', catatan: 'Mendengarkan kisah nabi dengan tertib' },
            { tanggal: '13 Okt 2023', nilai: 'MB', catatan: 'Belajar berbagi mainan dengan bantuan guru' },
            { tanggal: '14 Okt 2023', nilai: 'BSH', catatan: 'Mengucapkan terima kasih saat dibantu' },
          ],
          catatanAnekdot: 'Fauzan masih dalam tahap belajar kebiasaan berdoa. Ia kadang masih perlu diingatkan untuk berdoa, namun sudah mulai menunjukkan perkembangan yang baik dalam perilaku berbagi dengan teman.',
          dokumentasi: [
            { tanggal: '12 Okt 2023', keterangan: 'Belajar berdoa bersama' },
            { tanggal: '14 Okt 2023', keterangan: 'Kegiatan berbagi mainan' }
          ]
        },
        fisikMotorik: {
          nama: 'Fisik Motorik',
          icon: User,
          deskripsi: 'Perkembangan motorik kasar dan halus, kesehatan fisik, dan kebugaran',
          nilai: 'BSH',
          keterangan: 'Berkembang Sesuai Harapan',
          penilaianHarian: [
            { tanggal: '10 Okt 2023', nilai: 'BSH', catatan: 'Melompat dengan satu kaki 3 kali' },
            { tanggal: '11 Okt 2023', nilai: 'BSH', catatan: 'Menangkap bola dari jarak 2 meter' },
            { tanggal: '12 Okt 2023', nilai: 'MB', catatan: 'Menggambar garis sederhana' },
            { tanggal: '13 Okt 2023', nilai: 'BSH', catatan: 'Berlari dengan keseimbangan baik' },
            { tanggal: '14 Okt 2023', nilai: 'BSH', catatan: 'Belajar menggunting kertas dengan bantuan' },
          ],
          catatanAnekdot: 'Motorik halus Fauzan masih berkembang. Ia membutuhkan bantuan dalam menggunting kertas, namun kemampuan motorik kasarnya sudah cukup baik untuk usianya.',
          dokumentasi: [
            { tanggal: '12 Okt 2023', keterangan: 'Kegiatan melompat' },
            { tanggal: '14 Okt 2023', keterangan: 'Belajar menggunting' }
          ]
        },
        kognitif: {
          nama: 'Kognitif',
          icon: Brain,
          deskripsi: 'Perkembangan berpikir logis, memecahkan masalah, dan pemahaman konsep',
          nilai: 'BSH',
          keterangan: 'Berkembang Sesuai Harapan',
          penilaianHarian: [
            { tanggal: '10 Okt 2023', nilai: 'BSH', catatan: 'Mengenal angka 1-10' },
            { tanggal: '11 Okt 2023', nilai: 'MB', catatan: 'Menghitung benda konkret hingga 5' },
            { tanggal: '12 Okt 2023', nilai: 'BSH', catatan: 'Mengenal warna dasar (merah, biru, kuning)' },
            { tanggal: '13 Okt 2023', nilai: 'BSH', catatan: 'Menyusun puzzle 6-12 potongan' },
            { tanggal: '14 Okt 2023', nilai: 'MB', catatan: 'Belajar mengurutkan angka 1-10' },
          ],
          catatanAnekdot: 'Fauzan memiliki kemampuan berhitung dasar yang baik. Ia dapat mengenal angka 1-10 dan mulai belajar menghitung benda konkret sederhana. Puzzle yang dapat diselesaikan masih 12 potongan.',
          dokumentasi: [
            { tanggal: '12 Okt 2023', keterangan: 'Belajar berhitung' },
            { tanggal: '14 Okt 2023', keterangan: 'Menyusun puzzle 12 potongan' }
          ]
        },
        bahasa: {
          nama: 'Bahasa',
          icon: MessageCircle,
          deskripsi: 'Perkembangan kemampuan mendengar, berbicara, membaca, dan menulis',
          nilai: 'BSH',
          keterangan: 'Berkembang Sesuai Harapan',
          penilaianHarian: [
            { tanggal: '10 Okt 2023', nilai: 'BSH', catatan: 'Menceritakan dongeng sederhana' },
            { tanggal: '11 Okt 2023', nilai: 'BSH', catatan: 'Mengenal huruf A-M' },
            { tanggal: '12 Okt 2023', nilai: 'MB', catatan: 'Belajar mengenal kata sederhana' },
            { tanggal: '13 Okt 2023', nilai: 'BSH', catatan: 'Menulis nama dengan bantuan' },
            { tanggal: '14 Okt 2023', nilai: 'BSH', catatan: 'Menjawab pertanyaan sederhana' },
          ],
          catatanAnekdot: 'Fauzan mulai mengenal huruf dan kata sederhana. Kemampuannya dalam menceritakan dongeng sudah cukup baik, namun masih membutuhkan bantuan dalam menulis nama sendiri.',
          dokumentasi: [
            { tanggal: '12 Okt 2023', keterangan: 'Mengenal huruf' },
            { tanggal: '14 Okt 2023', keterangan: 'Belajar menulis nama' }
          ]
        },
        sosialEmosional: {
          nama: 'Sosial Emosional',
          icon: Users,
          deskripsi: 'Perkembangan kemampuan bersosialisasi, mengenali emosi, dan mengelola perasaan',
          nilai: 'BSH',
          keterangan: 'Berkembang Sesuai Harapan',
          penilaianHarian: [
            { tanggal: '10 Okt 2023', nilai: 'BSH', catatan: 'Bermain dengan 2-3 teman' },
            { tanggal: '11 Okt 2023', nilai: 'MB', catatan: 'Belajar mengenali emosi senang/sedih' },
            { tanggal: '12 Okt 2023', nilai: 'BSH', catatan: 'Membantu teman yang sedih dengan bimbingan' },
            { tanggal: '13 Okt 2023', nilai: 'BSH', catatan: 'Belajar menunggu giliran' },
            { tanggal: '14 Okt 2023', nilai: 'BSH', catatan: 'Mengikuti aturan permainan sederhana' },
          ],
          catatanAnekdot: 'Fauzan mulai menunjukkan empati terhadap teman-temannya, namun masih membutuhkan bimbingan dalam mengenali dan mengekspresikan emosinya. Ia sedang belajar bermain dalam kelompok.',
          dokumentasi: [
            { tanggal: '12 Okt 2023', keterangan: 'Bermain kelompok' },
            { tanggal: '14 Okt 2023', keterangan: 'Belajar mengekspresikan emosi' }
          ]
        },
        seni: {
          nama: 'Seni',
          icon: Palette,
          deskripsi: 'Perkembangan kreativitas dan ekspresi seni (musik, tari, seni rupa)',
          nilai: 'BSH',
          keterangan: 'Berkembang Sesuai Harapan',
          penilaianHarian: [
            { tanggal: '10 Okt 2023', nilai: 'BSH', catatan: 'Bernyanyi lagu anak dengan tempo yang sesuai' },
            { tanggal: '11 Okt 2023', nilai: 'BSH', catatan: 'Menari gerakan dasar' },
            { tanggal: '12 Okt 2023', nilai: 'MB', catatan: 'Menggambar dengan warna dasar' },
            { tanggal: '13 Okt 2023', nilai: 'BSH', catatan: 'Mengenal alat musik sederhana' },
            { tanggal: '14 Okt 2023', nilai: 'BSH', catatan: 'Membuat karya seni sederhana' },
          ],
          catatanAnekdot: 'Fauzan menyukai kegiatan seni, terutama musik. Ia senang bernyanyi dan mencoba berbagai alat musik. Kemampuan menggambarnya masih berkembang dan menggunakan warna dasar.',
          dokumentasi: [
            { tanggal: '12 Okt 2023', keterangan: 'Bernyanyi bersama' },
            { tanggal: '14 Okt 2023', keterangan: 'Menggambar dengan warna dasar' }
          ]
        }
      }
    }
  }

  const dataPeriode = dataPerPeriode[periode] || dataPerPeriode['ganjil-2024-2025']

  const getProgressWidth = (nilai: string) => {
    switch (nilai) {
      case 'BB': return '25%'
      case 'MB': return '50%'
      case 'BSH': return '75%'
      case 'BSB': return '100%'
      default: return '0%'
    }
  }

  return (
    <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
      <div className="space-y-6">
      <div className="flex justify-between items-center pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Penilaian Perkembangan Anak</h1>
          <p className="text-gray-600 mt-1">Hasil observasi dan penilaian guru pada 6 aspek perkembangan PAUD</p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/ortu')}
            className="mt-4 gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Button>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Laporan
        </Button>
      </div>

      {/* Periode Penilaian */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Pilih Periode Penilaian</p>
              <Select value={periode} onValueChange={setPeriode}>
                <SelectTrigger className="w-full md:w-80">
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="genap-2024-2025">Semester Genap 2024/2025</SelectItem>
                  <SelectItem value="ganjil-2024-2025">Semester Ganjil 2024/2025</SelectItem>
                  <SelectItem value="ganjil-2023-2024">Semester Ganjil 2023/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
              {dataPeriode.nama}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Perkembangan 6 Aspek */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Perkembangan 6 Aspek PAUD - {dataPeriode.nama}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[220px]">Aspek</TableHead>
                <TableHead className="w-[280px]">Deskripsi</TableHead>
                <TableHead className="w-[120px]">Nilai</TableHead>
                <TableHead className="w-[200px]">Progress</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Agama & Moral */}
              <TableRow className="bg-gradient-to-r from-emerald-500/20 to-green-600/20 hover:from-emerald-500/30 hover:to-green-600/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Nilai Agama & Moral</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 text-sm">
                  Perkembangan nilai dan keyakinan agama
                </TableCell>
                <TableCell>
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0">
                    {dataPeriode.aspekPenilaian.agama.nilai}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-full h-full transition-all duration-500"
                      style={{ width: getProgressWidth(dataPeriode.aspekPenilaian.agama.nilai) }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 whitespace-normal break-words min-w-[300px] max-w-md">
                  {dataPeriode.aspekPenilaian.agama.catatanAnekdot}
                </TableCell>
              </TableRow>

              {/* Fisik Motorik */}
              <TableRow className="bg-gradient-to-r from-blue-500/20 to-indigo-600/20 hover:from-blue-500/30 hover:to-indigo-600/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Fisik Motorik</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 text-sm">
                  Motorik kasar dan halus, kesehatan fisik
                </TableCell>
                <TableCell>
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                    {dataPeriode.aspekPenilaian.fisikMotorik.nilai}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full h-full transition-all duration-500"
                      style={{ width: getProgressWidth(dataPeriode.aspekPenilaian.fisikMotorik.nilai) }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 whitespace-normal break-words min-w-[300px] max-w-md">
                  {dataPeriode.aspekPenilaian.fisikMotorik.catatanAnekdot}
                </TableCell>
              </TableRow>

              {/* Kognitif */}
              <TableRow className="bg-gradient-to-r from-purple-500/20 to-violet-600/20 hover:from-purple-500/30 hover:to-violet-600/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Kognitif</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 text-sm">
                  Berpikir logis, memecahkan masalah
                </TableCell>
                <TableCell>
                  <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0">
                    {dataPeriode.aspekPenilaian.kognitif?.nilai || '-'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-full h-full transition-all duration-500"
                      style={{ width: getProgressWidth(dataPeriode.aspekPenilaian.kognitif?.nilai || '') }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 whitespace-normal break-words min-w-[300px] max-w-md">
                  {dataPeriode.aspekPenilaian.kognitif?.catatanAnekdot || 'Belum ada catatan'}
                </TableCell>
              </TableRow>

              {/* Bahasa */}
              <TableRow className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Bahasa</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 text-sm">
                  Mendengar, berbicara, membaca, menulis
                </TableCell>
                <TableCell>
                  <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
                    {dataPeriode.aspekPenilaian.bahasa.nilai}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-full h-full transition-all duration-500"
                      style={{ width: getProgressWidth(dataPeriode.aspekPenilaian.bahasa.nilai) }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 whitespace-normal break-words min-w-[300px] max-w-md">
                  {dataPeriode.aspekPenilaian.bahasa.catatanAnekdot}
                </TableCell>
              </TableRow>

              {/* Sosial Emosional */}
              <TableRow className="bg-gradient-to-r from-pink-500/20 to-rose-600/20 hover:from-pink-500/30 hover:to-rose-600/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Sosial Emosional</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 text-sm">
                  Bersosialisasi, mengenali emosi
                </TableCell>
                <TableCell>
                  <Badge className="bg-gradient-to-r from-pink-500 to-rose-600 text-white border-0">
                    {dataPeriode.aspekPenilaian.sosialEmosional.nilai}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-full h-full transition-all duration-500"
                      style={{ width: getProgressWidth(dataPeriode.aspekPenilaian.sosialEmosional.nilai) }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 whitespace-normal break-words min-w-[300px] max-w-md">
                  {dataPeriode.aspekPenilaian.sosialEmosional.catatanAnekdot}
                </TableCell>
              </TableRow>

              {/* Seni */}
              <TableRow className="bg-gradient-to-r from-teal-500/20 to-cyan-600/20 hover:from-teal-500/30 hover:to-cyan-600/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Seni</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 text-sm">
                  Kreativitas dan ekspresi seni
                </TableCell>
                <TableCell>
                  <Badge className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0">
                    {dataPeriode.aspekPenilaian.seni.nilai}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full h-full transition-all duration-500"
                      style={{ width: getProgressWidth(dataPeriode.aspekPenilaian.seni.nilai) }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 whitespace-normal break-words min-w-[300px] max-w-md">
                  {dataPeriode.aspekPenilaian.seni.catatanAnekdot}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Informasi */}
      <Card className="bg-gradient-to-r from-amber-50 to-blue-50 border-amber-200">
        <CardContent className="p-4 space-y-4">
          {/* Informasi Penilaian */}
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-900">Keterangan Penilaian</p>
              <p className="text-amber-800">
                Penilaian dilakukan oleh guru berdasarkan observasi harian. BB = Belum Berkembang, MB = Mulai Berkembang,
                BSH = Berkembang Sesuai Harapan, BSB = Berkembang Sangat Baik.
              </p>
            </div>
          </div>

          {/* Catatan */}
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900">Catatan</p>
              <p className="text-blue-800">
                Penilaian ini bersifat dinamis dan akan terus diperbarui oleh guru. Jika ada pertanyaan mengenai perkembangan anak,
                silakan hubungi guru melalui menu Komunikasi.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  )
}
