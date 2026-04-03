import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Narasi lengkap untuk setiap tema
const completeNarratives: Record<string, any> = {
  "Adab dan Akhlak Mulia": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang adab dan akhlak mulia dalam Islam.\nGuru memahami nilai-nilai moral yang akan diajarkan kepada anak usia dini.\nGuru mempelajari pendekatan pembelajaran yang efektif untuk tema akhlak.\nGuru mengkaji kurikulum dan standar kompetensi yang relevan dengan tema pembelajaran.\nGuru mempersiapkan konsep penilaian yang sesuai untuk mengukur pemahaman adab anak.\nGuru berdiskusi dengan tim untuk memastikan pemahaman konsep yang sama.",
      penyiapanAlat: "Menyiapkan buku cerita tentang adab dan akhlak minimal 10 buah.\nMempersiapkan alat-alat seni: kertas, krayon, cat air, dan kuas.\nMenyiapkan audio player untuk memutar lagu-lagu Islami.\nMenyiapkan poster dan flashcard tentang adab-adab Islami.\nMempersiapkan boneka tangan untuk bercerita tentang akhlak.\nMenyiapkan alat peraga untuk demonstrasi adab sehari-hari.",
      alatBahan: "Buku cerita tentang Nabi dan sahabat minimal 10 buah.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nPoster adab-adab Islami minimal 5 set.\nBoneka tangan untuk bercerita minimal 5 buah.\nAudio player dan koleksi lagu Islami.\nFlashcard adab dan akhlak minimal 20 kartu.\nAlat peraga untuk demonstrasi.\nLem kertas dan gunting anak yang aman."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan membaca salam dan doa pembuka.\nGuru memperkenalkan tema 'Adab dan Akhlak Mulia' dengan cerita menarik.\nGuru bertanya: 'Apa itu adab yang baik?' dan menunggu respon anak.\nGuru menjelaskan pentingnya berakhlak mulia dalam kehidupan sehari-hari.\nGuru memutar lagu Islami tentang akhlak dan mengajak anak bernyanyi.\nGuru menjelaskan tujuan pembelajaran dengan bahasa sederhana.",
      eksplorasi: "Anak mengeksplorasi berbagai adab melalui peran dan simulasi.\nAnak bermain peran tentang adab makan, tidur, dan berbicara.\nAnak mengamati dan mendiskusikan contoh akhlak mulia dari cerita Nabi.\nAnak mengidentifikasi perilaku baik dan buruk melalui permainan.\nAnak melakukan aktivitas fisik untuk mempraktikkan adab.\nAnak mengeksplorasi nilai-nilai Islam melalui kartu dan poster.",
      diskusi: "Guru memfasilitasi diskusi tentang adab-adab yang baik.\nAnak berdiskusi tentang pentingnya menghormati orang tua.\nGuru mengajukan pertanyaan: 'Bagaimana cara bersikap yang baik?'\nAnak berbagi pengalaman tentang perilaku baik yang mereka lakukan.\nGuru dan anak mendiskusikan contoh akhlak mulia dalam kehidupan.\nDiskusi tentang pentingnya berdoa dan berdzikir.",
      kolaborasi: "Anak bekerja dalam kelompok untuk membuat poster tentang adab.\nAnak berkolaborasi menciptakan karya seni tentang akhlak mulia.\nAnak bermain peran kelompok tentang berbagai adab sehari-hari.\nAnak bekerja sama untuk menyusun buku cerita tentang Nabi.\nAnak berkolaborasi dalam permainan tentang nilai-nilai Islam.\nAnak bersama-sama membuat doa harian.",
      refleksi: "Anak diajak merefleksikan apa yang telah dipelajari.\nGuru bertanya: 'Apa adab yang paling kamu sukai?'\nAnak mengekspresikan perasaan setelah melakukan kegiatan.\nAnak berbagi satu hal baru tentang adab yang mereka pelajari.\nGuru dan anak membuat kesimpulan tentang pentingnya akhlak.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tentang adab yang baik.\nLangkah 3: Anak mewarnai gambar dengan warna yang sesuai.\nLangkah 4: Anak menambahkan detail dan hiasan.\nLangkah 5: Anak menulis atau menempelkan kata-kata tentang adab.\nLangkah 6: Anak menghias karya dengan stiker dan hiasan.\nLangkah 7: Anak mempresentasikan karya mereka.",
      hasil: "Poster tentang adab-adab Islami.\nBuku cerita tentang Nabi dan akhlak mulia.\nKartu-kartu adab yang dibuat sendiri oleh anak.\nKarya seni tentang nilai-nilai Islam.\nDoa-doa harian yang ditulis atau digambar.\nKolase tentang akhlak mulia."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya untuk presentasi.\nAnak berlatih berbicara di depan teman sebaya.\nGuru memfasilitasi sesi latihan presentasi dalam kelompok kecil.\nAnak menyiapkan kalimat pembuka dan penutup untuk presentasi.\nGuru memberikan tips dan trik untuk presentasi yang percaya diri.",
      pelaksanaan: "Setiap anak mempresentasikan karya mereka.\nAnak menjelaskan tentang gambar dan maknanya.\nAnak menyebutkan adab yang mereka gambarkan.\nAnak menjawab pertanyaan dari teman-teman dan guru.\nGuru memberikan apresiasi dan penguatan positif.\nAnak memberikan tepuk tangan untuk menghargai teman."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi apakah tujuan pembelajaran tercapai.\nGuru merefleksikan efektivitas metode pembelajaran yang digunakan.\nGuru menilai partisipasi dan keterlibatan anak dalam kegiatan.\nGuru mengidentifikasi anak yang membutuhkan dukungan tambahan.\nGuru mencatat kejadian penting dan perkembangan anak.\nGuru merencanakan tindak lanjut untuk pembelajaran selanjutnya.",
      refleksiAnak: "Anak menyebutkan 1-2 hal baru yang mereka pelajari.\nAnak mengungkapkan perasaan setelah kegiatan pembelajaran.\nAnak menilai bagian mana dari kegiatan yang paling mereka sukai.\nAnak menentukan apa yang ingin mereka pelajari lebih lanjut.\nAnak mengucap syukur dan terima kasih atas kegiatan.\nAnak menuliskan atau menggambar pengalaman belajar."
    }
  },
  "Al-Quran Kitab Suci": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang Al-Quran sebagai kitab suci.\nGuru memahami nilai-nilai Al-Quran untuk anak usia dini.\nGuru mempelajari cara memperkenalkan Al-Quran kepada anak.\nGuru mengkaji kurikulum pendidikan agama Islam.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk persiapan pembelajaran.",
      penyiapanAlat: "Menyiapkan Al-Quran minimal 5 buah untuk demonstrasi.\nMempersiapkan alat-alat seni untuk karya Al-Quran.\nMenyiapkan poster dan gambar tentang Al-Quran.\nMempersiapkan audio player untuk murottal.\nMenyiapkan lagu-lagu Islami tentang Al-Quran.\nMenyiapkan alat peraga untuk demonstrasi.",
      alatBahan: "Al-Quran minimal 5 buah untuk demonstrasi.\nPoster dan gambar Al-Quran minimal 5 set.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nAudio player dan koleksi murottal.\nLagu-lagu Islami tentang Al-Quran.\nAlat-alat seni untuk karya Al-Quran.\nStiker dan hiasan bertema Islam.\nKartu huruf hijaiyah minimal 28 kartu."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan membaca salam dan doa pembuka.\nGuru memperkenalkan tema 'Al-Quran Kitab Suci'.\nGuru bertanya: 'Apa itu Al-Quran?' dan mengajak anak menjawab.\nGuru menjelaskan tentang Al-Quran dengan bahasa sederhana.\nGuru memutar murottal dan mengajak anak mendengarkan.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi Al-Quran secara fisik.\nAnak mengamati poster dan gambar Al-Quran.\nAnak bermain peran tentang memegang dan menghormati Al-Quran.\nAnak mengidentifikasi huruf hijaiyah sederhana.\nAnak melakukan aktivitas fisik meniru gerak sholat.\nAnak mengeksplorasi bacaan Al-Quran.",
      diskusi: "Guru memfasilitasi diskusi tentang Al-Quran.\nAnak berdiskusi tentang cara menghormati Al-Quran.\nGuru mengajukan pertanyaan tentang Al-Quran.\nAnak berbagi pengalaman dengan Al-Quran di rumah.\nGuru dan anak mendiskusikan nilai Al-Quran.\nDiskusi tentang pentingnya membaca Al-Quran.",
      kolaborasi: "Anak bekerja dalam kelompok membuat poster Al-Quran.\nAnak berkolaborasi menciptakan karya seni Al-Quran.\nAnak bermain peran kelompok tentang Al-Quran.\nAnak bekerja sama menyusun buku Al-Quran.\nAnak berkolaborasi dalam permainan tentang Al-Quran.\nAnak bersama membuat karya kolase Al-Quran.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang Al-Quran.\nGuru bertanya: 'Apa yang kamu sukai dari Al-Quran?'\nAnak mengekspresikan perasaan setelah kegiatan.\nAnak berbagi hal baru tentang Al-Quran.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tentang Al-Quran.\nLangkah 3: Anak mewarnai gambar dengan indah.\nLangkah 4: Anak menambahkan detail Al-Quran.\nLangkah 5: Anak menulis atau menempelkan kata Al-Quran.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang Al-Quran.\nBuku kecil tentang Al-Quran.\nKarya seni Al-Quran indah.\nKolase Al-Quran.\nKartu-kartu huruf hijaiyah.\nModel Al-Quran dari kertas."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang Al-Quran.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya Al-Quran.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan hal tentang Al-Quran.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Alam Semesta yang Indah": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang alam semesta.\nGuru memahami berbagai fenomena alam untuk anak.\nGuru mempelajari metode pembelajaran sains alam.\nGuru mengkaji kurikulum sains alam untuk anak usia dini.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan buku cerita tentang alam semesta minimal 10 buah.\nMempersiapkan alat-alat seni untuk karya alam.\nMenyiapkan poster dan gambar tentang alam minimal 5 set.\nMempersiapkan alat observasi sederhana seperti lup.\nMenyiapkan lagu-lagu tentang alam.\nMenyiapkan alat peraga untuk demonstrasi.",
      alatBahan: "Buku cerita tentang alam minimal 10 buah.\nPoster dan gambar alam semesta minimal 5 set.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nLup dan kaca pembesar minimal 10 buah.\nAlat observasi sederhana.\nAudio player dan lagu alam.\nAlat-alat seni untuk karya alam.\nStiker dan hiasan bertema alam."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu tentang alam semesta.\nGuru memperkenalkan tema 'Alam Semesta yang Indah'.\nGuru bertanya: 'Apa yang ada di langit?' dan mengajak anak menjawab.\nGuru menjelaskan tentang alam semesta dengan sederhana.\nGuru memutar lagu alam dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi berbagai fenomena alam.\nAnak mengamati poster dan gambar alam.\nAnak bermain peran tentang alam semesta.\nAnak mengidentifikasi berbagai benda langit.\nAnak melakukan aktivitas fisik meniru gerak alam.\nAnak mengeksplorasi perubahan cuaca.",
      diskusi: "Guru memfasilitasi diskusi tentang alam semesta.\nAnak berdiskusi tentang fenomena alam.\nGuru mengajukan pertanyaan tentang alam.\nAnak berbagi pengalaman dengan alam.\nGuru dan anak mendiskusikan keindahan alam.\nDiskusi tentang menjaga alam.",
      kolaborasi: "Anak bekerja dalam kelompok membuat poster alam.\nAnak berkolaborasi menciptakan karya seni alam.\nAnak bermain peran kelompok tentang alam.\nAnak bekerja sama menyusun buku alam.\nAnak berkolaborasi dalam permainan tentang alam.\nAnak bersama membuat karya kolase alam.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang alam.\nGuru bertanya: 'Apa yang paling kamu sukai dari alam?'\nAnak mengekspresikan perasaan tentang alam.\nAnak berbagi hal baru tentang alam semesta.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tentang alam semesta.\nLangkah 3: Anak mewarnai gambar dengan indah.\nLangkah 4: Anak menambahkan detail alam.\nLangkah 5: Anak menulis atau menempelkan kata alam.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang alam semesta.\nBuku kecil tentang alam.\nKarya seni langit dan bumi.\nKolase alam semesta.\nKartu-kartu tentang alam.\nModel benda langit."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang alam.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya alam.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan fenomena alam.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan tentang alam.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Angka dan Berhitung": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar berhitung untuk anak usia dini.\nGuru memahami tahap perkembangan kemampuan berhitung anak.\nGuru mempelajari metode pembelajaran matematika yang menyenangkan.\nGuru mengkaji kurikulum matematika untuk anak usia dini.\nGuru mempersiapkan berbagai permainan berhitung.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan berbagai benda berhitung: balok, manik-manik, boneka.\nMempersiapkan kartu angka dan kartu berhitung.\nMenyiapkan alat-alat seni untuk aktivitas matematika.\nMenyiapkan poster angka dan simbol matematika.\nMempersiapkan lagu-lagu tentang angka dan berhitung.\nMenyiapkan playdough untuk membentuk angka.",
      alatBahan: "Balok kayu berwarna minimal 100 buah.\nManik-manik berwarna-warni minimal 200 buah.\nKartu angka 1-10 minimal 5 set.\nKartu berhitung minimal 10 set.\nBoneka hewan untuk berhitung minimal 20 buah.\nKeranjang berhitung minimal 5 buah.\nPoster angka dan simbol matematika.\nPapan tulis kecil untuk berhitung.\nAlat-alat seni untuk aktivitas matematika.\nAudio player dan lagu berhitung."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu angka dan berhitung.\nGuru memperkenalkan konsep angka dengan benda konkret.\nGuru bertanya: 'Berapa jumlahnya?' dan mengajak anak menghitung.\nGuru menjelaskan pentingnya berhitung dalam kehidupan.\nGuru memutar lagu berhitung dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi angka melalui benda-benda konkret.\nAnak berhitung berbagai benda di sekitar kelas.\nAnak bermain permainan berhitung dengan teman.\nAnak mengidentifikasi pola angka melalui permainan.\nAnak melakukan aktivitas fisik berhitung.\nAnak mengeksplorasi konsep lebih banyak dan lebih sedikit.",
      diskusi: "Guru memfasilitasi diskusi tentang berhitung.\nAnak berdiskusi tentang penggunaan angka sehari-hari.\nGuru mengajukan pertanyaan pemicu tentang berhitung.\nAnak berbagi kata-kata yang mereka kenal.\nGuru dan anak mendiskusikan konsep jumlah.\nDiskusi tentang pentingnya belajar berhitung.",
      kolaborasi: "Anak bekerja dalam kelompok untuk berhitung bersama.\nAnak berkolaborasi dalam permainan berhitung.\nAnak bermain peran kelompok tentang jual beli.\nAnak bekerja sama menyusun angka.\nAnak berkolaborasi membuat poster angka.\nAnak bersama-sama membuat karya matematika.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang berhitung.\nGuru bertanya: 'Apa yang paling kamu sukai?'\nAnak mengekspresikan perasaan setelah berhitung.\nAnak berbagi satu hal baru tentang angka.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan benda berhitung.\nLangkah 2: Anak menghitung benda-benda tersebut.\nLangkah 3: Anak menulis angka yang sesuai.\nLangkah 4: Anak membuat karya seni tentang angka.\nLangkah 5: Anak menambahkan detail dan hiasan.\nLangkah 6: Anak menempelkan atau menulis jumlah.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Kartu angka yang dibuat anak.\nPoster tentang berhitung.\nKarya seni angka dan berhitung.\nBuku kecil berhitung.\nKolase benda berhitung.\nPuzzle angka yang disusun anak."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang angka.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya angka.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan angka dan jumlah.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Hewan Peliharaanku": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang hewan peliharaan.\nGuru memahami berbagai jenis hewan peliharaan dan karakteristiknya.\nGuru mempelajari cara merawat hewan dengan benar.\nGuru mengkaji kurikulum sains untuk tema hewan.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan buku cerita tentang hewan peliharaan.\nMempersiapkan alat-alat seni untuk karya hewan.\nMenyiapkan foto atau video berbagai hewan peliharaan.\nMenyiapkan poster dan flashcard tentang hewan.\nMempersiapkan boneka hewan untuk bercerita.\nMenyiapkan alat peraga untuk demonstrasi merawat hewan.",
      alatBahan: "Buku cerita tentang hewan minimal 10 buah.\nFoto dan video berbagai hewan peliharaan.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nPoster hewan peliharaan minimal 5 set.\nBoneka hewan untuk bercerita minimal 5 buah.\nFlashcard hewan minimal 20 kartu.\nAlat-alat seni untuk karya hewan.\nKotak atau kandung hewan mini untuk demonstrasi."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan doa dan salam pembuka.\nGuru memperkenalkan tema 'Hewan Peliharaanku' dengan gambar.\nGuru bertanya: 'Hewan peliharaan apa yang kamu punya?'\nGuru menjelaskan tentang berbagai jenis hewan peliharaan.\nGuru memutar lagu tentang hewan dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi berbagai jenis hewan peliharaan.\nAnak mengamati foto dan video hewan peliharaan.\nAnak bermain peran merawat hewan peliharaan.\nAnak mengidentifikasi karakteristik hewan berbeda.\nAnak melakukan aktivitas fisik meniru gerak hewan.\nAnak mengeksplorasi suara hewan.",
      diskusi: "Guru memfasilitasi diskusi tentang hewan peliharaan.\nAnak berdiskusi tentang cara merawat hewan.\nGuru mengajukan pertanyaan tentang hewan.\nAnak berbagi pengalaman dengan hewan peliharaan.\nGuru dan anak mendiskusikan kebutuhan hewan.\nDiskusi tentang pentingnya menyayangi hewan.",
      kolaborasi: "Anak bekerja dalam kelompok membuat poster hewan.\nAnak berkolaborasi menciptakan karya seni hewan.\nAnak bermain peran kelompok tentang merawat hewan.\nAnak bekerja sama menyusun buku tentang hewan.\nAnak berkolaborasi dalam permainan tentang hewan.\nAnak bersama membuat karya kolase hewan.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang hewan.\nGuru bertanya tentang hewan yang disukai.\nAnak mengekspresikan perasaan setelah kegiatan.\nAnak berbagi hal baru tentang hewan.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar hewan peliharaan.\nLangkah 3: Anak mewarnai gambar dengan sesuai.\nLangkah 4: Anak menambahkan detail hewan.\nLangkah 5: Anak menulis atau menempelkan nama hewan.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang hewan peliharaan.\nBuku cerita tentang hewan.\nKartu hewan yang dibuat anak.\nKarya seni berbagai hewan.\nKolase hewan peliharaan.\nModel hewan dari bahan daur ulang."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang hewan.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya hewan.\nAnak menjelaskan tentang hewan yang digambar.\nAnak menyebutkan ciri-ciri hewan.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Huruf dan Membaca": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar pengenalan huruf untuk anak.\nGuru memahami tahap perkembangan literasi anak.\nGuru mempelajari metode pembelajaran membaca yang menyenangkan.\nGuru mengkaji kurikulum literasi anak usia dini.\nGuru mempersiapkan berbagai permainan huruf.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan kartu huruf A-Z minimal 5 set.\nMempersiapkan buku cerita bergambar.\nMenyiapkan alat-alat seni untuk aktivitas huruf.\nMenyiapkan poster huruf dan kata.\nMempersiapkan lagu-lagu tentang huruf.\nMenyiapkan playdough untuk membentuk huruf.",
      alatBahan: "Kartu huruf A-Z minimal 5 set.\nBuku cerita bergambar minimal 15 buah.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nPlaydough berwarna-warni untuk setiap anak.\nPoster huruf dan kata minimal 5 set.\nKartu kata bergambar minimal 30 kartu.\nAlat-alat seni untuk karya huruf.\nPapan tulis kecil.\nAudio player dan lagu huruf."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu ABC atau huruf.\nGuru memperkenalkan huruf dengan kartu huruf.\nGuru bertanya: 'Huruf apa ini?' dan mengajak anak menyebut.\nGuru menjelaskan pentingnya mengenal huruf.\nGuru memutar lagu huruf dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi huruf melalui kartu dan poster.\nAnak bermain mencari huruf di sekitar kelas.\nAnak membentuk huruf dengan playdough.\nAnak mengidentifikasi huruf dalam nama mereka.\nAnak melakukan aktivitas fisik membentuk huruf.\nAnak mengeksplorasi huruf awal berbagai kata.",
      diskusi: "Guru memfasilitasi diskusi tentang huruf.\nAnak berdiskusi tentang huruf dalam nama mereka.\nGuru mengajukan pertanyaan tentang huruf.\nAnak berbagi kata-kata yang mereka kenal.\nGuru dan anak mendiskusikan bunyi huruf.\nDiskusi tentang pentingnya membaca.",
      kolaborasi: "Anak bekerja dalam kelompok mencari huruf.\nAnak berkolaborasi membentuk huruf bersama.\nAnak bermain peran kelompok tentang huruf.\nAnak bekerja sama menyusun kata dari huruf.\nAnak berkolaborasi membuat poster huruf.\nAnak bersama membuat karya huruf.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang huruf.\nGuru bertanya: 'Huruf apa yang kamu suka?'\nAnak mengekspresikan perasaan setelah kegiatan.\nAnak berbagi huruf baru yang dikenal.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menulis huruf yang dipelajari.\nLangkah 3: Anak mewarnai huruf dengan indah.\nLangkah 4: Anak menambahkan gambar yang sesuai.\nLangkah 5: Anak menulis kata dengan huruf tersebut.\nLangkah 6: Anak menghias karya dengan stiker.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Kartu huruf yang dibuat anak.\nPoster tentang huruf A-Z.\nBuku huruf kecil.\nKarya seni huruf dan kata.\nKolase huruf.\nPlaydough huruf yang dibentuk anak."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih menyebut huruf.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya huruf.\nAnak menjelaskan tentang huruf yang dibuat.\nAnak menyebutkan huruf dan kata.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan huruf baru yang dikenal.\nAnak mengungkapkan perasaan.\nAnak menilai bagian yang disukai.\nAnak menentukan huruf yang ingin dipelajari.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Indonesia Pusaka": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang cinta tanah air.\nGuru memahami nilai-nilai kebangsaan untuk anak.\nGuru mempelajari sejarah Indonesia secara sederhana.\nGuru mengkaji kurikulum PPKn untuk anak usia dini.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan buku cerita tentang Indonesia.\nMempersiapkan alat-alat seni untuk karya Indonesia.\nMenyiapkan Bendera Merah Putih dan atribut Indonesia.\nMenyiapkan poster tentang Indonesia dan budayanya.\nMempersiapkan lagu-lagu nasional Indonesia.\nMenyiapkan peta Indonesia dan propinsi.",
      alatBahan: "Buku cerita tentang Indonesia minimal 10 buah.\nBendera Merah Putih minimal 5 buah.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nPoster Indonesia dan budaya minimal 5 set.\nPeta Indonesia minimal 2 buah.\nAlat-alat seni untuk karya Indonesia.\nAudio player dan lagu nasional.\nStiker dan hiasan bertema Indonesia."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu Indonesia Raya.\nGuru memperkenalkan tema 'Indonesia Pusaka'.\nGuru bertanya: 'Negara apa?' dan mengajak anak menjawab.\nGuru menjelaskan tentang Indonesia dengan sederhana.\nGuru memutar lagu nasional dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi peta Indonesia.\nAnak mengamati Bendera Merah Putih.\nAnak bermain peran tentang cinta tanah air.\nAnak mengidentifikasi berbagai budaya Indonesia.\nAnak melakukan aktivitas fisik meniru gerak.\nAnak mengeksplorasi lagu-lagu nasional.",
      diskusi: "Guru memfasilitasi diskusi tentang Indonesia.\nAnak berdiskusi tentang cinta tanah air.\nGuru mengajukan pertanyaan tentang Indonesia.\nAnak berbagi pengalaman tentang Indonesia.\nGuru dan anak mendiskusikan nilai kebangsaan.\nDiskusi tentang pentingnya bersatu.",
      kolaborasi: "Anak bekerja dalam kelompok membuat poster Indonesia.\nAnak berkolaborasi menciptakan karya seni Indonesia.\nAnak bermain peran kelompok tentang kebangsaan.\nAnak bekerja sama menyusun buku Indonesia.\nAnak berkolaborasi dalam permainan tentang Indonesia.\nAnak bersama membuat karya kolase Indonesia.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang Indonesia.\nGuru bertanya tentang Indonesia.\nAnak mengekspresikan perasaan cinta tanah air.\nAnak berbagi hal baru tentang Indonesia.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar Bendera Merah Putih.\nLangkah 3: Anak mewarnai dengan benar.\nLangkah 4: Anak menambahkan gambar Indonesia.\nLangkah 5: Anak menulis atau menempelkan kata Indonesia.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster Bendera Merah Putih.\nBuku kecil tentang Indonesia.\nKarya seni bertema Indonesia.\nKolase budaya Indonesia.\nPeta Indonesia yang diwarnai.\nKartu-kartu tentang Indonesia."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang Indonesia.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya Indonesia.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan ciri-ciri Indonesia.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan cinta tanah air.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Keluargaku yang Sayang": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang keluarga.\nGuru memahami nilai-nilai keluarga untuk anak.\nGuru mempelajari cara menjelaskan peran keluarga.\nGuru mengkaji kurikulum pengembangan sosial.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan buku cerita tentang keluarga.\nMempersiapkan alat-alat seni untuk karya keluarga.\nMenyiapkan bingkai foto keluarga.\nMenyiapkan poster tentang keluarga.\nMempersiapkan lagu-lagu tentang keluarga.\nMenyiapkan alat peraga untuk permainan keluarga.",
      alatBahan: "Buku cerita tentang keluarga minimal 10 buah.\nBingkai foto untuk setiap anak.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nPoster tentang keluarga minimal 5 set.\nFoto keluarga anak (jika ada).\nAudio player dan lagu keluarga.\nAlat-alat seni untuk karya keluarga.\nStiker dan hiasan bertema keluarga."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu tentang keluarga.\nGuru memperkenalkan tema 'Keluargaku yang Sayang'.\nGuru bertanya: 'Siapa anggota keluargamu?'\nGuru menjelaskan tentang keluarga dengan sederhana.\nGuru memutar lagu keluarga dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi konsep keluarga.\nAnak mengamati berbagai jenis keluarga.\nAnak bermain peran tentang keluarga.\nAnak mengidentifikasi peran anggota keluarga.\nAnak melakukan aktivitas fisik tentang keluarga.\nAnak mengeksplorasi nilai keluarga.",
      diskusi: "Guru memfasilitasi diskusi tentang keluarga.\nAnak berdiskusi tentang anggota keluarga.\nGuru mengajukan pertanyaan tentang keluarga.\nAnak berbagi pengalaman dengan keluarga.\nGuru dan anak mendiskusikan peran keluarga.\nDiskusi tentang menyayangi keluarga.",
      kolaborasi: "Anak bekerja dalam kelompok membuat poster keluarga.\nAnak berkolaborasi menciptakan karya seni keluarga.\nAnak bermain peran kelompok tentang keluarga.\nAnak bekerja sama menyusun buku keluarga.\nAnak berkolaborasi dalam permainan keluarga.\nAnak bersama membuat karya kolase keluarga.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang keluarga.\nGuru bertanya: 'Apa yang kamu sukai dari keluargamu?'\nAnak mengekspresikan perasaan tentang keluarga.\nAnak berbagi hal baru tentang keluarga.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tentang keluarga.\nLangkah 3: Anak mewarnai gambar dengan indah.\nLangkah 4: Anak menambahkan detail keluarga.\nLangkah 5: Anak menulis nama anggota keluarga.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang keluarga.\nBuku kecil tentang keluarga.\nKarya seni keluarga.\nKolase keluarga.\nKartu-kartu keluarga.\nBingkai foto keluarga."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang keluarga.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya keluarga.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan anggota keluarga.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan tentang keluarga.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Lingkungan Sekitarku": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang lingkungan.\nGuru memahami berbagai aspek lingkungan sekitar.\nGuru mempelajari cara menjaga lingkungan.\nGuru mengkaji kurikulum pendidikan lingkungan.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan buku cerita tentang lingkungan.\nMempersiapkan alat-alat seni untuk karya lingkungan.\nMenyiapkan poster tentang lingkungan bersih.\nMempersiapkan alat untuk eksplorasi lingkungan.\nMenyiapkan lagu-lagu tentang lingkungan.\nMenyiapkan alat peraga untuk demonstrasi.",
      alatBahan: "Buku cerita tentang lingkungan minimal 10 buah.\nPoster lingkungan bersih minimal 5 set.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nAlat untuk eksplorasi lingkungan.\nAudio player dan lagu lingkungan.\nAlat-alat seni untuk karya lingkungan.\nStiker dan hiasan bertema lingkungan.\nTempat sampah mini untuk demonstrasi."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu tentang lingkungan.\nGuru memperkenalkan tema 'Lingkungan Sekitarku'.\nGuru bertanya: 'Apa yang ada di sekitarmu?'\nGuru menjelaskan tentang lingkungan sekitar.\nGuru memutar lagu lingkungan dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi lingkungan sekitar kelas.\nAnak mengamati berbagai benda di lingkungan.\nAnak bermain peran tentang menjaga lingkungan.\nAnak mengidentifikasi tempat sampah dan kebersihan.\nAnak melakukan aktivitas fisik membersihkan.\nAnak mengeksplorasi cara daur ulang.",
      diskusi: "Guru memfasilitasi diskusi tentang lingkungan.\nAnak berdiskusi tentang menjaga lingkungan.\nGuru mengajukan pertanyaan tentang lingkungan.\nAnak berbagi pengalaman di lingkungan.\nGuru dan anak mendiskusikan kebersihan.\nDiskusi tentang daur ulang.",
      kolaborasi: "Anak bekerja dalam kelompok membersihkan lingkungan.\nAnak berkolaborasi menciptakan karya lingkungan.\nAnak bermain peran kelompok tentang lingkungan.\nAnak bekerja sama menyusun buku lingkungan.\nAnak berkolaborasi dalam permainan lingkungan.\nAnak bersama membuat karya kolase lingkungan.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang lingkungan.\nGuru bertanya: 'Bagaimana cara menjaga lingkungan?'\nAnak mengekspresikan perasaan tentang lingkungan.\nAnak berbagi hal baru tentang lingkungan.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tentang lingkungan.\nLangkah 3: Anak mewarnai gambar dengan indah.\nLangkah 4: Anak menambahkan detail lingkungan.\nLangkah 5: Anak menulis atau menempelkan kata lingkungan.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang lingkungan bersih.\nBuku kecil tentang lingkungan.\nKarya seni lingkungan.\nKolase lingkungan sekitar.\nKartu-kartu lingkungan.\nModel daur ulang dari bahan daur ulang."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang lingkungan.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya lingkungan.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan cara menjaga lingkungan.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan tentang lingkungan.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Masjid Tempat Ibadah": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang masjid dan ibadah.\nGuru memahami nilai-nilai ibadah dalam Islam.\nGuru mempelajari tata cara ibadah di masjid.\nGuru mengkaji kurikulum pendidikan agama.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk persiapan.",
      penyiapanAlat: "Menyiapkan buku cerita tentang masjid.\nMempersiapkan alat-alat seni untuk karya masjid.\nMenyiapkan gambar atau video masjid.\nMenyiapkan poster tentang tata cara sholat.\nMempersiapkan lagu-lagu Islami.\nMenyiapkan alat peraga untuk demonstrasi ibadah.",
      alatBahan: "Buku cerita tentang masjid minimal 10 buah.\nGambar atau video masjid indah.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nPoster tata cara sholat minimal 5 set.\nAlat peraga sholat minimal 5 set.\nAudio player dan lagu Islami.\nAlat-alat seni untuk karya masjid.\nStiker dan hiasan bertema Islam."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan membaca salam dan doa.\nGuru memperkenalkan tema 'Masjid Tempat Ibadah'.\nGuru bertanya: 'Apa itu masjid?' dan mengajak anak menjawab.\nGuru menjelaskan tentang masjid dan ibadah.\nGuru memutar lagu Islami dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi gambar masjid.\nAnak mengamati video tentang masjid.\nAnak bermain peran tentang ibadah di masjid.\nAnak mengidentifikasi bagian-bagian masjid.\nAnak melakukan aktivitas fisik meniru gerak sholat.\nAnak mengeksplorasi bacaan sholat.",
      diskusi: "Guru memfasilitasi diskusi tentang masjid.\nAnak berdiskusi tentang ibadah di masjid.\nGuru mengajukan pertanyaan tentang sholat.\nAnak berbagi pengalaman ke masjid.\nGuru dan anak mendiskusikan nilai ibadah.\nDiskusi tentang pentingnya beribadah.",
      kolaborasi: "Anak bekerja dalam kelompok membuat poster masjid.\nAnak berkolaborasi menciptakan karya seni masjid.\nAnak bermain peran kelompok tentang ibadah.\nAnak bekerja sama menyusun buku masjid.\nAnak berkolaborasi dalam permainan tentang ibadah.\nAnak bersama membuat karya kolase masjid.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang masjid.\nGuru bertanya tentang ibadah.\nAnak mengekspresikan perasaan setelah kegiatan.\nAnak berbagi hal baru tentang masjid.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar masjid.\nLangkah 3: Anak mewarnai masjid dengan indah.\nLangkah 4: Anak menambahkan detail masjid.\nLangkah 5: Anak menulis atau menempelkan kata masjid.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang masjid.\nBuku kecil tentang ibadah.\nKarya seni masjid indah.\nKolase masjid.\nModel masjid dari kertas.\nKartu-kartu tentang ibadah."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang masjid.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya masjid.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan bagian masjid.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Rasul-rasul Allah": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari kisah-kisah Nabi untuk anak.\nGuru memahami nilai-nilai dari para Rasul.\nGuru mempelajari cara menyampaikan kisah Nabi.\nGuru mengkaji kurikulum pendidikan agama.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk persiapan.",
      penyiapanAlat: "Menyiapkan buku cerita tentang para Nabi.\nMempersiapkan alat-alat seni untuk karya Nabi.\nMenyiapkan gambar atau video kisah Nabi.\nMenyiapkan poster tentang para Nabi.\nMempersiapkan lagu-lagu tentang Nabi.\nMenyiapkan boneka atau alat peraga.",
      alatBahan: "Buku cerita tentang para Nabi minimal 15 buah.\nGambar atau video kisah Nabi.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nPoster para Nabi minimal 5 set.\nBoneka atau alat peraga kisah Nabi.\nAudio player dan lagu Nabi.\nAlat-alat seni untuk karya Nabi.\nStiker dan hiasan bertema Islam."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan membaca salam dan doa.\nGuru memperkenalkan tema 'Rasul-rasul Allah'.\nGuru bertanya: 'Nabi apa yang kamu kenal?'\nGuru menjelaskan tentang para Rasul Allah.\nGuru memutar lagu tentang Nabi dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi kisah-kisah Nabi.\nAnak mengamati gambar atau video Nabi.\nAnak bermain peran tentang kisah Nabi.\nAnak mengidentifikasi nilai-nilai dari Nabi.\nAnak melakukan aktivitas fisik meniru perbuatan Nabi.\nAnak mengeksplorasi doa-doa Nabi.",
      diskusi: "Guru memfasilitasi diskusi tentang para Nabi.\nAnak berdiskusi tentang kisah Nabi.\nGuru mengajukan pertanyaan tentang Nabi.\nAnak berbagi kisah Nabi yang mereka kenal.\nGuru dan anak mendiskusikan nilai-nilai Nabi.\nDiskusi tentang meneladani para Nabi.",
      kolaborasi: "Anak bekerja dalam kelompok membuat poster Nabi.\nAnak berkolaborasi menciptakan karya seni Nabi.\nAnak bermain peran kelompok tentang kisah Nabi.\nAnak bekerja sama menyusun buku Nabi.\nAnak berkolaborasi dalam permainan tentang Nabi.\nAnak bersama membuat karya kolase Nabi.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang Nabi.\nGuru bertanya tentang kisah Nabi.\nAnak mengekspresikan perasaan setelah kegiatan.\nAnak berbagi hal baru tentang Nabi.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tentang kisah Nabi.\nLangkah 3: Anak mewarnai gambar dengan indah.\nLangkah 4: Anak menambahkan detail kisah.\nLangkah 5: Anak menulis atau menempelkan kata tentang Nabi.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang para Nabi.\nBuku kecil kisah Nabi.\nKarya seni tentang Nabi.\nKolase kisah Nabi.\nKartu-kartu tentang Nabi.\nModel kisah Nabi dari kertas."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang Nabi.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya Nabi.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan kisah Nabi.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Sains dan Eksperimen": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar sains untuk anak.\nGuru memahami eksperimen sederhana yang aman.\nGuru mempelajari metode inquiry based learning.\nGuru mengkaji kurikulum sains anak usia dini.\nGuru mempersiapkan berbagai eksperimen sederhana.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan alat-alat eksperimen sains sederhana.\nMempersiapkan bahan-bahan untuk eksperimen.\nMenyiapkan alat-alat seni untuk dokumentasi.\nMenyiapkan poster tentang sains dan alam.\nMempersiapkan alat pelindung dan keamanan.\nMenyiapkan buku catatan untuk eksperimen.",
      alatBahan: "Gelas plastik transparan minimal 20 buah.\nAir dan berbagai bahan eksperimen.\nKertas saring dan corong minimal 10 set.\nMagnet berbagai bentuk minimal 5 set.\nLup dan kaca pembesar minimal 10 buah.\nAlat ukur sederhana minimal 5 set.\nPoster sains dan alam minimal 5 set.\nBuku catatan eksperimen untuk setiap anak.\nAlat-alat seni untuk dokumentasi.\nAlat pelindung dan keamanan."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan pertanyaan sains yang menarik.\nGuru memperkenalkan tema 'Sains dan Eksperimen'.\nGuru bertanya: 'Apa yang terjadi jika...?' dan mengajak anak berpikir.\nGuru menjelaskan tentang sains dengan sederhana.\nGuru memperlihatkan eksperimen demo.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi berbagai bahan sains.\nAnak melakukan eksperimen sederhana.\nAnak mengamati perubahan yang terjadi.\nAnak mengidentifikasi pola dalam eksperimen.\nAnak melakukan aktivitas hands-on sains.\nAnak mengeksplorasi alam sekitar.",
      diskusi: "Guru memfasilitasi diskusi tentang eksperimen.\nAnak berdiskusi tentang hasil eksperimen.\nGuru mengajukan pertanyaan pemicu.\nAnak berbagi hipotesis dan temuan.\nGuru dan anak mendiskusikan kesimpulan.\nDiskusi tentang pentingnya sains.",
      kolaborasi: "Anak bekerja dalam kelompok untuk eksperimen.\nAnak berkolaborasi dalam penelitian sederhana.\nAnak bermain peran ilmuwan kecil.\nAnak bekerja sama mendokumentasikan hasil.\nAnak berkolaborasi membuat poster sains.\nAnak bersama membuat kesimpulan eksperimen.",
      refleksi: "Anak merefleksikan apa yang dipelajari dari eksperimen.\nGuru bertanya: 'Apa yang kamu temukan?'\nAnak mengekspresikan perasaan setelah eksperimen.\nAnak berbagi kesimpulan dari eksperimen.\nGuru dan anak membuat kesimpulan bersama.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan alat dan bahan eksperimen.\nLangkah 2: Anak melakukan eksperimen sederhana.\nLangkah 3: Anak mengamati dan mencatat hasil.\nLangkah 4: Anak mendokumentasikan dengan gambar.\nLangkah 5: Anak menulis kesimpulan.\nLangkah 6: Anak membuat poster tentang eksperimen.\nLangkah 7: Anak mempresentasikan hasil.",
      hasil: "Poster eksperimen sains.\nBuku catatan eksperimen.\nKarya seni tentang sains.\nModel eksperimen.\nKartu-kartu sains.\nLaporan eksperimen sederhana."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan presentasi.\nAnak berlatih menjelaskan eksperimen.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan eksperimen.\nAnak menjelaskan prosedur dan hasil.\nAnak menyebutkan kesimpulan.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan.\nAnak menilai bagian yang disukai.\nAnak menentukan eksperimen berikutnya.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Tanaman dan Bunga": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang tanaman.\nGuru memahami berbagai jenis tanaman dan bunga.\nGuru mempelajari cara merawat tanaman.\nGuru mengkaji kurikulum sains alam.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan berbagai tanaman dan bunga.\nMempersiapkan alat-alat berkebun untuk anak.\nMenyiapkan alat-alat seni untuk karya tanaman.\nMenyiapkan poster tentang tanaman dan bunga.\nMempersiapkan bibit tanaman untuk ditanam.\nMenyiapkan alat peraga untuk demonstrasi.",
      alatBahan: "Berbagai tanaman dan bunga minimal 10 jenis.\nPot kecil untuk setiap anak.\nTanah dan pupuk untuk menanam.\nAlat-alat berkebun anak minimal 10 set.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nPoster tanaman dan bunga minimal 5 set.\nBibit tanaman untuk ditanam.\nAlat-alat seni untuk karya tanaman.\nKamera untuk dokumentasi pertumbuhan."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu tentang tanaman.\nGuru memperkenalkan tema 'Tanaman dan Bunga'.\nGuru bertanya: 'Tanaman apa yang kamu kenal?'\nGuru menjelaskan tentang tanaman dan bunga.\nGuru memperlihatkan berbagai tanaman.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi berbagai tanaman.\nAnak mengamati bagian-bagian tanaman.\nAnak menanam bibit tanaman sendiri.\nAnak mengidentifikasi berbagai jenis bunga.\nAnak melakukan aktivitas fisik merawat tanaman.\nAnak mengeksplorasi pertumbuhan tanaman.",
      diskusi: "Guru memfasilitasi diskusi tentang tanaman.\nAnak berdiskusi tentang cara merawat tanaman.\nGuru mengajukan pertanyaan tentang tanaman.\nAnak berbagi pengalaman berkebun.\nGuru dan anak mendiskusikan pentingnya tanaman.\nDiskusi tentang lingkungan hijau.",
      kolaborasi: "Anak bekerja dalam kelompok menanam tanaman.\nAnak berkolaborasi merawat tanaman kelas.\nAnak bermain peran tentang kebun.\nAnak bekerja sama membuat poster tanaman.\nAnak berkolaborasi dalam permainan tanaman.\nAnak bersama membuat karya kolase tanaman.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang tanaman.\nGuru bertanya tentang tanaman yang disukai.\nAnak mengekspresikan perasaan setelah kegiatan.\nAnak berbagi hal baru tentang tanaman.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan pot dan bibit tanaman.\nLangkah 2: Anak menanam bibit dengan benar.\nLangkah 3: Anak menyiram dan merawat tanaman.\nLangkah 4: Anak menggambar tanaman mereka.\nLangkah 5: Anak menulis nama tanaman.\nLangkah 6: Anak menghias pot tanaman.\nLangkah 7: Anak mempresentasikan tanaman.",
      hasil: "Tanaman yang ditanam anak.\nPoster tentang tanaman dan bunga.\nBuku catatan pertumbuhan tanaman.\nKarya seni tanaman.\nKolase bunga-bunga.\nKartu-kartu tentang tanaman."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan presentasi.\nAnak berlatih berbicara tentang tanaman.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan tanaman.\nAnak menjelaskan tentang tanaman mereka.\nAnak menyebutkan cara merawat tanaman.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Teman": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang pertemanan.\nGuru memahami nilai-nilai berteman untuk anak.\nGuru mempelajari cara membangun pertemanan sehat.\nGuru mengkaji kurikulum pengembangan sosial.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan buku cerita tentang pertemanan.\nMempersiapkan alat-alat seni untuk karya teman.\nMenyiapkan foto teman-teman di kelas.\nMenyiapkan poster tentang pertemanan.\nMempersiapkan lagu-lagu tentang teman.\nMenyiapkan alat peraga untuk permainan sosial.",
      alatBahan: "Buku cerita tentang pertemanan minimal 10 buah.\nFoto teman-teman di kelas.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nPoster tentang pertemanan minimal 5 set.\nKamera untuk memfoto kegiatan.\nAudio player dan lagu pertemanan.\nAlat-alat seni untuk karya teman.\nBingkai foto untuk karya teman."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu tentang teman.\nGuru memperkenalkan tema 'Teman'.\nGuru bertanya: 'Siapa temanmu?' dan mengajak anak menjawab.\nGuru menjelaskan tentang pertemanan yang baik.\nGuru memutar lagu teman dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi konsep pertemanan.\nAnak mengamati foto teman-teman.\nAnak bermain peran tentang berteman.\nAnak mengidentifikasi sifat teman yang baik.\nAnak melakukan aktivitas fisik bersama teman.\nAnak mengeksplorasi cara bermain bersama.",
      diskusi: "Guru memfasilitasi diskusi tentang teman.\nAnak berdiskusi tentang teman yang baik.\nGuru mengajukan pertanyaan tentang teman.\nAnak berbagi pengalaman dengan teman.\nGuru dan anak mendiskusikan nilai pertemanan.\nDiskusi tentang cara berteman yang baik.",
      kolaborasi: "Anak bekerja dalam kelompok membuat poster teman.\nAnak berkolaborasi menciptakan karya seni bersama.\nAnak bermain peran kelompok tentang teman.\nAnak bekerja sama menyusun buku teman.\nAnak berkolaborasi dalam permainan sosial.\nAnak bersama membuat karya kolase teman.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang teman.\nGuru bertanya: 'Apa yang membuat teman baik?'\nAnak mengekspresikan perasaan tentang teman.\nAnak berbagi hal baru tentang pertemanan.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tentang teman.\nLangkah 3: Anak mewarnai gambar dengan indah.\nLangkah 4: Anak menambahkan detail teman.\nLangkah 5: Anak menulis atau menempelkan kata pertemanan.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang pertemanan.\nBuku kecil tentang teman.\nKarya seni tentang teman.\nKolase teman-teman.\nKartu-kartu pertemanan.\nBingkai foto teman."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang teman.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya teman.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan sifat teman yang baik.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan tentang teman.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Teman-temanku yang Baik": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang persahabatan.\nGuru memahami nilai-nilai persahabatan untuk anak.\nGuru mempelajari cara membina persahabatan sehat.\nGuru mengkaji kurikulum pengembangan sosial.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan buku cerita tentang persahabatan.\nMempersiapkan alat-alat seni untuk karya teman.\nMenyiapkan foto teman-teman di kelas.\nMenyiapkan poster tentang persahabatan.\nMempersiapkan lagu-lagu tentang persahabatan.\nMenyiapkan alat peraga untuk permainan sosial.",
      alatBahan: "Buku cerita tentang persahabatan minimal 10 buah.\nFoto teman-teman di kelas.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nPoster tentang persahabatan minimal 5 set.\nKamera untuk memfoto kegiatan.\nAudio player dan lagu persahabatan.\nAlat-alat seni untuk karya teman.\nBingkai foto untuk karya teman."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu tentang persahabatan.\nGuru memperkenalkan tema 'Teman-temanku yang Baik'.\nGuru bertanya: 'Siapa temanmu?' dan mengajak anak menjawab.\nGuru menjelaskan tentang persahabatan yang baik.\nGuru memutar lagu persahabatan dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi konsep persahabatan.\nAnak mengamati foto teman-teman.\nAnak bermain peran tentang bersahabat.\nAnak mengidentifikasi sifat teman yang baik.\nAnak melakukan aktivitas fisik bersama teman.\nAnak mengeksplorasi cara bermain bersama.",
      diskusi: "Guru memfasilitasi diskusi tentang persahabatan.\nAnak berdiskusi tentang teman yang baik.\nGuru mengajukan pertanyaan tentang teman.\nAnak berbagi pengalaman dengan teman.\nGuru dan anak mendiskusikan nilai persahabatan.\nDiskusi tentang cara berteman yang baik.",
      kolaborasi: "Anak bekerja dalam kelompok membuat poster persahabatan.\nAnak berkolaborasi menciptakan karya seni bersama.\nAnak bermain peran kelompok tentang teman.\nAnak bekerja sama menyusun buku teman.\nAnak berkolaborasi dalam permainan sosial.\nAnak bersama membuat karya kolase teman.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang teman.\nGuru bertanya: 'Apa yang membuat teman baik?'\nAnak mengekspresikan perasaan tentang teman.\nAnak berbagi hal baru tentang persahabatan.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tentang teman.\nLangkah 3: Anak mewarnai gambar dengan indah.\nLangkah 4: Anak menambahkan detail teman.\nLangkah 5: Anak menulis atau menempelkan kata persahabatan.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang persahabatan.\nBuku kecil tentang teman.\nKarya seni tentang teman.\nKolase teman-teman.\nKartu-kartu persahabatan.\nBingkai foto teman."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang teman.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya teman.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan sifat teman yang baik.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan tentang teman.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Tes Sederhana": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar pembelajaran.\nGuru memahami kebutuhan anak dalam belajar.\nGuru mempelajari metode pembelajaran yang efektif.\nGuru mengkaji kurikulum yang relevan.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan buku cerita pendidikan.\nMempersiapkan alat-alat seni untuk karya.\nMenyiapkan poster pembelajaran.\nMempersiapkan alat untuk aktivitas belajar.\nMenyiapkan lagu-lagu edukatif.\nMenyiapkan alat peraga untuk demonstrasi.",
      alatBahan: "Buku cerita pendidikan minimal 10 buah.\nPoster pembelajaran minimal 5 set.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nAlat untuk aktivitas belajar.\nAudio player dan lagu edukatif.\nAlat-alat seni untuk karya.\nStiker dan hiasan.\nAlat peraga untuk demonstrasi."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu edukatif.\nGuru memperkenalkan tema pembelajaran.\nGuru bertanya pertanyaan pemicu.\nGuru menjelaskan tentang pembelajaran.\nGuru memutar lagu dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi materi pembelajaran.\nAnak mengamati benda-benda belajar.\nAnak bermain peran tentang pembelajaran.\nAnak mengidentifikasi konsep-konsep baru.\nAnak melakukan aktivitas fisik belajar.\nAnak mengeksplorasi cara belajar.",
      diskusi: "Guru memfasilitasi diskusi belajar.\nAnak berdiskusi tentang materi belajar.\nGuru mengajukan pertanyaan pemicu.\nAnak berbagi pengalaman belajar.\nGuru dan anak mendiskusikan konsep.\nDiskusi tentang cara belajar.",
      kolaborasi: "Anak bekerja dalam kelompok belajar.\nAnak berkolaborasi menciptakan karya.\nAnak bermain peran kelompok belajar.\nAnak bekerja sama menyusun buku.\nAnak berkolaborasi dalam permainan belajar.\nAnak bersama membuat karya kolase.",
      refleksi: "Anak merefleksikan apa yang dipelajari.\nGuru bertanya: 'Apa yang kamu pelajari?'\nAnak mengekspresikan perasaan belajar.\nAnak berbagi hal baru yang dipelajari.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tentang pembelajaran.\nLangkah 3: Anak mewarnai gambar dengan indah.\nLangkah 4: Anak menambahkan detail pembelajaran.\nLangkah 5: Anak menulis atau menempelkan kata.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang pembelajaran.\nBuku kecil tentang belajar.\nKarya seni pembelajaran.\nKolase materi belajar.\nKartu-kartu pembelajaran.\nModel konsep dari kertas."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang karya.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan konsep yang dipelajari.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan belajar.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Tes Singkat": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar pembelajaran.\nGuru memahami kebutuhan anak dalam belajar.\nGuru mempelajari metode pembelajaran yang efektif.\nGuru mengkaji kurikulum yang relevan.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi.",
      penyiapanAlat: "Menyiapkan buku cerita pendidikan.\nMempersiapkan alat-alat seni untuk karya.\nMenyiapkan poster pembelajaran.\nMempersiapkan alat untuk aktivitas belajar.\nMenyiapkan lagu-lagu edukatif.\nMenyiapkan alat peraga.",
      alatBahan: "Buku cerita pendidikan minimal 10 buah.\nPoster pembelajaran minimal 5 set.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nAlat untuk aktivitas belajar.\nAudio player dan lagu edukatif.\nAlat-alat seni untuk karya.\nStiker dan hiasan.\nAlat peraga untuk demonstrasi."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu edukatif.\nGuru memperkenalkan tema pembelajaran.\nGuru bertanya pertanyaan pemicu.\nGuru menjelaskan tentang pembelajaran.\nGuru memutar lagu dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi materi pembelajaran.\nAnak mengamati benda-benda belajar.\nAnak bermain peran tentang pembelajaran.\nAnak mengidentifikasi konsep-konsep baru.\nAnak melakukan aktivitas fisik belajar.\nAnak mengeksplorasi cara belajar.",
      diskusi: "Guru memfasilitasi diskusi belajar.\nAnak berdiskusi tentang materi belajar.\nGuru mengajukan pertanyaan pemicu.\nAnak berbagi pengalaman belajar.\nGuru dan anak mendiskusikan konsep.\nDiskusi tentang cara belajar.",
      kolaborasi: "Anak bekerja dalam kelompok belajar.\nAnak berkolaborasi menciptakan karya.\nAnak bermain peran kelompok belajar.\nAnak bekerja sama menyusun buku.\nAnak berkolaborasi dalam permainan belajar.\nAnak bersama membuat karya kolase.",
      refleksi: "Anak merefleksikan apa yang dipelajari.\nGuru bertanya: 'Apa yang kamu pelajari?'\nAnak mengekspresikan perasaan belajar.\nAnak berbagi hal baru yang dipelajari.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tentang pembelajaran.\nLangkah 3: Anak mewarnai gambar dengan indah.\nLangkah 4: Anak menambahkan detail pembelajaran.\nLangkah 5: Anak menulis atau menempelkan kata.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang pembelajaran.\nBuku kecil tentang belajar.\nKarya seni pembelajaran.\nKolase materi belajar.\nKartu-kartu pembelajaran.\nModel konsep dari kertas."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang karya.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan konsep yang dipelajari.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan belajar.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "Tubuhku yang Sehat": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang kesehatan tubuh.\nGuru memahami pentingnya kesehatan untuk anak.\nGuru mempelajari cara menjaga kesehatan tubuh.\nGuru mengkaji kurikulum kesehatan untuk anak.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan buku cerita tentang kesehatan.\nMempersiapkan alat-alat seni untuk karya kesehatan.\nMenyiapkan poster tentang kesehatan tubuh.\nMempersiapkan alat untuk aktivitas kesehatan.\nMenyiapkan lagu-lagu tentang kesehatan.\nMenyiapkan alat peraga untuk demonstrasi.",
      alatBahan: "Buku cerita tentang kesehatan minimal 10 buah.\nPoster kesehatan tubuh minimal 5 set.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nAlat untuk aktivitas kesehatan.\nAudio player dan lagu kesehatan.\nAlat-alat seni untuk karya kesehatan.\nStiker dan hiasan bertema kesehatan.\nAlat peraga untuk demonstrasi."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu tentang kesehatan.\nGuru memperkenalkan tema 'Tubuhku yang Sehat'.\nGuru bertanya: 'Bagian tubuh mana yang penting?'\nGuru menjelaskan tentang kesehatan tubuh.\nGuru memutar lagu kesehatan dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi bagian-bagian tubuh.\nAnak mengamati poster kesehatan tubuh.\nAnak bermain peran tentang menjaga kesehatan.\nAnak mengidentifikasi bagian tubuh yang penting.\nAnak melakukan aktivitas fisik kesehatan.\nAnak mengeksplorasi cara menjaga kesehatan.",
      diskusi: "Guru memfasilitasi diskusi tentang kesehatan.\nAnak berdiskusi tentang cara menjaga kesehatan.\nGuru mengajukan pertanyaan tentang kesehatan.\nAnak berbagi pengalaman kesehatan.\nGuru dan anak mendiskusikan pentingnya kesehatan.\nDiskusi tentang pola hidup sehat.",
      kolaborasi: "Anak bekerja dalam kelompok membuat poster kesehatan.\nAnak berkolaborasi menciptakan karya kesehatan.\nAnak bermain peran kelompok tentang kesehatan.\nAnak bekerja sama menyusun buku kesehatan.\nAnak berkolaborasi dalam permainan kesehatan.\nAnak bersama membuat karya kolase kesehatan.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang kesehatan.\nGuru bertanya: 'Apa yang membuat tubuh sehat?'\nAnak mengekspresikan perasaan tentang kesehatan.\nAnak berbagi hal baru tentang kesehatan.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tubuh yang sehat.\nLangkah 3: Anak mewarnai gambar dengan indah.\nLangkah 4: Anak menambahkan detail kesehatan.\nLangkah 5: Anak menulis atau menempelkan kata kesehatan.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang kesehatan tubuh.\nBuku kecil tentang kesehatan.\nKarya seni tubuh sehat.\nKolase kegiatan kesehatan.\nKartu-kartu kesehatan.\nModel tubuh dari kertas."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang kesehatan.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya kesehatan.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan cara menjaga kesehatan.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan tentang kesehatan.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "rumah": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang rumah.\nGuru memahami berbagai jenis rumah.\nGuru mempelajari fungsi rumah untuk keluarga.\nGuru mengkaji kurikulum tentang hunian.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan buku cerita tentang rumah.\nMempersiapkan alat-alat seni untuk karya rumah.\nMenyiapkan poster dan gambar rumah.\nMempersiapkan alat untuk membuat model rumah.\nMenyiapkan lagu-lagu tentang rumah.\nMenyiapkan alat peraga untuk demonstrasi.",
      alatBahan: "Buku cerita tentang rumah minimal 10 buah.\nPoster dan gambar rumah minimal 5 set.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nKotak dan kardus untuk model rumah.\nAudio player dan lagu rumah.\nAlat-alat seni untuk karya rumah.\nStiker dan hiasan bertema rumah.\nLem dan gunting anak yang aman."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu tentang rumah.\nGuru memperkenalkan tema 'rumah'.\nGuru bertanya: 'Seperti apa rumahmu?'\nGuru menjelaskan tentang rumah.\nGuru memutar lagu rumah dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi berbagai jenis rumah.\nAnak mengamati poster dan gambar rumah.\nAnak bermain peran tentang rumah.\nAnak mengidentifikasi bagian-bagian rumah.\nAnak melakukan aktivitas fisik membuat rumah.\nAnak mengeksplorasi fungsi rumah.",
      diskusi: "Guru memfasilitasi diskusi tentang rumah.\nAnak berdiskusi tentang rumah mereka.\nGuru mengajukan pertanyaan tentang rumah.\nAnak berbagi pengalaman di rumah.\nGuru dan anak mendiskusikan fungsi rumah.\nDiskusi tentang merawat rumah.",
      kolaborasi: "Anak bekerja dalam kelompok membuat poster rumah.\nAnak berkolaborasi menciptakan karya seni rumah.\nAnak bermain peran kelompok tentang rumah.\nAnak bekerja sama menyusun buku rumah.\nAnak berkolaborasi dalam permainan rumah.\nAnak bersama membuat karya kolase rumah.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang rumah.\nGuru bertanya: 'Apa yang kamu sukai dari rumahmu?'\nAnak mengekspresikan perasaan tentang rumah.\nAnak berbagi hal baru tentang rumah.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tentang rumah.\nLangkah 3: Anak mewarnai gambar dengan indah.\nLangkah 4: Anak menambahkan detail rumah.\nLangkah 5: Anak menulis atau menempelkan nama ruang.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang rumah.\nBuku kecil tentang rumah.\nKarya seni rumah.\nKolase berbagai jenis rumah.\nKartu-kartu rumah.\nModel rumah dari kardus."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang rumah.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya rumah.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan bagian-bagian rumah.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan tentang rumah.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "sekolah": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang sekolah.\nGuru memahami fungsi sekolah untuk anak.\nGuru mempelajari cara menyesuaikan di sekolah.\nGuru mengkaji kurikulum adaptasi sekolah.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan buku cerita tentang sekolah.\nMempersiapkan alat-alat seni untuk karya sekolah.\nMenyiapkan poster dan gambar sekolah.\nMempersiapkan alat untuk eksplorasi sekolah.\nMenyiapkan lagu-lagu tentang sekolah.\nMenyiapkan alat peraga untuk demonstrasi.",
      alatBahan: "Buku cerita tentang sekolah minimal 10 buah.\nPoster dan gambar sekolah minimal 5 set.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nAlat untuk eksplorasi sekolah.\nAudio player dan lagu sekolah.\nAlat-alat seni untuk karya sekolah.\nStiker dan hiasan bertema sekolah.\nModel mini sekolah sederhana."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu tentang sekolah.\nGuru memperkenalkan tema 'sekolah'.\nGuru bertanya: 'Apa yang ada di sekolah?'\nGuru menjelaskan tentang sekolah.\nGuru memutar lagu sekolah dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi berbagai ruang di sekolah.\nAnak mengamati poster dan gambar sekolah.\nAnak bermain peran tentang sekolah.\nAnak mengidentifikasi peran di sekolah.\nAnak melakukan aktivitas fisik di sekolah.\nAnak mengeksplorasi aturan sekolah.",
      diskusi: "Guru memfasilitasi diskusi tentang sekolah.\nAnak berdiskusi tentang kegiatan di sekolah.\nGuru mengajukan pertanyaan tentang sekolah.\nAnak berbagi pengalaman di sekolah.\nGuru dan anak mendiskusikan aturan sekolah.\nDiskusi tentang suka di sekolah.",
      kolaborasi: "Anak bekerja dalam kelompok membuat poster sekolah.\nAnak berkolaborasi menciptakan karya seni sekolah.\nAnak bermain peran kelompok tentang sekolah.\nAnak bekerja sama menyusun buku sekolah.\nAnak berkolaborasi dalam permainan sekolah.\nAnak bersama membuat karya kolase sekolah.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang sekolah.\nGuru bertanya: 'Apa yang kamu suka dari sekolah?'\nAnak mengekspresikan perasaan tentang sekolah.\nAnak berbagi hal baru tentang sekolah.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tentang sekolah.\nLangkah 3: Anak mewarnai gambar dengan indah.\nLangkah 4: Anak menambahkan detail sekolah.\nLangkah 5: Anak menulis atau menempelkan nama ruang.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang sekolah.\nBuku kecil tentang sekolah.\nKarya seni sekolah.\nKolase berbagai ruang sekolah.\nKartu-kartu sekolah.\nModel sekolah dari kertas."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang sekolah.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya sekolah.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan ruang-ruang di sekolah.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan tentang sekolah.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "sekolahku": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang sekolah.\nGuru memahami fungsi sekolah untuk anak.\nGuru mempelajari cara menyesuaikan di sekolah.\nGuru mengkaji kurikulum adaptasi sekolah.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan buku cerita tentang sekolah.\nMempersiapkan alat-alat seni untuk karya sekolah.\nMenyiapkan poster dan gambar sekolah.\nMempersiapkan alat untuk eksplorasi sekolah.\nMenyiapkan lagu-lagu tentang sekolah.\nMenyiapkan alat peraga untuk demonstrasi.",
      alatBahan: "Buku cerita tentang sekolah minimal 10 buah.\nPoster dan gambar sekolah minimal 5 set.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nAlat untuk eksplorasi sekolah.\nAudio player dan lagu sekolah.\nAlat-alat seni untuk karya sekolah.\nStiker dan hiasan bertema sekolah.\nModel mini sekolah sederhana."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu tentang sekolah.\nGuru memperkenalkan tema 'sekolahku'.\nGuru bertanya: 'Apa yang ada di sekolahmu?'\nGuru menjelaskan tentang sekolah.\nGuru memutar lagu sekolah dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi berbagai ruang di sekolah.\nAnak mengamati poster dan gambar sekolah.\nAnak bermain peran tentang sekolah.\nAnak mengidentifikasi peran di sekolah.\nAnak melakukan aktivitas fisik di sekolah.\nAnak mengeksplorasi aturan sekolah.",
      diskusi: "Guru memfasilitasi diskusi tentang sekolah.\nAnak berdiskusi tentang kegiatan di sekolah.\nGuru mengajukan pertanyaan tentang sekolah.\nAnak berbagi pengalaman di sekolah.\nGuru dan anak mendiskusikan aturan sekolah.\nDiskusi tentang suka di sekolah.",
      kolaborasi: "Anak bekerja dalam kelompok membuat poster sekolah.\nAnak berkolaborasi menciptakan karya seni sekolah.\nAnak bermain peran kelompok tentang sekolah.\nAnak bekerja sama menyusun buku sekolah.\nAnak berkolaborasi dalam permainan sekolah.\nAnak bersama membuat karya kolase sekolah.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang sekolah.\nGuru bertanya: 'Apa yang kamu suka dari sekolahmu?'\nAnak mengekspresikan perasaan tentang sekolah.\nAnak berbagi hal baru tentang sekolah.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tentang sekolah.\nLangkah 3: Anak mewarnai gambar dengan indah.\nLangkah 4: Anak menambahkan detail sekolah.\nLangkah 5: Anak menulis atau menempelkan nama ruang.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang sekolah.\nBuku kecil tentang sekolah.\nKarya seni sekolah.\nKolase berbagai ruang sekolah.\nKartu-kartu sekolah.\nModel sekolah dari kertas."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang sekolah.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya sekolah.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan ruang-ruang di sekolah.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan tentang sekolah.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  },
  "teman": {
    persiapan: {
      pemahamanKonsep: "Guru mempelajari konsep dasar tentang pertemanan.\nGuru memahami nilai-nilai berteman untuk anak.\nGuru mempelajari cara membangun pertemanan sehat.\nGuru mengkaji kurikulum pengembangan sosial.\nGuru mempersiapkan konsep penilaian yang sesuai.\nGuru berdiskusi dengan tim untuk strategi pembelajaran.",
      penyiapanAlat: "Menyiapkan buku cerita tentang pertemanan.\nMempersiapkan alat-alat seni untuk karya teman.\nMenyiapkan foto teman-teman di kelas.\nMenyiapkan poster tentang pertemanan.\nMempersiapkan lagu-lagu tentang teman.\nMenyiapkan alat peraga untuk permainan sosial.",
      alatBahan: "Buku cerita tentang pertemanan minimal 10 buah.\nFoto teman-teman di kelas.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nPoster tentang pertemanan minimal 5 set.\nKamera untuk memfoto kegiatan.\nAudio player dan lagu pertemanan.\nAlat-alat seni untuk karya teman.\nBingkai foto untuk karya teman."
    },
    pelaksanaan: {
      orientasi: "Guru memulai dengan lagu tentang teman.\nGuru memperkenalkan tema 'teman'.\nGuru bertanya: 'Siapa temanmu?' dan mengajak anak menjawab.\nGuru menjelaskan tentang pertemanan yang baik.\nGuru memutar lagu teman dan mengajak bernyanyi.\nGuru menjelaskan tujuan pembelajaran.",
      eksplorasi: "Anak mengeksplorasi konsep pertemanan.\nAnak mengamati foto teman-teman.\nAnak bermain peran tentang berteman.\nAnak mengidentifikasi sifat teman yang baik.\nAnak melakukan aktivitas fisik bersama teman.\nAnak mengeksplorasi cara bermain bersama.",
      diskusi: "Guru memfasilitasi diskusi tentang teman.\nAnak berdiskusi tentang teman yang baik.\nGuru mengajukan pertanyaan tentang teman.\nAnak berbagi pengalaman dengan teman.\nGuru dan anak mendiskusikan nilai pertemanan.\nDiskusi tentang cara berteman yang baik.",
      kolaborasi: "Anak bekerja dalam kelompok membuat poster teman.\nAnak berkolaborasi menciptakan karya seni bersama.\nAnak bermain peran kelompok tentang teman.\nAnak bekerja sama menyusun buku teman.\nAnak berkolaborasi dalam permainan sosial.\nAnak bersama membuat karya kolase teman.",
      refleksi: "Anak merefleksikan apa yang dipelajari tentang teman.\nGuru bertanya: 'Apa yang membuat teman baik?'\nAnak mengekspresikan perasaan tentang teman.\nAnak berbagi hal baru tentang pertemanan.\nGuru dan anak membuat kesimpulan.\nAnak mengucapkan terima kasih kepada teman."
    },
    pembuatanKarya: {
      proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar tentang teman.\nLangkah 3: Anak mewarnai gambar dengan indah.\nLangkah 4: Anak menambahkan detail teman.\nLangkah 5: Anak menulis atau menempelkan kata pertemanan.\nLangkah 6: Anak menghias karya dengan hiasan.\nLangkah 7: Anak mempresentasikan karya.",
      hasil: "Poster tentang pertemanan.\nBuku kecil tentang teman.\nKarya seni tentang teman.\nKolase teman-teman.\nKartu-kartu pertemanan.\nBingkai foto teman."
    },
    presentasi: {
      persiapan: "Guru membantu anak mempersiapkan karya.\nAnak berlatih berbicara tentang teman.\nGuru memfasilitasi latihan kelompok.\nAnak menyiapkan kalimat presentasi.\nGuru memberikan tips presentasi.",
      pelaksanaan: "Setiap anak mempresentasikan karya teman.\nAnak menjelaskan tentang karya mereka.\nAnak menyebutkan sifat teman yang baik.\nAnak menjawab pertanyaan dari teman.\nGuru memberikan apresiasi.\nAnak memberikan tepuk tangan."
    },
    refleksiAkhir: {
      refleksiGuru: "Guru mengevaluasi pencapaian tujuan.\nGuru merefleksikan metode pembelajaran.\nGuru menilai partisipasi anak.\nGuru mengidentifikasi anak yang butuh dukungan.\nGuru mencatat perkembangan anak.\nGuru merencanakan tindak lanjut.",
      refleksiAnak: "Anak menyebutkan hal baru yang dipelajari.\nAnak mengungkapkan perasaan tentang teman.\nAnak menilai bagian yang disukai.\nAnak menentukan yang ingin dipelajari lagi.\nAnak mengucap syukur.\nAnak menuliskan pengalaman."
    }
  }
}

async function enhanceAllNarratives() {
  console.log('Enhancing all narratives in Kegiatan Pembelajaran...\n')

  const templates = await prisma.rPPTemplate.findMany({
    where: { isActive: true },
    orderBy: { tema: 'asc' }
  })

  console.log(`Found ${templates.length} templates to enhance\n`)

  for (const template of templates) {
    const narrativeData = completeNarratives[template.tema]

    if (!narrativeData) {
      console.log(`Skipping ${template.tema} - no narrative data found`)
      continue
    }

    console.log(`Updating: ${template.tema}`)

    try {
      // Get current data
      let currentKp: any = {}
      if (template.kegiatanPembelajaran) {
        currentKp = JSON.parse(template.kegiatanPembelajaran as string)
      }

      // Update each tahap with enhanced narratives
      const tahapList = ['persiapan', 'pelaksanaan', 'pembuatanKarya', 'presentasi', 'refleksiAkhir']

      for (const tahap of tahapList) {
        if (narrativeData[tahap]) {
          currentKp[tahap] = narrativeData[tahap]
        }
      }

      await prisma.rPPTemplate.update({
        where: { id: template.id },
        data: {
          kegiatanPembelajaran: JSON.stringify(currentKp),
          updatedAt: new Date()
        }
      })

      console.log(`✓ Enhanced: ${template.tema}`)
    } catch (error) {
      console.error(`✗ Error enhancing ${template.tema}:`, error)
    }
  }

  console.log('\nEnhancement complete!')
  await prisma.$disconnect()
}

enhanceAllNarratives().catch(console.error)
