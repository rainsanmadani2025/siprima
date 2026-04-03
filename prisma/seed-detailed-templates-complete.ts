import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 5 Pilar KBC:
// 1. Cinta Diri (Love of Self)
// 2. Cinta Sesama (Love of Others)
// 3. Cinta Alam (Love of Nature)
// 4. Cinta Ilmu (Love of Learning)
// 5. Cinta Tuhan (Love of God)

const templates = [
  // === PILAR 1: CINTA DIRI ===
  {
    tema: "Diriku yang Berharga",
    topikKBC: "Cinta Diri",
    profilLulusan: "Beriman, Bertakwa, Berkarakter, Kreatif, Kemandirian",
    tujuanKBC: "Anak dapat mengenali diri sendiri sebagai ciptaan Tuhan yang berharga dan unik, memahami kelebihan dan kekurangan yang dimiliki dengan rasa syukur, serta membangun rasa percaya diri yang sehat untuk berinteraksi dengan lingkungan sekitarnya. Melalui berbagai aktivitas pengenalan diri, anak diarahkan untuk menghargai kemampuan, minat, dan potensi yang dimiliki sebagai anugerah dari Tuhan yang harus dikembangkan dengan sungguh-sungguh. Anak juga belajar menerima diri secara utuh, mengembangkan rasa percaya diri yang positif, dan belajar menyayangi diri sendiri dengan cara menjaga kesehatan fisik, mental, dan emosional sebagai bentuk rasa cinta dan terima kasih kepada Tuhan.",
    tujuanProfilLulusan: {
      Kesehatan: "Anak mampu menjaga kesehatan fisik dengan cara makan makanan bergizi, beristirahat cukup, berolahraga secara teratur, dan menjaga kebersihan diri sebagai bentuk cinta dan penghargaan terhadap tubuh yang diberikan Tuhan. Anak juga mengenali bagian-bagian tubuhnya dan fungsinya, serta belajar cara merawatnya dengan baik agar tetap sehat dan kuat.",
      Kemandirian: "Anak mampu melakukan aktivitas kebersihan diri secara mandiri seperti mencuci tangan, menggosok gigi, memakai pakaian, dan mengatur keperluan pribadi lainnya tanpa banyak bantuan orang dewasa. Anak juga mampu mengambil keputusan sederhana sehari-hari dan bertanggung jawab atas pilihan yang dibuat.",
      BernalarKritis: "Anak mampu mengidentifikasi kelebihan dan kekurangan diri sendiri dengan jujur dan objektif, serta berpikir logis tentang cara meningkatkan kemampuan yang dimiliki dan mengatasi kekurangan yang ada. Anak juga mampu membandingkan diri dengan orang lain secara sehat tanpa merasa rendah diri atau merendahkan orang lain.",
      Kreatif: "Anak mampu mengekspresikan diri melalui berbagai media kreatif seperti menggambar, melukis, menari, bercerita, dan bermain peran untuk menunjukkan identitas dan kepribadiannya yang unik. Anak juga mampu menciptakan karya seni yang merepresentasikan perasaan, pikiran, dan pengalamannya tentang diri sendiri.",
      Berkarakter: "Anak membangun karakter jujur, tanggung jawab, dan percaya diri yang sehat dalam menghadapi berbagai situasi dan tantangan sehari-hari. Anak juga belajar menghargai diri sendiri dan orang lain, serta menunjukkan sikap empati dan pengertian terhadap perasaan orang lain.",
      Beriman: "Anak mengenal diri sebagai ciptaan Tuhan yang berharga dan dikasihi, serta bersyukur atas anugerah kehidupan dan semua yang dimiliki. Anak juga belajar bahwa Tuhan menciptakan setiap orang dengan keunikan dan tujuan masing-masing yang harus dihargai.",
      Bertakwa: "Anak berdoa dan berterima kasih kepada Tuhan atas diri sendiri, kemampuan yang dimiliki, serta berbagai nikmat yang diterima sehari-hari. Anak juga belajar menjalankan ibadah dengan ikhlas sebagai bentuk rasa cinta dan ketaatan kepada Tuhan."
    },
    tujuanPembelajaranMendalam: "KD1: Anak dapat menyebutkan nama lengkap, usia, alamat, dan informasi dasar tentang diri sendiri dengan lancar dan percaya diri.\nKD2: Anak dapat mengidentifikasi minimal 5 kelebihan dan 3 kekurangan diri sendiri serta menjelaskan cara mengembangkan kelebihan dan mengatasi kekurangan tersebut.\nKD3: Anak dapat menunjukkan 7-10 bagian tubuh dan menjelaskan fungsinya dengan benar.\nKD4: Anak dapat menjelaskan perbedaan fisik antara diri sendiri dan teman-teman dengan sikap saling menghargai.\nKD5: Anak dapat mengekspresikan perasaan dan emosi melalui berbagai media (kata-kata, gambar, gerakan tubuh) secara tepat.\nKD6: Anak dapat menentukan 5 keputusan sederhana sehari-hari dan menjelaskan alasan di balik keputusan tersebut.\nKD7: Anak dapat menyebutkan 3-5 aktivitas ibadah yang dilakukan sehari-hari dan menjelaskan maknanya.",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan konsep cinta diri melalui berbagai aktivitas yang menekankan pada pengenalan diri, penerimaan diri, dan pengembangan potensi diri. Anak belajar mengenal bagian-bagian tubuh melalui lagu, permainan, dan cerita yang menyenangkan. Anak juga diajak untuk berdiskusi tentang perasaan, emosi, dan cara mengelolanya dengan sehat. Melalui kegiatan seni dan kreatif, anak mengekspresikan identitas dan kepribadiannya yang unik. Nilai-nilai keagamaan diintegrasikan melalui cerita-cerita tentang penciptaan manusia, keunikan setiap individu, dan pentingnya bersyukur kepada Tuhan atas nikmat yang diberikan.",
    tujuanPembelajaran: "Melalui pembelajaran tema 'Diriku yang Berharga', anak diharapkan dapat mengenal dan menerima diri sendiri sebagai ciptaan Tuhan yang berharga dan unik, membangun rasa percaya diri yang sehat, serta mengembangkan potensi dan kemampuan yang dimiliki secara optimal. Anak juga belajar untuk mencintai dan menghargai diri sendiri dengan cara menjaga kesehatan, kebersihan, dan menjalankan ibadah dengan ikhlas sebagai bentuk rasa syukur kepada Tuhan.",
    kerangkaPembelajaran: {
      praktekPedagogik: "Pendekatan pembelajaran berbasis proyek dengan fokus pada pengenalan diri melalui berbagai aktivitas hands-on seperti membuat buku 'All About Me', menciptakan karya seni tentang diri sendiri, dan bermain peran.\nPendekatan pembelajaran berbasis permainan (play-based learning) melalui permainan simulasi, permainan role-play, dan permainan edukatif tentang tubuh dan emosi.\nPendekatan pembelajaran terpadu (integrated learning) yang menggabungkan berbagai aspek perkembangan dalam satu aktivitas pembelajaran.\nPendekatan pembelajaran berbasis cerita (storytelling) dengan cerita-cerita inspiratif tentang penciptaan manusia dan keunikan setiap individu.\nPendekatan pembelajaran reflektif dimana anak diajak merefleksikan pengalaman belajar dan perasaan mereka.",
      lingkunganPembelajaran: {
        fisik: "Ruang kelas yang nyaman, bersih, dan aman dengan pencahayaan dan ventilasi yang baik.\nArea sudut belajar yang terorganisir dengan baik: sudut baca, sudut seni, sudut permainan, dan sudut ibadah.\nDinding kelas yang didekorasi dengan karya-karya anak, poster tentang tubuh manusia, dan kata-kata motivasi.\nPeralatan dan bahan yang aman dan mudah dijangkau oleh anak.\nArea outdoor yang luas dan aman untuk aktivitas fisik dan eksplorasi.",
        sosial: "Guru menciptakan lingkungan sosial yang mendukung, menghargai, dan menerima setiap anak secara utuh.\nAnak diajak untuk saling mengenal dan menghargai perbedaan antar individu.\nGuru memfasilitasi interaksi sosial yang positif antar anak melalui kegiatan kelompok dan kolaborasi.\nTerbuka ruang untuk diskusi dan berbagi pengalaman antar anak dan guru.\nMembangun budaya saling menyapa, menyapa, dan menghargai kehadiran satu sama lain.",
        psikologis: "Lingkungan yang aman secara emosional, bebas dari tekanan, hukuman, dan kritik yang menyakitkan.\nGuru memberikan penguatan positif dan penghargaan untuk setiap usaha dan pencapaian anak.\nAnak diberi kebebasan untuk mengekspresikan perasaan dan emosi secara sehat.\nTerjalin hubungan yang hangat, saling percaya, dan saling menghargai antara guru dan anak.\nAnak merasa dihargai, diterima, dan dicintai apa adanya.",
        akademik: "Lingkungan yang merangsang rasa ingin tahu dan motivasi belajar anak.\nMateri pembelajaran disajikan dengan cara yang menarik, relevan, dan sesuai dengan usia anak.\nGuru memberikan tantangan yang sesuai dengan kemampuan anak untuk mendorong perkembangan optimal.\nTerjadi proses scaffolding yang tepat untuk membantu anak mencapai potensi maksimalnya.\nPenilaian dilakukan secara berkelanjutan dan holistik untuk memantau perkembangan anak."
      },
      kemitraanPembelajaran: "Kerjasama dengan orang tua untuk memperkuat pembelajaran di rumah melalui komunikasi teratur dan tugas rumah yang relevan.\nKolaborasi dengan tenaga kesehatan untuk memberikan edukasi tentang kesehatan dan gizi anak.\nKerjasama dengan tokoh agama untuk memperkuat nilai-nilai keagamaan dalam pembelajaran.\nKemitraan dengan komunitas setempat untuk memberikan pengalaman belajar yang otentik.\nKolaborasi dengan sekolah lain untuk berbagi praktik terbaik dalam pembelajaran.",
      pemanfaatanDigital: "Menggunakan video edukasi tentang tubuh manusia dan kesehatan.\nMemanfaatkan aplikasi edukatif untuk belajar tentang emosi dan perasaan.\nMenggunakan audio player untuk memutar lagu-lagu tentang diri sendiri dan cinta diri.\nMemutar slide show foto-foto kegiatan anak sebagai bahan refleksi.\nMenggunakan proyektor untuk menampilkan materi visual dan video pembelajaran."
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: "Guru mempelajari konsep dasar tentang perkembangan identitas diri pada anak usia dini.\nGuru memahami teori perkembangan emosional dan sosial anak usia dini.\nGuru mempelajari pendekatan pembelajaran yang efektif untuk tema cinta diri.\nGuru mengkaji kurikulum dan standar kompetensi yang relevan dengan tema pembelajaran.\nGuru mempersiapkan konsep penilaian yang sesuai untuk mengukur capaian pembelajaran anak.\nGuru berdiskusi dengan tim untuk memastikan pemahaman konsep yang sama.",
        penyiapanAlat: "Menyiapkan cermin besar untuk aktivitas mengenal bagian tubuh.\nMempersiapkan alat-alat seni: kertas, krayon, cat air, kuas, dan gunting anak.\nMenyiapkan kamera atau handphone untuk memfoto kegiatan anak.\nMenyiapkan alat musik sederhana dan audio player untuk memutar lagu.\nMenyiapkan poster dan flashcard tentang tubuh manusia dan emosi.\nMempersiapkan buku cerita tentang penciptaan manusia dan keunikan individu.",
        alatBahan: "Cermin besar ukuran A3 minimal 2 buah untuk setiap kelompok.\nKertas gambar berbagai ukuran minimal 50 lembar.\nKrayon non-toxic berwarna-warni minimal 24 buah.\nCat air dan kuas untuk setiap anak.\nGuntingan anak dengan ujung tumpul.\nLem kertas yang aman untuk anak.\nAlbum foto 'All About Me' untuk setiap anak.\nPuzzle tubuh manusia minimal 5 set.\nBoneka tangan untuk bercerita.\nPoster tubuh manusia dengan label bahasa Indonesia."
      },
      pelaksanaan: {
        orientasi: "Guru memulai dengan doa bersama dan salam pembuka.\nGuru menunjukkan cermin dan mengajak anak melihat wajah mereka sendiri.\nGuru bertanya: 'Siapa yang ada di dalam cermin ini?' dan menunggu respon anak.\nGuru menjelaskan bahwa setiap anak adalah ciptaan Tuhan yang unik dan berharga.\nGuru memutar lagu 'Aku Anak Indonesia' atau 'Diriku' dan mengajak anak bernyanyi bersama.\nGuru menjelaskan tujuan pembelajaran hari ini dengan bahasa yang sederhana dan menarik.",
        eksplorasi: "Anak diajak bermain 'Kenali Dirimu' di depan cermin: menyebutkan nama, usia, warna rambut, warna mata, dll.\nAnak bermain puzzle tubuh manusia untuk mengenal nama dan fungsi bagian tubuh.\nAnak mengamati perbedaan fisik antara teman-teman dan mendiskusikan keunikan masing-masing.\nAnak diajak mengidentifikasi kelebihan dan kekurangan diri melalui permainan 'Bintang Kecil'.\nAnak mengeksplorasi emosi melalui kartu emosi dan permainan 'Wajah Emosi'.\nAnak melakukan aktivitas fisik sederhana untuk mengenali kemampuan tubuh mereka.",
        diskusi: "Guru memfasilitasi diskusi kelompok tentang kelebihan masing-masing anak.\nAnak berdiskusi tentang perasaan dan cara mengungkapkan perasaan dengan sehat.\nGuru mengajukan pertanyaan pemicu: 'Apa yang membuatmu bangga dengan dirimu?'\nAnak berbagi pengalaman tentang saat mereka merasa bahagia, sedih, atau marah.\nGuru dan anak mendiskusikan cara menjaga kesehatan tubuh dan kebersihan diri.\nDiskusi tentang pentingnya berdoa dan bersyukur kepada Tuhan.",
        kolaborasi: "Anak bekerja dalam kelompok kecil untuk membuat poster 'Kami Berbeda, Kami Spesial'.\nAnak berkolaborasi menciptakan karya seni kolase tentang keberagaman teman-teman.\nAnak bermain peran kelompok tentang berbagai profesi dan peran dalam masyarakat.\nAnak bekerja sama untuk menyusun buku cerita 'Tentang Kelasku'.\nAnak berkolaborasi dalam permainan tebak gambar emosi dan ekspresi wajah.\nAnak bersama-sama membuat doa harian untuk bersyukur kepada Tuhan.",
        refleksi: "Anak diajak merefleksikan apa yang telah dipelajari hari ini.\nGuru bertanya: 'Apa yang paling kamu sukai dari kegiatan hari ini?'\nAnak mengekspresikan perasaan mereka setelah melakukan berbagai aktivitas.\nAnak berbagi satu hal baru yang mereka pelajari tentang diri sendiri.\nGuru dan anak bersama-sama membuat kesimpulan tentang pentingnya mencintai diri sendiri.\nAnak mengucapkan terima kasih kepada teman yang telah membantu mereka."
      },
      pembuatanKarya: {
        proses: "Langkah 1: Anak menyiapkan kertas gambar dan alat-alat seni.\nLangkah 2: Anak menggambar wajah mereka sendiri dengan melihat cermin.\nLangkah 3: Anak mewarnai gambar dengan warna sesuai karakteristik diri.\nLangkah 4: Anak menambahkan detail seperti mata, hidung, mulut, dan rambut.\nLangkah 5: Anak menulis nama lengkap mereka di bawah gambar.\nLangkah 6: Anak menulis 3 kelebihan diri di sekitar gambar.\nLangkah 7: Anak menghias gambar dengan stiker dan hiasan lainnya.",
        hasil: "Poster 'Diriku' dengan gambar wajah anak dan informasi tentang diri.\nBuku 'All About Me' yang berisi halaman-halaman tentang identitas anak.\nKolase tentang keberagaman dan keunikan teman-teman.\nKartu emosi yang dibuat sendiri oleh anak.\nPuzzle tubuh manusia yang disusun dan diberi label.\nDoa harian yang ditulis atau digambar oleh anak."
      },
      presentasi: {
        persiapan: "Guru membantu anak mempersiapkan karya yang akan dipresentasikan.\nAnak berlatih berbicara di depan cermin atau teman sebaya.\nGuru memfasilitasi sesi latihan presentasi dalam kelompok kecil.\nAnak menyiapkan kalimat pembuka dan penutup untuk presentasi.\nGuru memberikan tips dan trik untuk presentasi yang percaya diri.",
        pelaksanaan: "Setiap anak mempresentasikan karya 'Diriku' di depan kelas.\nAnak menjelaskan tentang gambar yang mereka buat dan maknanya.\nAnak menyebutkan kelebihan-kelebihan yang mereka miliki.\nAnak menjawab pertanyaan dari teman-teman dan guru dengan percaya diri.\nGuru memberikan apresiasi dan penguatan positif untuk setiap presentasi.\nAnak memberikan tepuk tangan untuk menghargai teman yang telah berani tampil."
      },
      refleksiAkhir: {
        refleksiGuru: "Guru mengevaluasi apakah tujuan pembelajaran tercapai atau belum.\nGuru merefleksikan efektivitas metode pembelajaran yang digunakan.\nGuru menilai partisipasi dan keterlibatan anak dalam setiap kegiatan.\nGuru mengidentifikasi anak yang membutuhkan dukungan tambahan.\nGuru mencatat kejadian penting dan perkembangan yang ditunjukkan anak.\nGuru merencanakan tindak lanjut untuk pembelajaran selanjutnya.",
        refleksiAnak: "Anak menyebutkan 1-2 hal baru yang mereka pelajari tentang diri sendiri.\nAnak mengungkapkan perasaan mereka setelah kegiatan pembelajaran.\nAnak menilai bagian mana dari kegiatan yang paling mereka sukai.\nAnak menentukan apa yang ingin mereka pelajari lebih lanjut.\nAnak mengucap syukur dan terima kasih atas kegiatan hari ini.\nAnak menuliskan atau menggambar pengalaman belajar mereka di jurnal."
      }
    }
  },

  // === PILAR 1: CINTA DIRI ===
  {
    tema: "Tubuhku yang Sehat",
    topikKBC: "Cinta Diri",
    profilLulusan: "Beriman, Bertakwa, Kesehatan, Kemandirian",
    tujuanKBC: "Anak dapat mengenal dan memahami pentingnya menjaga kesehatan tubuh sebagai bentuk cinta dan penghargaan terhadap diri sendiri sebagai ciptaan Tuhan. Anak belajar tentang bagian-bagian tubuh dan fungsinya, cara merawat tubuh dengan baik, serta pentingnya pola hidup sehat melalui makanan bergizi, olahraga, dan istirahat yang cukup. Melalui berbagai aktivitas praktis, anak diajak untuk menerapkan perilaku hidup sehat dalam kehidupan sehari-hari sebagai wujud rasa terima kasih kepada Tuhan atas anugerah kesehatan yang diberikan.",
    tujuanProfilLulusan: {
      Kesehatan: "Anak mampu menjelaskan pentingnya menjaga kesehatan tubuh dan menerapkan perilaku hidup sehat sehari-hari. Anak dapat membedakan makanan sehat dan tidak sehat, serta memilih makanan yang bergizi untuk tubuh. Anak juga terbiasa melakukan aktivitas fisik dan olahraga secara teratur, serta menjaga kebersihan diri dan lingkungan.",
      Kemandirian: "Anak mampu melakukan aktivitas kebersihan diri secara mandiri seperti mencuci tangan sebelum makan, menggosok gigi, memakai pakaian yang bersih, dan mandi teratur. Anak juga mampu memilih makanan sehat dan menjadwalkan waktu istirahat dengan bantuan minimal.",
      BernalarKritis: "Anak mampu membedakan perilaku yang sehat dan tidak sehat, serta menjelaskan dampaknya bagi tubuh. Anak dapat menganalisis mengapa tubuh membutuhkan makanan bergizi, air, istirahat, dan olahraga untuk tetap sehat. Anak juga mampu mengidentifikasi penyebab penyakit sederhana dan cara pencegahannya.",
      Kreatif: "Anak mampu mengekspresikan pengetahuan tentang kesehatan tubuh melalui karya seni seperti poster, lukisan, dan drama. Anak juga dapat menciptakan jadwal kegiatan sehat yang kreatif dan menarik untuk diikuti.",
      Berkarakter: "Anak membangun karakter disiplin dalam menjalankan pola hidup sehat, serta bertanggung jawab atas kesehatan diri sendiri. Anak juga menunjukkan kepedulian terhadap kesehatan orang lain dengan cara mengingatkan dan menjadi teladan.",
      Beriman: "Anak mengenal bahwa tubuh adalah amanah dari Tuhan yang harus dijaga dan dirawat dengan baik. Anak bersyukur atas kesehatan yang dimiliki dan berdoa untuk tetap diberi kesehatan.",
      Bertakwa: "Anak berdoa sebelum dan sesudah makan, sebelum dan sesudah beraktivitas, serta menjalankan ibadah dengan tubuh yang sehat dan bersih. Anak juga bersyukur kepada Tuhan setiap hari atas nikmat kesehatan."
    },
    tujuanPembelajaranMendalam: "KD1: Anak dapat menyebutkan minimal 10 bagian tubuh dan fungsinya dengan benar.\nKD2: Anak dapat menjelaskan pentingnya makanan bergizi dan menyebutkan 10 contoh makanan sehat.\nKD3: Anak dapat menjelaskan pentingnya minum air yang cukup dan menyebutkan manfaat air bagi tubuh.\nKD4: Anak dapat menjelaskan pentingnya olahraga dan menyebutkan 5 jenis olahraga yang menyenangkan.\nKD5: Anak dapat menjelaskan pentingnya istirahat dan tidur yang cukup bagi tubuh.\nKD6: Anak dapat mendemonstrasikan cara mencuci tangan dengan benar sesuai standar WHO.\nKD7: Anak dapat membuat jadwal aktivitas sehat yang mencakup makan, minum, olahraga, dan istirahat.",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan konsep cinta diri dan kesehatan tubuh. Anak belajar mengenal bagian-bagian tubuh melalui lagu, permainan, dan praktik langsung. Anak juga mempelajari tentang makanan sehat melalui aktivitas memasak sederhana, mencoba berbagai makanan, dan membuat poster makanan sehat. Pentingnya olahraga diajarkan melalui aktivitas fisik yang menyenangkan seperti senam, permainan lari, dan tarian. Nilai-nilai keagamaan diintegrasikan melalui doa sebelum makan, syukur atas nikmat kesehatan, dan memahami bahwa tubuh adalah amanah Tuhan.",
    tujuanPembelajaran: "Melalui pembelajaran tema 'Tubuhku yang Sehat', anak diharapkan dapat mengenal dan memahami pentingnya menjaga kesehatan tubuh sebagai bentuk cinta diri, menerapkan perilaku hidup sehat dalam kehidupan sehari-hari, serta bersyukur kepada Tuhan atas anugerah kesehatan yang diberikan.",
    kerangkaPembelajaran: {
      praktekPedagogik: "Pendekatan pembelajaran berbasis proyek dengan kegiatan memasak sehat, membuat poster kesehatan, dan kampanye hidup sehat.\nPendekatan pembelajaran berbasis pengalaman langsung (experiential learning) dengan mencicipi makanan sehat, berolahraga bersama, dan praktik kebersihan.\nPendekatan pembelajaran terpadu yang menggabungkan ilmu pengetahuan, seni, dan keagamaan.\nPendekatan pembelajaran kolaboratif dengan kegiatan kelompok dan kerjasama.\nPendekatan pembelajaran reflektif untuk merefleksikan kebiasaan sehat.",
      lingkunganPembelajaran: {
        fisik: "Area kelas yang luas untuk aktivitas gerak dan olahraga.\nDapur mini atau area untuk aktivitas memasak sederhana.\nPoster tentang makanan sehat, tubuh manusia, dan kebersihan di dinding kelas.\nArea cuci tangan dengan sabun dan air mengalir yang mudah diakses anak.\nArea outdoor yang aman untuk aktivitas fisik dan permainan.",
        sosial: "Guru menciptakan lingkungan yang mendukung kebiasaan hidup sehat dan saling mengingatkan.\nAnak diajak untuk menjadi teladan hidup sehat bagi teman-temannya.\nGuru memfasilitasi diskusi tentang kesehatan dan kebiasaan sehat.\nTerbuka ruang untuk berbagi resep makanan sehat dari rumah.\nMembangun budaya mencuci tangan dan menjaga kebersihan bersama.",
        psikologis: "Lingkungan yang memotivasi anak untuk hidup sehat tanpa paksaan.\nGuru memberikan penguatan positif untuk setiap perilaku sehat yang ditunjukkan anak.\nAnak merasa bangga ketika menerapkan kebiasaan sehat.\nTerjalin rasa percaya diri anak untuk membuat pilihan sehat.\nAnak merasa didukung dan tidak dihakimi atas kebiasaan makan mereka.",
        akademik: "Materi disajikan dengan cara yang praktis dan relevan dengan kehidupan anak.\nGuru menggunakan bahasa yang sederhana dan mudah dipahami.\nPenyampaian materi dengan pendekatan multi-sensory (visual, auditif, kinestetik).\nTerjadi proses inkuiri dan eksplorasi dalam pembelajaran.\nPenilaian berbasis observasi praktik dan perilaku sehari-hari."
      },
      kemitraanPembelajaran: "Kerjasama dengan orang tua untuk memperkuat kebiasaan sehat di rumah.\nKolaborasi dengan dokter atau perawat untuk edukasi kesehatan.\nKemitraan dengan ahli gizi untuk konsultasi makanan sehat.\nKerjasama dengan puskesmas untuk kegiatan cek kesehatan rutin.\nKolaborasi dengan petugas kebersihan untuk edukasi kebersihan lingkungan.",
      pemanfaatanDigital: "Video edukasi tentang tubuh manusia dan sistem pencernaan.\nAplikasi edukatif tentang makanan sehat dan gizi.\nAudio untuk lagu-lagu tentang kesehatan dan kebersihan.\nSlide show tentang cara mencuci tangan yang benar.\nVideo senam anak yang bisa diikuti bersama."
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: "Guru mempelajari konsep dasar tentang kesehatan tubuh dan gizi anak.\nGuru memahami panduan gizi seimbang untuk anak usia dini.\nGuru mempelajari standar kebersihan dan kesehatan di lingkungan PAUD.\nGuru mengkaji materi tentang penyakit umum pada anak dan pencegahannya.\nGuru mempersiapkan konsep penilaian untuk mengukur kebiasaan sehat anak.",
        penyiapanAlat: "Menyiapkan poster tubuh manusia dan organ dalam.\nMenyiapkan alat-alat kebersihan: sabun, handuk, sikat gigi, pasta gigi.\nMenyiapkan berbagai jenis makanan sehat untuk dicicipi anak.\nMenyiapkan alat memasak sederhana dan bahan makanan.\nMenyiapkan video dan lagu tentang kesehatan tubuh.\nMenyiapkan alat olahraga sederhana: bola, tali, dan matras.",
        alatBahan: "Poster tubuh manusia dengan label bagian-bagian tubuh.\nMakanan sehat: buah-buahan, sayuran, susu, roti gandum.\nAlat makan dan piring untuk setiap anak.\nSabun cuci tangan dan handuk bersih.\nSikat gigi dan pasta gigi untuk demonstrasi.\nBola, tali skipping, dan matras olahraga.\nVideo edukasi tentang kesehatan tubuh.\nLagu-lagu tentang kesehatan dan kebersihan.\nKertas dan krayon untuk membuat poster.\nAir minum yang cukup untuk setiap anak."
      },
      pelaksanaan: {
        orientasi: "Guru memulai dengan doa bersama dan salam pembuka.\nGuru menunjukkan poster tubuh manusia dan bertanya tentang bagian-bagian tubuh.\nGuru menjelaskan bahwa tubuh adalah anugerah Tuhan yang harus dijaga.\nGuru memutar lagu 'Tubuhku' dan mengajak anak bernyanyi bersama.\nGuru bertanya: 'Apa yang kita lakukan untuk menjaga tubuh tetap sehat?'\nGuru menjelaskan tujuan pembelajaran hari ini.",
        eksplorasi: "Anak mengamati poster tubuh manusia dan menyebutkan nama bagian-bagian tubuh.\nAnak mencicipi berbagai makanan sehat dan mendiskusikan rasanya.\nAnak melakukan praktik mencuci tangan dengan langkah-langkah yang benar.\nAnak melakukan senam pagi bersama dengan gerakan yang menyenangkan.\nAnak mengamati perbedaan makanan sehat dan tidak sehat.\nAnak mencoba berbagai aktivitas fisik: lari, lompat, dan menari.",
        diskusi: "Diskusi kelompok tentang makanan favorit yang sehat.\nAnak berbagi pengalaman tentang kebiasaan sehat di rumah.\nGuru mengajukan pertanyaan: 'Mengapa kita perlu makan makanan sehat?'\nDiskusi tentang dampak kurang tidur dan kelebihan tidur bagi tubuh.\nAnak mendiskusikan cara menjaga kebersihan diri dan lingkungan.\nDiskusi tentang pentingnya berdoa sebelum makan.",
        kolaborasi: "Anak bekerja dalam kelompok membuat poster 'Makanan Sehat'.\nAnak berkolaborasi menyiapkan salad buah sederhana bersama.\nAnak bermain peran sebagai dokter kecil dan pasien.\nAnak bersama-sama membuat jadwal aktivitas sehat untuk kelas.\nAnak berkolaborasi dalam permainan 'Penjual Makanan Sehat'.\nAnak bersama membuat doa sebelum makan.",
        refleksi: "Anak merefleksikan apa yang telah mereka pelajari tentang kesehatan tubuh.\nGuru bertanya: 'Perubahan apa yang akan kamu lakukan untuk hidup lebih sehat?'\nAnak mengekspresikan perasaan setelah mencoba makanan sehat.\nAnak berbagi satu kebiasaan sehat baru yang akan mereka lakukan.\nAnak mengucap syukur untuk kesehatan yang mereka miliki."
      },
      pembuatanKarya: {
        proses: "Langkah 1: Anak menyiapkan kertas dan alat-alat seni.\nLangkah 2: Anak menggambar berbagai jenis makanan sehat.\nLangkah 3: Anak mewarnai gambar makanan dengan warna yang sesuai.\nLangkah 4: Anak menulis nama makanan di bawah gambar.\nLangkah 5: Anak menambahkan dekorasi dan hiasan pada poster.\nLangkah 6: Anak membuat slogan atau kalimat motivasi tentang kesehatan.\nLangkah 7: Anak mempresentasikan poster kepada teman-teman.",
        hasil: "Poster 'Makanan Sehat' dengan gambar dan informasi.\nBuku resep makanan sehat sederhana buatan anak.\nJadwal aktivitas sehat harian.\nKolase tentang kegiatan sehat.\nLagu tentang kesehatan yang diciptakan anak.\nDoa sebelum makan yang ditulis anak."
      },
      presentasi: {
        persiapan: "Anak berlatih mempresentasikan poster makanan sehat.\nGuru membantu anak mempersiapkan kalimat presentasi.\nAnak berlatih berbicara dengan percaya diri di depan teman.\nGuru memberikan tips untuk presentasi yang menarik.",
        pelaksanaan: "Setiap anak mempresentasikan poster makanan sehat.\nAnak menjelaskan manfaat setiap makanan yang mereka gambar.\nAnak menjawab pertanyaan dari teman-teman.\nGuru memberikan apresiasi dan penguatan positif.\nAnak memberikan tepuk tangan untuk menghargai teman."
      },
      refleksiAkhir: {
        refleksiGuru: "Guru mengevaluasi pemahaman anak tentang kesehatan tubuh.\nGuru merefleksikan keefektifan kegiatan pembelajaran.\nGuru menilai partisipasi dan keterlibatan anak.\nGuru mengidentifikasi anak yang membutuhkan dukungan tambahan.\nGuru merencanakan tindak lanjut pembelajaran.",
        refleksiAnak: "Anak menyebutkan 1-2 hal baru tentang kesehatan yang dipelajari.\nAnak mengungkapkan perasaan setelah kegiatan.\nAnak menentukan kebiasaan sehat yang akan dilakukan.\nAnak mengucap syukur dan terima kasih."
      }
    }
  },

  // === PILAR 2: CINTA SESAMA ===
  {
    tema: "Keluargaku yang Sayang",
    topikKBC: "Cinta Sesama",
    profilLulusan: "Beriman, Bertakwa, Berkarakter, Kreatif",
    tujuanKBC: "Anak dapat memahami dan menghargai keluarga sebagai lingkungan pertama dan utama dalam kehidupan, serta membangun hubungan yang penuh kasih sayang, saling menghormati, dan saling mendukung antar anggota keluarga. Anak belajar tentang peran dan tanggung jawab setiap anggota keluarga, pentingnya komunikasi yang baik, serta cara mengekspresikan kasih sayang kepada keluarga. Melalui berbagai aktivitas, anak diajak untuk bersyukur atas keluarga yang dimiliki dan belajar menjadi anggota keluarga yang baik.",
    tujuanProfilLulusan: {
      Kesehatan: "Anak memahami pentingnya menjaga kesehatan agar dapat berbakti kepada keluarga. Anak belajar membantu orang tua dalam urusan kesehatan keluarga.",
      Kemandirian: "Anak mampu membantu pekerjaan rumah tangga sederhana seperti merapikan tempat tidur, membersihkan mainan, dan membantu adik.",
      BernalarKritis: "Anak mampu memahami alasan di balik aturan keluarga dan manfaatnya. Anak dapat menganalisis peran dan tanggung jawab setiap anggota keluarga.",
      Kreatif: "Anak mampu mengekspresikan cinta kepada keluarga melalui karya seni, surat, dan hadiah buatan sendiri.",
      Berkarakter: "Anak membangun karakter sayang, hormat, dan peduli terhadap keluarga. Anak belajar bertanggung jawab dan jujur dalam keluarga.",
      Beriman: "Anak mengerti bahwa keluarga adalah anugerah dari Tuhan. Anak bersyukur atas keluarga yang dimiliki.",
      Bertakwa: "Anak berdoa untuk keluarga dan belajar menjalankan ibadah bersama keluarga."
    },
    tujuanPembelajaranMendalam: "KD1: Anak dapat menyebutkan nama lengkap dan peran setiap anggota keluarga inti.\nKD2: Anak dapat menjelaskan 3-5 cara mengekspresikan kasih sayang kepada keluarga.\nKD3: Anak dapat menceritakan 2-3 kegiatan yang sering dilakukan bersama keluarga.\nKD4: Anak dapat menjelaskan tanggung jawab sebagai anak di rumah.\nKD5: Anak dapat membuat kartu ucapan atau surat untuk anggota keluarga.\nKD6: Anak dapat mendemonstrasikan cara mengucapkan terima kasih dan meminta maaf.\nKD7: Anak dapat menceritakan nilai-nilai keagamaan yang diajarkan di keluarga.",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan konsep cinta keluarga melalui cerita, permainan, dan aktivitas kreatif. Anak belajar tentang struktur keluarga, peran anggota keluarga, dan cara membangun hubungan yang harmonis. Nilai-nilai keagamaan diintegrasikan melalui cerita tentang keluarga teladan, doa untuk keluarga, dan pentingnya beribadah bersama keluarga.",
    tujuanPembelajaran: "Melalui pembelajaran tema 'Keluargaku yang Sayang', anak diharapkan dapat memahami dan menghargai keluarga, membangun hubungan yang penuh kasih sayang, serta bersyukur kepada Tuhan atas keluarga yang diberikan.",
    kerangkaPembelajaran: {
      praktekPedagogik: "Pendekatan pembelajaran berbasis cerita tentang keluarga.\nPendekatan pembelajaran berbasis proyek membuat buku keluarga.\nPendekatan pembelajaran berbasis permainan peran keluarga.\nPendekatan pembelajaran kolaboratif dalam kelompok.\nPendekatan pembelajaran reflektif tentang keluarga.",
      lingkunganPembelajaran: {
        fisik: "Area kelas yang hangat dan nyaman.\nSudut baca dengan buku cerita keluarga.\nArea seni untuk membuat karya keluarga.\nPoster tentang keluarga di dinding kelas.",
        sosial: "Lingkungan yang saling menghargai latar belakang keluarga.\nGuru memfasilitasi berbagi cerita keluarga.\nAnak saling mendengarkan cerita tentang keluarga teman.",
        psikologis: "Lingkungan yang aman untuk berbagi tentang keluarga.\nGuru memberikan dukungan emosional.\nAnak merasa dihargai dan diterima.",
        akademik: "Materi disajikan dengan cara yang relevan.\nGuru menggunakan contoh konkret tentang keluarga."
      },
      kemitraanPembelajaran: "Kerjasama dengan orang tua untuk kegiatan keluarga.\nKolaborasi dengan tokoh masyarakat tentang nilai keluarga.",
      pemanfaatanDigital: "Video cerita tentang keluarga.\nAudio lagu keluarga.\nSlide show foto keluarga."
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: "Guru mempelajari konsep keluarga dalam budaya lokal.\nGuru memahami teori perkembangan sosial emosional.",
        penyiapanAlat: "Menyiapkan buku cerita keluarga.\nMenyiapkan alat-alat seni.",
        alatBahan: "Buku cerita keluarga, kertas, krayon, foto keluarga."
      },
      pelaksanaan: {
        orientasi: "Guru memulai dengan doa dan salam.\nGuru bertanya tentang keluarga anak.\nGuru menjelaskan tujuan pembelajaran.",
        eksplorasi: "Anak menceritakan tentang keluarganya.\nAnak menunjukkan foto keluarga.\nAnak menggambar keluarga.",
        diskusi: "Diskusi tentang peran anggota keluarga.\nAnak berbagi kegiatan bersama keluarga.",
        kolaborasi: "Anak membuat proyek keluarga bersama.",
        refleksi: "Anak merefleksikan cinta untuk keluarga."
      },
      pembuatanKarya: {
        proses: "Langkah 1-7 untuk membuat karya keluarga.",
        hasil: "Buku keluarga, poster keluarga, kartu ucapan."
      },
      presentasi: {
        persiapan: "Anak berlatih presentasi.",
        pelaksanaan: "Anak mempresentasikan karya keluarga."
      },
      refleksiAkhir: {
        refleksiGuru: "Guru merefleksikan pembelajaran.",
        refleksiAnak: "Anak merefleksikan pembelajaran."
      }
    }
  },

  // === PILAR 2: CINTA SESAMA ===
  {
    tema: "Teman-temanku yang Baik",
    topikKBC: "Cinta Sesama",
    profilLulusan: "Beriman, Berkarakter, Kreatif, Kemandirian",
    tujuanKBC: "Anak dapat membangun persahabatan yang sehat, saling menghormati, dan saling mendukung dengan teman-teman sebayanya. Anak belajar tentang nilai-nilai persahabatan seperti kejujuran, saling membantu, berbagi, dan menghargai perbedaan. Melalui berbagai aktivitas kolaboratif, anak diajak untuk mengembangkan kemampuan sosial, empati, dan komunikasi yang baik dalam berinteraksi dengan teman-teman.",
    tujuanProfilLulusan: {
      Kesehatan: "Anak memahami pentingnya kesehatan sosial dalam persahabatan.",
      Kemandirian: "Anak mampu berinteraksi mandiri dengan teman-teman.",
      BernalarKritis: "Anak mampu membedakan perilaku teman yang baik dan tidak baik.",
      Kreatif: "Anak mampu menciptakan permainan yang adil dan menyenangkan.",
      Berkarakter: "Anak membangun karakter jujur, setia, dan peduli dalam persahabatan.",
      Beriman: "Anak mengerti bahwa teman adalah nikmat dari Tuhan.",
      Bertakwa: "Anak berdoa untuk teman-teman."
    },
    tujuanPembelajaranMendalam: "KD1: Anak dapat menyebutkan nama 5-10 teman sekelas.\nKD2: Anak dapat menjelaskan 3-5 perilaku teman yang baik.\nKD3: Anak dapat mendemonstrasikan cara bermain adil dengan teman.\nKD4: Anak dapat menjelaskan cara menyelesaikan konflik dengan teman.\nKD5: Anak dapat membuat karya bersama teman.\nKD6: Anak dapat menyatakan terima kasih dan maaf kepada teman.\nKD7: Anak dapat menceritakan pengalaman bermain bersama teman.",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan konsep persahabatan melalui permainan kolaboratif, diskusi, dan aktivitas bersama.",
    tujuanPembelajaran: "Anak dapat membangun persahabatan yang sehat dan saling menghargai.",
    kerangkaPembelajaran: {
      praktekPedagogik: "Pendekatan pembelajaran kolaboratif.\nPendekatan pembelajaran berbasis permainan.\nPendekatan pembelajaran berbasis proyek kelompok.",
      lingkunganPembelajaran: {
        fisik: "Area bermain kelompok yang luas.\nSudut kolaborasi.",
        sosial: "Lingkungan yang mendukung persahabatan.\nGuru memfasilitasi interaksi positif.",
        psikologis: "Lingkungan yang aman secara emosional.\nGuru mendukung perkembangan sosial.",
        akademik: "Materi disajikan dengan pendekatan sosial."
      },
      kemitraanPembelajaran: "Kerjasama dengan orang tua.",
      pemanfaatanDigital: "Video tentang persahabatan.\nLagu bertema persahabatan."
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: "Guru mempelajari konsep persahabatan anak.",
        penyiapanAlat: "Menyiapkan permainan kelompok.",
        alatBahan: "Alat permainan kelompok."
      },
      pelaksanaan: {
        orientasi: "Guru memulai dengan doa dan perkenalan.",
        eksplorasi: "Anak bermain dan berinteraksi dengan teman.",
        diskusi: "Diskusi tentang persahabatan.",
        kolaborasi: "Anak bekerja dalam kelompok.",
        refleksi: "Anak merefleksikan pengalaman berteman."
      },
      pembuatanKarya: {
        proses: "Langkah-langkah membuat karya kelompok.",
        hasil: "Karya kolaboratif teman-teman."
      },
      presentasi: {
        persiapan: "Anak berlatih presentasi kelompok.",
        pelaksanaan: "Anak mempresentasikan karya kelompok."
      },
      refleksiAkhir: {
        refleksiGuru: "Guru mengevaluasi interaksi anak.",
        refleksiAnak: "Anak merefleksikan persahabatan."
      }
    }
  },

  // === PILAR 3: CINTA ALAM ===
  {
    tema: "Alam Semesta yang Indah",
    topikKBC: "Cinta Alam",
    profilLulusan: "Beriman, Bertakwa, Berkarakter, BernalarKritis",
    tujuanKBC: "Anak dapat mengenal, menghargai, dan menyayangi keindahan alam semesta sebagai ciptaan Tuhan yang luar biasa. Anak belajar tentang berbagai fenomena alam seperti matahari, bulan, bintang, awan, hujan, dan angin. Melalui observasi langsung dan eksplorasi, anak diajak untuk mengembangkan rasa ingin tahu, apresiasi terhadap keindahan alam, serta kesadaran untuk menjaga dan melestarikan lingkungan.",
    tujuanProfilLulusan: {
      Kesehatan: "Anak memahami manfaat alam bagi kesehatan seperti udara bersih dan sinar matahari.",
      Kemandirian: "Anak mampu menjelajahi alam dengan aman dan mandiri.",
      BernalarKritis: "Anak mampu bertanya dan mencari jawaban tentang fenomena alam.",
      Kreatif: "Anak mampu mengekspresikan keindahan alam melalui seni.",
      Berkarakter: "Anak membangun karakter peduli dan bertanggung jawab terhadap alam.",
      Beriman: "Anak mengenal alam sebagai bukti kebesaran Tuhan.",
      Bertakwa: "Anak bersyukur kepada Tuhan atas keindahan alam."
    },
    tujuanPembelajaranMendalam: "KD1: Anak dapat menyebutkan 7-10 fenomena alam yang dikenal.\nKD2: Anak dapat menjelaskan fungsi matahari bagi bumi.\nKD3: Anak dapat menceritakan perbedaan siang dan malam.\nKD4: Anak dapat menjelaskan terjadinya hujan dan angin.\nKD5: Anak dapat menggambar langit siang dan malam.\nKD6: Anak dapat menjelaskan pentingnya menjaga kebersihan lingkungan.\nKD7: Anak dapat menyebutkan 3-5 cara menjaga alam.",
    materiIntegrasiKBC: "Materi pembelajaran diintegrasikan dengan observasi langsung alam, eksperimen sederhana, dan aktivitas seni.",
    tujuanPembelajaran: "Anak dapat mengenal dan menghargai keindahan alam semesta.",
    kerangkaPembelajaran: {
      praktekPedagogik: "Pendekatan pembelajaran berbasis inkuiri.\nPendekatan pembelajaran eksperensial.\nPendekatan pembelajaran terpadu.",
      lingkunganPembelajaran: {
        fisik: "Area outdoor untuk observasi alam.\nSudut sains sederhana.",
        sosial: "Lingkungan yang mendukung eksplorasi alam.",
        psikologis: "Lingkungan yang merangsang rasa ingin tahu.",
        akademik: "Materi sains disajikan dengan praktik."
      },
      kemitraanPembelajaran: "Kerjasama dengan instansi lingkungan.",
      pemanfaatanDigital: "Video tentang fenomena alam.\nAplikasi sains anak."
    },
    kegiatanPembelajaran: {
      persiapan: {
        pemahamanKonsep: "Guru mempelajari konsep dasar sains alam.",
        penyiapanAlat: "Menyiapkan alat observasi dan eksperimen.",
        alatBahan: "Teropong, kacamata hitam, alat eksperimen."
      },
      pelaksanaan: {
        orientasi: "Guru memperkenalkan tema alam.",
        eksplorasi: "Anak mengamati alam langsung.",
        diskusi: "Diskusi tentang fenomena alam.",
        kolaborasi: "Anak melakukan eksperimen kelompok.",
        refleksi: "Anak merefleksikan keindahan alam."
      },
      pembuatanKarya: {
        proses: "Langkah-langkah membuat karya alam.",
        hasil: "Karya seni tentang alam."
      },
      presentasi: {
        persiapan: "Anak berlatih presentasi.",
        pelaksanaan: "Anak mempresentasikan karya."
      },
      refleksiAkhir: {
        refleksiGuru: "Guru mengevaluasi pemahaman anak.",
        refleksiAnak: "Anak merefleksikan pembelajaran."
      }
    }
  }
]

async function main() {
  console.log('Seeding Detailed RPP Templates (First 5 of 15)...')
  
  for (const template of templates) {
    await prisma.rPPTemplate.upsert({
      where: { tema: template.tema },
      update: template,
      create: template
    })
  }
  
  console.log('✓ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
