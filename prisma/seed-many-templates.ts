import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const templates = [
  {
    tema: 'Lingkungan Sekitarku',
    topikKBC: 'Cinta Diri dan Sesama',
    profilLulusan: 'Kesehatan, Kemandirian, Bernalar Kritis, Kreatif, Berkarakter, Beriman, Bertakwa',
    tujuanKBC: 'Mengenal mesjid sebagai tempat ibadah umat Islam dan memahami cara bersikap yang tepat di dalamnya',
    tujuanProfilLulusan: {
      Kesehatan: 'Mengenal lingkungan sehat di sekitar mesjid',
      Kemandirian: 'Dapat merawat diri sendiri saat berada di mesjid',
      BernalarKritis: 'Memahami alasan mengapa harus berperilaku baik di mesjid',
      Kreatif: 'Menciptakan aktivitas bermain yang sesuai dengan lingkungan mesjid',
      Berkarakter: 'Menumbuhkan sikap hormat dan sopan di tempat ibadah',
      Beriman: 'Mengenal mesjid sebagai tempat untuk mendekatkan diri kepada Allah',
      Bertakwa: 'Mengenal dasar-dasar ibadah yang dilakukan di mesjid'
    },
    tujuanPembelajaranMendalam: 'KD1: Mengenal mesjid dan fungsi sebagai tempat ibadah\nKD2: Memahami cara bersikap sopan dan hormat di mesjid\nKD3: Mengenal aktivitas ibadah yang dilakukan di mesjid',
    materiIntegrasiKBC: 'Pengenalan mesjid, fungsi mesjid, adab di mesjid, aktivitas ibadah, dan makna salat berjamaah',
    tujuanPembelajaran: 'Setelah kegiatan pembelajaran, anak diharapkan dapat mengenal mesjid sebagai tempat ibadah, memahami cara bersikap yang tepat di dalamnya, dan memiliki rasa cinta terhadap tempat ibadah',
    kerangkaPembelajaran: {
      praktekPedagogik: 'Main peran, Observasi lapangan, Cerita bergambar, Pertanyaan terbuka, Pembelajaran berbasis proyek',
      lingkunganPembelajaran: {
        fisik: 'Model mesjid mini, Gambar mesjid, Karpet sholat, Alat salat',
        sosial: 'Kerja kelompok kecil, Interaksi dengan pengurus masjid, Bermain bersama teman',
        psikologis: 'Lingkungan nyaman, Pujian dan motivasi, Kreativitas anak didik',
        akademik: 'Buku cerita tentang mesjid, Gambar-gambar ibadah, Video edukasi'
      },
      kemitraanPembelajaran: 'Orang tua, Pengurus masjid setempat, Tokoh agama',
      pemanfaatanDigital: 'Video singkat tentang mesjid, Aplikasi edukasi anak tentang ibadah'
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: 'Membaca buku tentang mesjid, Melihat video pendek mengenai mesjid, Diskusi sederhana tentang tempat ibadah',
        penyiapanAlat: 'Mempersiapkan model mesjid mini, Menyiapkan gambar-gambar aktivitas di mesjid, Mempersiapkan alat peraga salat',
        alatBahan: 'Kertas warna, gunting, lem, stiker, gambar mesjid, model mesjid mini, karpet, tasbih'
      },
      pelaksanaan: {
        orientasi: 'Mengajak anak duduk melingkar, Menanyakan pengalaman anak mengenai mesjid, Memperkenalkan tema pembelajaran',
        eksplorasi: 'Melihat model mesjid mini, Mengenal bagian-bagian mesjid, Mempraktikkan gerakan salat sederhana',
        diskusi: 'Membahas cara bersikap di mesjid, Mengapa mesjid tempat suci, Apa saja aktivitas di mesjid',
        kolaborasi: 'Membangun mesjid mini bersama, Bermain peran sholat berjamaah, Membuat poster tentang mesjid',
        refleksi: 'Anak menceritakan pengalaman belajar, Menanyakan apa yang telah dipelajari'
      },
      pembuatanKarya: {
        proses: 'Membuat gambar mesjid, Mewarnai gambar aktivitas ibadah, Membuat miniatur mesjid dari kardus',
        hasil: 'Gambar mesjid yang diperkirakan, Miniatur mesjid, Poster tentang adab di mesjid'
      },
      presentasi: {
        persiapan: 'Menyiapkan karya hasil proyek, Membuat kalimat sederhana untuk menjelaskan karya',
        pelaksanaan: 'Menampilkan karya kepada teman, Menceritakan karya yang dibuat, Menjawab pertanyaan teman'
      },
      refleksiAkhir: {
        refleksiGuru: 'Menilai pemahaman anak tentang mesjid, Mengamati sikap anak saat menirukan aktivitas di mesjid, Menilai kreativitas anak dalam membuat karya',
        refleksiAnak: 'Menceritakan apa yang paling disukai, Menyampaikan hal baru yang dipelajari, Menyampaikan kesulitan yang dihadapi'
      }
    }
  },
  {
    tema: 'Generasi Sehat dan Bugar',
    topikKBC: 'Cinta Diri dan Sesama',
    profilLulusan: 'Kesehatan, Kemandirian',
    tujuanKBC: 'Menumbuhkan sikap syukur pada diri melalui penerapan self compassion, yaitu mengembangkan welas asih terhadap diri sendiri dengan memenuhi hak-hak dasar fisik, emosi, dan spiritual secara seimbang',
    tujuanProfilLulusan: {
      Kesehatan: 'Melalui aktivitas gerak seperti lari, lompat, dan permainan fisik, murid dibiasakan membentuk kebiasaan hidup bersih, sehat, dan menjaga kebugaran fisik sesuai tahap perkembangan usia',
      Kemandirian: 'Saat mengatur diri untuk beristirahat ketika lelah, mengikuti aturan permainan, dan merapikan alat olahraga, murid dibimbing untuk bertanggung jawab terhadap tindakan dan keputusan yang diambil'
    },
    tujuanPembelajaranMendalam: 'Murid berpartisipasi aktif dalam menjaga kebersihan, kesehatan, dan keselamatan diri sebagai bentuk rasa sayang terhadap dirinya dan rasa syukur kepada Allah Swt (AB6)',
    materiIntegrasiKBC: 'Membiasakan diri menjaga kebersihan, kesehatan, dan keselamatan diri sebagai bentuk syukur dan tanggung jawab terhadap tubuh yang Allah Swt. anugerahkan',
    tujuanPembelajaran: 'Kegiatan ini bertujuan untuk menguatkan kompetensi murid merefleksikan pentingnya membiasakan diri menjaga kebersihan, kesehatan, dan keselamatan diri sebagai bentuk syukur dan tanggung jawab terhadap tubuh yang Allah Swt. anugerahkan',
    kerangkaPembelajaran: {
      praktekPedagogik: 'Pembelajaran kontekstual berbasis permainan fisik dan pembiasaan hidup sehat melalui aktivitas gerak',
      lingkunganPembelajaran: {
        fisik: 'Halaman atau lapangan madrasah sebagai arena permainan gerak, sudut cuci tangan dan tempat minum',
        sosial: 'Interaksi positif antara murid saat bermain berkelompok dengan saling menyemangati',
        psikologis: 'Suasana kegiatan dibuat menyenangkan dan bebas tekanan',
        akademik: 'Guru mengajak murid mengamati perubahan tubuh setelah bergerak'
      },
      kemitraanPembelajaran: 'Puskesmas atau posyandu, Orang tua murid',
      pemanfaatanDigital: 'Video senam anak sebagai panduan gerak, Video pendek tentang pentingnya olahraga'
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: 'Guru meninjau kembali tujuan kegiatan, Guru menentukan fokus nilai, Guru menyusun urutan kegiatan',
        penyiapanAlat: 'Guru menata area bermain, Guru menyiapkan sudut cuci tangan, Guru menempatkan area minum',
        alatBahan: 'Cone atau botol bekas, Tali lompat, Bola kecil, Matras, Ember berkran, Sabun, Handuk'
      },
      pelaksanaan: {
        orientasi: 'Guru mengumpulkan murid di area, Guru membuka kegiatan dengan salam, Guru bertanya tentang pengalaman bermain',
        eksplorasi: 'Guru memimpin pemanasan ringan, Guru mencontohkan gerakan lari, Murid diajak menirukan gerakan',
        diskusi: 'Guru mengajak murid duduk melingkar, Guru bertanya tentang kenapa tubuh berkeringat',
        kolaborasi: 'Guru menugaskan setiap kelompok, Setiap kelompok berdiskusi, Kelompok tampil memperagakan',
        refleksi: 'Guru mengajak murid duduk tenang, Guru meminta murid memilih emotikon, Beberapa murid menceritakan pengalaman'
      },
      pembuatanKarya: {
        proses: 'Gambar atau poster sederhana bertema Tubuhku Kuat',
        hasil: 'Gambar atau poster sederhana bertema Tubuhku Kuat'
      },
      presentasi: {
        persiapan: 'Guru menyiapkan sudut pajang di kelas',
        pelaksanaan: 'Murid menempelkan gambar mereka, Beberapa murid diminta maju'
      },
      refleksiAkhir: {
        refleksiGuru: 'Guru menilai pemahaman anak, Guru mengamati keterlibatan anak',
        refleksiAnak: 'Anak menceritakan bagian tubuh yang disukai, Anak menyampaikan hal baru'
      }
    }
  },
  {
    tema: 'Alam Semesta',
    topikKBC: 'Cinta Diri dan Sesama',
    profilLulusan: 'Kesehatan, Kemandirian, Bernalar Kritis, Kreatif, Berkarakter, Beriman, Bertakwa',
    tujuanKBC: 'Mengenal ciptaan Allah di alam semesta dan memahami pentingnya menjaga alam sebagai bentuk rasa syukur dan cinta kepada Allah',
    tujuanProfilLulusan: {
      Kesehatan: 'Memahami pentingnya udara bersih dan lingkungan sehat bagi tubuh',
      Kemandirian: 'Dapat menjaga kebersihan lingkungan sekitar secara mandiri',
      BernalarKritis: 'Memahami hubungan antara makhluk hidup dan lingkungannya',
      Kreatif: 'Menciptakan karya seni bertema alam dari bahan daur ulang',
      Berkarakter: 'Menumbuhkan sikap peduli terhadap lingkungan',
      Beriman: 'Mengenal alam sebagai ciptaan Allah yang harus disyukuri',
      Bertakwa: 'Memahami bahwa menjaga alam adalah bagian dari ibadah'
    },
    tujuanPembelajaranMendalam: 'KD1: Mengenal berbagai benda langit (matahari, bulan, bintang)\nKD2: Memahami perbedaan siang dan malam\nKD3: Mengenal berbagai tumbuhan dan hewan di lingkungan sekitar',
    materiIntegrasiKBC: 'Pengenalan alam semesta, benda langit, siang dan malam, tumbuhan dan hewan, dan cara menjaga lingkungan',
    tujuanPembelajaran: 'Setelah kegiatan pembelajaran, anak diharapkan dapat mengenal ciptaan Allah di alam semesta, memahami pentingnya menjaga alam, dan menumbuhkan rasa syukur kepada Allah',
    kerangkaPembelajaran: {
      praktekPedagogik: 'Pembelajaran berbasis proyek, Observasi langsung, Cerita bergambar, Diskusi kelompok',
      lingkunganPembelajaran: {
        fisik: 'Taman atau halaman sekolah, Tanaman, Aquarium, Poster tentang alam',
        sosial: 'Kerja kelompok menjaga tanaman, Observasi bersama hewan peliharaan',
        psikologis: 'Lingkungan yang menenangkan, Pujian atas usaha menjaga alam',
        akademik: 'Buku cerita tentang alam, Gambar tumbuhan dan hewan'
      },
      kemitraanPembelajaran: 'Petani atau penjual tanaman, Dokter hewan, Orang tua',
      pemanfaatanDigital: 'Video tentang benda langit, Aplikasi edukasi tentang alam'
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: 'Mempelajari tentang alam semesta, Menyiapkan materi tentang benda langit',
        penyiapanAlat: 'Menyiapkan tanaman di kelas, Mempersiapkan alat observasi',
        alatBahan: 'Tanaman pot, Benih, Tanah, Pot, Buku cerita tentang alam'
      },
      pelaksanaan: {
        orientasi: 'Mengajak anak mengamati langit, Bertanya tentang matahari dan bulan',
        eksplorasi: 'Mengamati tanaman di kelas, Meneliti hewan kecil di lingkungan',
        diskusi: 'Membahas perbedaan siang dan malam, Diskusi tentang pentingnya tanaman',
        kolaborasi: 'Kelompok menanam benih, Bersama-sama merawat tanaman',
        refleksi: 'Anak bercerita tentang apa yang dilihat, Menyebutkan ciptaan Allah yang disukai'
      },
      pembuatanKarya: {
        proses: 'Membuat poster tentang alam, Menanam tanaman di pot',
        hasil: 'Poster tentang alam, Tanaman yang ditanam'
      },
      presentasi: {
        persiapan: 'Menyiapkan hasil tanaman, Membuat kalimat tentang tanaman',
        pelaksanaan: 'Memperlihatkan tanaman yang tumbuh, Menceritakan cara merawat tanaman'
      },
      refleksiAkhir: {
        refleksiGuru: 'Menilai pemahaman tentang alam, Mengamati sikap menjaga lingkungan',
        refleksiAnak: 'Menceritakan bagian alam yang disukai, Menyampaikan cara menjaga alam'
      }
    }
  },
  {
    tema: 'Pahlawanku',
    topikKBC: 'Cinta Diri dan Sesama',
    profilLulusan: 'Kemandirian, Bernalar Kritis, Berkarakter, Beriman, Bertakwa',
    tujuanKBC: 'Mengenal para pahlawan dan meneladani semangat keberanian, kejujuran, dan cinta tanah air mereka',
    tujuanProfilLulusan: {
      Kesehatan: 'Memahami pentingnya jiwa yang kuat seperti pahlawan',
      Kemandirian: 'Dapat menirukan perilaku baik pahlawan dalam kehidupan sehari-hari',
      BernalarKritis: 'Memahami mengapa pahlawan berjuang untuk negara',
      Kreatif: 'Membuat karya tentang pahlawan',
      Berkarakter: 'Menumbuhkan sikap berani, jujur, dan cinta tanah air',
      Beriman: 'Memahami bahwa pahlawan adalah orang yang taat dan mencintai Allah',
      Bertakwa: 'Meneladani keberanian pahlawan dalam membela kebenaran'
    },
    tujuanPembelajaranMendalam: 'KD1: Mengenal beberapa pahlawan nasional Indonesia\nKD2: Memahami jasa para pahlawan\nKD3: Meneladani sifat-sifat baik pahlawan',
    materiIntegrasiKBC: 'Pengenalan pahlawan nasional, jasa pahlawan, sifat-sifat pahlawan, dan cara meneladani pahlawan',
    tujuanPembelajaran: 'Setelah kegiatan pembelajaran, anak diharapkan dapat mengenal beberapa pahlawan nasional, memahami jasa mereka, dan meneladani sifat-sifat baik mereka',
    kerangkaPembelajaran: {
      praktekPedagogik: 'Cerita tentang pahlawan, Main peran, Diskusi, Pembelajaran berbasis proyek',
      lingkunganPembelajaran: {
        fisik: 'Poster pahlawan, Buku cerita pahlawan, Baju-baju pahlawan',
        sosial: 'Peran bersama dalam cerita pahlawan, Diskusi kelompok',
        psikologis: 'Lingkungan yang membangkitkan semangat, Pujian atas keberanian',
        akademik: 'Buku sejarah sederhana, Gambar pahlawan'
      },
      kemitraanPembelajaran: 'Veteran, Sejarawan, Orang tua',
      pemanfaatanDigital: 'Video tentang pahlawan, Aplikasi edukasi sejarah'
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: 'Mempelajari riwayat pahlawan, Menyiapkan cerita tentang pahlawan',
        penyiapanAlat: 'Menyiapkan poster pahlawan, Mempersiapkan kostum sederhana',
        alatBahan: 'Poster pahlawan, Buku cerita, Kostum sederhana, Kertas dan krayon'
      },
      pelaksanaan: {
        orientasi: 'Menceritakan tentang pahlawan, Bertanya siapa pahlawan yang dikenal',
        eksplorasi: 'Melihat poster pahlawan, Mengenal nama-nama pahlawan',
        diskusi: 'Membahas jasa pahlawan, Diskusi tentang sifat pahlawan',
        kolaborasi: 'Kelompok memerankan cerita pahlawan, Bersama-sama membuat poster',
        refleksi: 'Anak bercerita tentang pahlawan yang dikagumi, Menyebutkan sifat yang ingin ditiru'
      },
      pembuatanKarya: {
        proses: 'Membuat gambar pahlawan, Menulis sifat pahlawan',
        hasil: 'Gambar pahlawan, Tulisan tentang sifat pahlawan'
      },
      presentasi: {
        persiapan: 'Menyiapkan gambar pahlawan, Membuat kalimat tentang pahlawan',
        pelaksanaan: 'Memperlihatkan gambar, Menceritakan tentang pahlawan yang digambar'
      },
      refleksiAkhir: {
        refleksiGuru: 'Menilai pemahaman tentang pahlawan, Mengamati semangat anak',
        refleksiAnak: 'Menceritakan pahlawan yang dikagumi, Menyebutkan sifat yang ditiru'
      }
    }
  },
  {
    tema: 'Keluargaku',
    topikKBC: 'Cinta Diri dan Sesama',
    profilLulusan: 'Kemandirian, Berkarakter, Beriman, Bertakwa',
    tujuanKBC: 'Menumbuhkan rasa cinta dan sayang terhadap keluarga serta memahami peran setiap anggota keluarga',
    tujuanProfilLulusan: {
      Kesehatan: 'Memahami pentingnya kesehatan keluarga',
      Kemandirian: 'Dapat membantu tugas di rumah',
      BernalarKritis: 'Memahami hubungan antar anggota keluarga',
      Kreatif: 'Membuat karya tentang keluarga',
      Berkarakter: 'Menumbuhkan sikap hormat dan sayang kepada keluarga',
      Beriman: 'Memahami bahwa keluarga adalah anugerah Allah',
      Bertakwa: 'Menghormati orang tua sebagai bentuk taat kepada Allah'
    },
    tujuanPembelajaranMendalam: 'KD1: Mengenal anggota keluarga\nKD2: Memahami peran setiap anggota keluarga\nKD3: Menumbuhkan rasa sayang terhadap keluarga',
    materiIntegrasiKBC: 'Pengenalan keluarga, anggota keluarga, peran keluarga, dan cara mencintai keluarga',
    tujuanPembelajaran: 'Setelah kegiatan pembelajaran, anak diharapkan dapat mengenal anggota keluarga, memahami peran mereka, dan menumbuhkan rasa sayang terhadap keluarga',
    kerangkaPembelajaran: {
      praktekPedagogik: 'Cerita tentang keluarga, Diskusi, Pembelajaran berbasis proyek, Role play',
      lingkunganPembelajaran: {
        fisik: 'Foto keluarga, Album keluarga, Rumah-rumahan mainan',
        sosial: 'Bercerita tentang keluarga masing-masing, Menunjukkan foto keluarga',
        psikologis: 'Lingkungan yang hangat, Pujian atas cinta keluarga',
        akademik: 'Buku cerita keluarga, Gambar keluarga'
      },
      kemitraanPembelajaran: 'Orang tua, Konselor keluarga',
      pemanfaatanDigital: 'Video tentang keluarga, Aplikasi edukasi keluarga'
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: 'Mempelajari tentang keluarga, Menyiapkan materi tentang peran keluarga',
        penyiapanAlat: 'Meminta anak membawa foto keluarga, Menyiapkan album keluarga',
        alatBahan: 'Foto keluarga, Album, Kertas dan krayon, Gunting dan lem'
      },
      pelaksanaan: {
        orientasi: 'Menceritakan tentang keluarga, Bertanya siapa anggota keluarga',
        eksplorasi: 'Melihat foto keluarga teman, Mengenal berbagai jenis keluarga',
        diskusi: 'Membahas peran ayah, ibu, dan anak, Diskusi tentang cara membantu keluarga',
        kolaborasi: 'Kelompok membuat pohon keluarga, Bersama-sama membuat rumah keluarga',
        refleksi: 'Anak bercerita tentang keluarga, Menyebutkan cara sayang keluarga'
      },
      pembuatanKarya: {
        proses: 'Membuat pohon keluarga, Membuat gambar keluarga',
        hasil: 'Pohon keluarga, Gambar keluarga'
      },
      presentasi: {
        persiapan: 'Menyiapkan pohon keluarga, Membuat kalimat tentang keluarga',
        pelaksanaan: 'Memperlihatkan pohon keluarga, Menceritakan anggota keluarga'
      },
      refleksiAkhir: {
        refleksiGuru: 'Menilai pemahaman tentang keluarga, Mengamati sikap sayang keluarga',
        refleksiAnak: 'Menceritakan anggota keluarga, Menyebutkan cara sayang keluarga'
      }
    }
  },
  {
    tema: 'Makananku Sehat',
    topikKBC: 'Cinta Diri dan Sesama',
    profilLulusan: 'Kesehatan, Kemandirian, Berkarakter',
    tujuanKBC: 'Mengenal berbagai jenis makanan sehat dan menumbuhkan kebiasaan mengonsumsi makanan yang bergizi',
    tujuanProfilLulusan: {
      Kesehatan: 'Memahami pentingnya makanan sehat bagi tubuh',
      Kemandirian: 'Dapat memilih makanan yang sehat',
      BernalarKritis: 'Membedakan makanan sehat dan tidak sehat',
      Kreatif: 'Membuat karya tentang makanan sehat',
      Berkarakter: 'Menumbuhkan kebiasaan makan makanan sehat',
      Beriman: 'Memahami bahwa makanan adalah nikmat Allah',
      Bertakwa: 'Bersyukur atas nikmat makanan yang diberikan Allah'
    },
    tujuanPembelajaranMendalam: 'KD1: Mengenal berbagai jenis makanan\nKD2: Membedakan makanan sehat dan tidak sehat\nKD3: Menumbuhkan kebiasaan makan makanan sehat',
    materiIntegrasiKBC: 'Pengenalan makanan sehat, jenis makanan, manfaat makanan, dan cara memilih makanan',
    tujuanPembelajaran: 'Setelah kegiatan pembelajaran, anak diharapkan dapat mengenal berbagai jenis makanan, membedakan makanan sehat dan tidak sehat, dan menumbuhkan kebiasaan makan makanan sehat',
    kerangkaPembelajaran: {
      praktekPedagogik: 'Demonstrasi, Eksperimen sederhana, Diskusi, Pembelajaran berbasis proyek',
      lingkunganPembelajaran: {
        fisik: 'Berbagai jenis makanan asli, Poster makanan sehat, Dapur mainan',
        sosial: 'Bercerita tentang makanan favorit, Mencoba makanan bersama',
        psikologis: 'Lingkungan yang nyaman, Pujian atas mencoba makanan baru',
        akademik: 'Buku cerita makanan sehat, Gambar makanan'
      },
      kemitraanPembelajaran: 'Ahli gizi, Orang tua, Penjual makanan sehat',
      pemanfaatanDigital: 'Video tentang makanan sehat, Aplikasi edukasi makanan'
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: 'Mempelajari tentang makanan sehat, Menyiapkan berbagai jenis makanan',
        penyiapanAlat: 'Menyiapkan makanan untuk dicicipi, Mempersiapkan poster makanan',
        alatBahan: 'Berbagai jenis buah, Sayuran, Makanan sehat, Piring dan sendok'
      },
      pelaksanaan: {
        orientasi: 'Menceritakan tentang makanan, Bertanya makanan favorit',
        eksplorasi: 'Melihat dan mencicipi berbagai buah, Mengenal berbagai sayuran',
        diskusi: 'Membahas makanan sehat, Diskusi tentang manfaat makanan',
        kolaborasi: 'Kelompok membuat salad buah, Bersama-sama menyusun piramida makanan',
        refleksi: 'Anak bercerita tentang makanan yang dicoba, Menyebutkan makanan favorit'
      },
      pembuatanKarya: {
        proses: 'Membuat salad buah, Membuat poster makanan sehat',
        hasil: 'Salad buat, Poster makanan sehat'
      },
      presentasi: {
        persiapan: 'Menyiapkan salad buah, Membuat kalimat tentang makanan sehat',
        pelaksanaan: 'Memperlihatkan salad buat, Menceritakan cara membuatnya'
      },
      refleksiAkhir: {
        refleksiGuru: 'Menilai pemahaman tentang makanan sehat, Mengamati keberanian mencoba makanan',
        refleksiAnak: 'Menceritakan makanan yang disukai, Menyebutkan makanan yang ingin dicoba'
      }
    }
  },
  {
    tema: 'Transportasi',
    topikKBC: 'Cinta Diri dan Sesama',
    profilLulusan: 'Kesehatan, Kemandirian, Bernalar Kritis, Kreatif, Berkarakter',
    tujuanKBC: 'Mengenal berbagai jenis alat transportasi dan memahami fungsinya serta cara menggunakannya dengan aman',
    tujuanProfilLulusan: {
      Kesehatan: 'Memahami pentingnya keselamatan dalam transportasi',
      Kemandirian: 'Dapat menggunakan transportasi dengan aman',
      BernalarKritis: 'Memahami fungsi setiap jenis transportasi',
      Kreatif: 'Membuat karya transportasi',
      Berkarakter: 'Menumbuhkan sikap tertib dan aman dalam transportasi',
      Beriman: 'Memahami bahwa transportasi adalah nikmat Allah',
      Bertakwa: 'Bersyukur atas kemudahan transportasi'
    },
    tujuanPembelajaranMendalam: 'KD1: Mengenal berbagai jenis alat transportasi\nKD2: Memahami fungsi alat transportasi\nKD3: Menggunakan alat transportasi dengan aman',
    materiIntegrasiKBC: 'Pengenalan transportasi, jenis transportasi, fungsi transportasi, dan keselamatan transportasi',
    tujuanPembelajaran: 'Setelah kegiatan pembelajaran, anak diharapkan dapat mengenal berbagai jenis transportasi, memahami fungsinya, dan menggunakannya dengan aman',
    kerangkaPembelajaran: {
      praktekPedagogik: 'Demonstrasi, Observasi, Diskusi, Pembelajaran berbasis proyek',
      lingkunganPembelajaran: {
        fisik: 'Miniatur transportasi, Poster transportasi, Area bermain transportasi',
        sosial: 'Bermain transportasi bersama, Diskusi tentang pengalaman transportasi',
        psikologis: 'Lingkungan yang aman, Pujian atas kepatuhan aturan',
        akademik: 'Buku cerita transportasi, Gambar transportasi'
      },
      kemitraanPembelajaran: 'Sopir, Polisi lalu lintas, Orang tua',
      pemanfaatanDigital: 'Video tentang transportasi, Aplikasi edukasi transportasi'
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: 'Mempelajari tentang transportasi, Menyiapkan miniatur transportasi',
        penyiapanAlat: 'Menyiapkan area bermain, Mempersiapkan poster keselamatan',
        alatBahan: 'Miniatur mobil, motor, pesawat, kapal, Poster transportasi'
      },
      pelaksanaan: {
        orientasi: 'Menceritakan tentang transportasi, Bertanya transportasi yang pernah dinaiki',
        eksplorasi: 'Melihat miniatur transportasi, Mengenal nama-nama transportasi',
        diskusi: 'Membahas fungsi setiap transportasi, Diskusi tentang keselamatan',
        kolaborasi: 'Kelompok membuat jalur transportasi, Bersama-sama bermain transportasi',
        refleksi: 'Anak bercerita tentang transportasi, Menyebutkan aturan keselamatan'
      },
      pembuatanKarya: {
        proses: 'Membuat miniatur transportasi, Membuat jalur lalu lintas',
        hasil: 'Miniatur transportasi, Jalur lalu lintas'
      },
      presentasi: {
        persiapan: 'Menyiapkan miniatur, Membuat kalimat tentang transportasi',
        pelaksanaan: 'Memperlihatkan miniatur, Menceritakan cara membuatnya'
      },
      refleksiAkhir: {
        refleksiGuru: 'Menilai pemahaman tentang transportasi, Mengamati keselamatan bermain',
        refleksiAnak: 'Menceritakan transportasi favorit, Menyebutkan aturan keselamatan'
      }
    }
  },
  {
    tema: 'Profesi',
    topikKBC: 'Cinta Diri dan Sesama',
    profilLulusan: 'Kemandirian, Bernalar Kritis, Kreatif, Berkarakter, Beriman, Bertakwa',
    tujuanKBC: 'Mengenal berbagai jenis profesi dan memahami pentingnya setiap profesi dalam kehidupan',
    tujuanProfilLulusan: {
      Kesehatan: 'Memahami pentingnya kesehatan dalam berbagai profesi',
      Kemandirian: 'Dapat menirukan aktivitas profesi sederhana',
      BernalarKritis: 'Memahami hubungan antar profesi',
      Kreatif: 'Membuat karya tentang profesi',
      Berkarakter: 'Menumbuhkan rasa hormat terhadap setiap profesi',
      Beriman: 'Memahami bahwa bekerja adalah ibadah',
      Bertakwa: 'Meniatkan bekerja untuk Allah'
    },
    tujuanPembelajaranMendalam: 'KD1: Mengenal berbagai jenis profesi\nKD2: Memahami peran setiap profesi\nKD3: Menumbuhkan rasa hormat terhadap profesi',
    materiIntegrasiKBC: 'Pengenalan profesi, jenis profesi, peran profesi, dan cara menghargai profesi',
    tujuanPembelajaran: 'Setelah kegiatan pembelajaran, anak diharapkan dapat mengenal berbagai profesi, memahami peran mereka, dan menumbuhkan rasa hormat terhadap setiap profesi',
    kerangkaPembelajaran: {
      praktekPedagogik: 'Role play, Diskusi, Pembelajaran berbasis proyek, Kunjungan',
      lingkunganPembelajaran: {
        fisik: 'Baju profesi, Alat-alat profesi, Poster profesi',
        sosial: 'Bermain peran profesi, Diskusi tentang profesi orang tua',
        psikologis: 'Lingkungan yang menghargai, Pujian atas usaha',
        akademik: 'Buku cerita profesi, Gambar profesi'
      },
      kemitraanPembelajaran: 'Berbagai profesional, Orang tua',
      pemanfaatanDigital: 'Video tentang profesi, Aplikasi edukasi profesi'
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: 'Mempelajari tentang profesi, Menyiapkan alat-alat profesi',
        penyiapanAlat: 'Menyiapkan baju profesi, Mempersiapkan area role play',
        alatBahan: 'Baju dokter, polisi, guru, chef, Alat-alat profesi'
      },
      pelaksanaan: {
        orientasi: 'Menceritakan tentang profesi, Bertanya profesi orang tua',
        eksplorasi: 'Mencoba baju profesi, Menggunakan alat-alat profesi',
        diskusi: 'Membahas peran setiap profesi, Diskusi tentang profesi yang diinginkan',
        kolaborasi: 'Kelompok bermain peran, Bersama-sama membuat rumah sakit atau sekolah',
        refleksi: 'Anak bercerita tentang profesi, Menyebutkan profesi yang diinginkan'
      },
      pembuatanKarya: {
        proses: 'Membuat gambar profesi, Membuat alat profesi sederhana',
        hasil: 'Gambar profesi, Alat profesi sederhana'
      },
      presentasi: {
        persiapan: 'Menyiapkan gambar profesi, Membuat kalimat tentang profesi',
        pelaksanaan: 'Memperlihatkan gambar, Menceritakan profesi yang digambar'
      },
      refleksiAkhir: {
        refleksiGuru: 'Menilai pemahaman tentang profesi, Mengamati rasa hormat',
        refleksiAnak: 'Menceritakan profesi yang diinginkan, Menyebutkan alasan ingin menjadi profesi tersebut'
      }
    }
  },
  {
    tema: 'Tanaman dan Bunga',
    topikKBC: 'Cinta Diri dan Sesama',
    profilLulusan: 'Kesehatan, Kemandirian, Bernalar Kritis, Kreatif, Berkarakter, Beriman, Bertakwa',
    tujuanKBC: 'Mengenal berbagai jenis tanaman dan bunga serta memahami cara merawatnya sebagai bentuk syukur kepada Allah',
    tujuanProfilLulusan: {
      Kesehatan: 'Memahami manfaat tanaman bagi kesehatan',
      Kemandirian: 'Dapat merawat tanaman secara mandiri',
      BernalarKritis: 'Memahami proses tumbuh tanaman',
      Kreatif: 'Membuat karya dari tanaman',
      Berkarakter: 'Menumbuhkan sikap peduli terhadap tanaman',
      Beriman: 'Memahami bahwa tanaman adalah ciptaan Allah',
      Bertakwa: 'Bersyukur atas keindahan ciptaan Allah'
    },
    tujuanPembelajaranMendalam: 'KD1: Mengenal berbagai jenis tanaman dan bunga\nKD2: Memahami cara merawat tanaman\nKD3: Menumbuhkan rasa cinta terhadap tanaman',
    materiIntegrasiKBC: 'Pengenalan tanaman, jenis tanaman, cara merawat tanaman, dan manfaat tanaman',
    tujuanPembelajaran: 'Setelah kegiatan pembelajaran, anak diharapkan dapat mengenal berbagai jenis tanaman, memahami cara merawatnya, dan menumbuhkan rasa cinta terhadap tanaman',
    kerangkaPembelajaran: {
      praktekPedagogik: 'Observasi langsung, Eksperimen menanam, Diskusi, Pembelajaran berbasis proyek',
      lingkunganPembelajaran: {
        fisik: 'Taman kelas, Berbagai jenis tanaman, Alat berkebun',
        sosial: 'Kerja kelompok merawat tanaman, Observasi tanaman bersama',
        psikologis: 'Lingkungan yang alami, Pujian atas kepedulian',
        akademik: 'Buku cerita tanaman, Gambar tanaman'
      },
      kemitraanPembelajaran: 'Tukang kebun, Ahli tanaman, Orang tua',
      pemanfaatanDigital: 'Video tentang tanaman, Aplikasi edukasi tanaman'
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: 'Mempelajari tentang tanaman, Menyiapkan benih dan tanah',
        penyiapanAlat: 'Menyiapkan pot dan tanah, Mempersiapkan alat berkebun',
        alatBahan: 'Benih berbagai jenis, Pot, Tanah, Air, Alat berkebun'
      },
      pelaksanaan: {
        orientasi: 'Menceritakan tentang tanaman, Bertanya tanaman yang dikenal',
        eksplorasi: 'Melihat berbagai jenis tanaman, Mengenal bagian tanaman',
        diskusi: 'Membahas cara menanam, Diskusi tentang merawat tanaman',
        kolaborasi: 'Kelompok menanam benih, Bersama-sama merawat tanaman',
        refleksi: 'Anak bercerita tentang tanaman, Menyebutkan cara merawat tanaman'
      },
      pembuatanKarya: {
        proses: 'Menanam benih di pot, Membuat herbarium sederhana',
        hasil: 'Tanaman yang ditanam, Herbarium sederhana'
      },
      presentasi: {
        persiapan: 'Menyiapkan tanaman yang tumbuh, Membuat kalimat tentang tanaman',
        pelaksanaan: 'Memperlihatkan tanaman, Menceritakan cara merawatnya'
      },
      refleksiAkhir: {
        refleksiGuru: 'Menilai pemahaman tentang tanaman, Mengamati kepedulian merawat',
        refleksiAnak: 'Menceritakan tanaman yang disukai, Menyebutkan cara merawat tanaman'
      }
    }
  },
  {
    tema: 'Hewan Peliharaanku',
    topikKBC: 'Cinta Diri dan Sesama',
    profilLulusan: 'Kesehatan, Kemandirian, Bernalar Kritis, Kreatif, Berkarakter, Beriman, Bertakwa',
    tujuanKBC: 'Mengenal berbagai jenis hewan peliharaan dan memahami cara merawatnya dengan penuh kasih sayang',
    tujuanProfilLulusan: {
      Kesehatan: 'Memahami pentingnya kebersihan dalam merawat hewan',
      Kemandirian: 'Dapat merawat hewan peliharaan secara sederhana',
      BernalarKritis: 'Memahami kebutuhan hewan',
      Kreatif: 'Membuat karya tentang hewan',
      Berkarakter: 'Menumbuhkan sikap sayang terhadap hewan',
      Beriman: 'Memahami bahwa hewan adalah ciptaan Allah',
      Bertakwa: 'Menyayangi hewan sebagai bentuk syukur'
    },
    tujuanPembelajaranMendalam: 'KD1: Mengenal berbagai jenis hewan peliharaan\nKD2: Memahami cara merawat hewan peliharaan\nKD3: Menumbuhkan rasa sayang terhadap hewan',
    materiIntegrasiKBC: 'Pengenalan hewan peliharaan, jenis hewan, cara merawat hewan, dan kebutuhan hewan',
    tujuanPembelajaran: 'Setelah kegiatan pembelajaran, anak diharapkan dapat mengenal berbagai hewan peliharaan, memahami cara merawatnya, dan menumbuhkan rasa sayang terhadap hewan',
    kerangkaPembelajaran: {
      praktekPedagogik: 'Observasi langsung, Diskusi, Pembelajaran berbasis proyek, Kunjungan',
      lingkunganPembelajaran: {
        fisik: 'Hewan peliharaan kelas, Kandang hewan, Makanan hewan',
        sosial: 'Memegang hewan bersama, Bercerita tentang hewan peliharaan',
        psikologis: 'Lingkungan yang aman, Pujian atas kelembutan',
        akademik: 'Buku cerita hewan, Gambar hewan'
      },
      kemitraanPembelajaran: 'Dokter hewan, Pemilik hewan, Orang tua',
      pemanfaatanDigital: 'Video tentang hewan, Aplikasi edukasi hewan'
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: 'Mempelajari tentang hewan, Menyiapkan hewan untuk observasi',
        penyiapanAlat: 'Menyiapkan kandang hewan, Mempersiapkan makanan hewan',
        alatBahan: 'Hewan peliharaan kelas, Kandang, Makanan hewan, Alat perawatan'
      },
      pelaksanaan: {
        orientasi: 'Menceritakan tentang hewan peliharaan, Bertanya hewan yang dipunya',
        eksplorasi: 'Melihat dan memegang hewan, Mengenal kebutuhan hewan',
        diskusi: 'Membahas cara merawat hewan, Diskusi tentang kebutuhan hewan',
        kolaborasi: 'Kelompok memberi makan hewan, Bersama-sama membersihkan kandang',
        refleksi: 'Anak bercerita tentang hewan, Menyebutkan cara merawat hewan'
      },
      pembuatanKarya: {
        proses: 'Membuat rumah hewan dari kardus, Membuat poster perawatan hewan',
        hasil: 'Rumah hewan dari kardus, Poster perawatan hewan'
      },
      presentasi: {
        persiapan: 'Menyiapkan rumah hewan, Membuat kalimat tentang perawatan hewan',
        pelaksanaan: 'Memperlihatkan rumah hewan, Menceritakan cara membuatnya'
      },
      refleksiAkhir: {
        refleksiGuru: 'Menilai pemahaman tentang hewan, Mengamati kelembutan pada hewan',
        refleksiAnak: 'Menceritakan hewan yang disukai, Menyebutkan cara merawat hewan'
      }
    }
  }
]

async function main() {
  console.log('Seeding many RPP Templates...')

  for (const template of templates) {
    try {
      await prisma.rPPTemplate.upsert({
        where: { tema: template.tema },
        update: {},
        create: {
          ...template,
          tujuanProfilLulusan: JSON.stringify(template.tujuanProfilLulusan),
          kerangkaPembelajaran: JSON.stringify(template.kerangkaPembelajaran),
          kegiatanPembelajaran: JSON.stringify(template.kegiatanPembelajaran),
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log(`✅ Template "${template.tema}" berhasil dibuat`)
    } catch (error) {
      console.error(`❌ Gagal membuat template "${template.tema}":`, error)
    }
  }

  console.log('\n✅ Seeding selesai!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
