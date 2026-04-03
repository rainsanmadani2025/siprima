import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding RPP Templates with comprehensive content...')

  // Template 1: Lingkungan Sekitarku
  await prisma.rPPTemplate.upsert({
    where: { tema: 'Lingkungan Sekitarku' },
    update: {},
    create: {
      tema: 'Lingkungan Sekitarku',
      topikKBC: 'Cinta Diri dan Sesama',
      profilLulusan: 'Kesehatan, Kemandirian, Bernalar Kritis, Kreatif, Berkarakter, Beriman, Bertakwa',
      tujuanKBC: 'Mengenal mesjid sebagai tempat ibadah umat Islam dan memahami cara bersikap yang tepat di dalamnya. Anak diajak untuk mencintai tempat ibadah, memahami fungsi mesjid dalam kehidupan muslim, dan membiasakan diri dengan adab-adab yang harus dijaga saat berada di dalam mesjid. Melalui kegiatan ini, anak diharapkan tumbuh dengan rasa cinta dan hormat terhadap rumah Allah.',
      tujuanProfilLulusan: JSON.stringify({
        Kesehatan: 'Mengenal dan memahami lingkungan yang sehat di sekitar mesjid, termasuk menjaga kebersihan tempat ibadah, memahami pentingnya berwudhu sebelum beribadah, dan menjaga kesehatan fisik saat beraktivitas di lingkungan mesjid.',
        Kemandirian: 'Dapat merawat diri sendiri saat berada di mesjid, mulai dari cara memakai pakaian yang sopan, cara berwudhu dengan benar, mengatur benda-benda pribadi, serta mempraktikkan tata cara salat secara mandiri dengan bimbingan guru.',
        BernalarKritis: 'Memahami alasan mengapa harus berperilaku baik di mesjid, menganalisis fungsi setiap bagian mesjid, mempertanyakan dan mencari jawaban tentang mengapa mesjid dianggap sakral, serta memahami makna gerakan-gerakan salat yang dilakukan.',
        Kreatif: 'Menciptakan aktivitas bermain yang sesuai dengan lingkungan mesjid, membuat karya seni bertema mesjid, bermain peran sebagai orang yang sedang beribadah di mesjid, serta menemukan cara-cara baru untuk menjaga kebersihan dan ketertiban mesjid.',
        Berkarakter: 'Menumbuhkan sikap hormat dan sopan di tempat ibadah, belajar untuk diam dan mendengarkan saat ceramah, menghargai orang lain yang sedang beribadah, serta mempraktikkan nilai-nilai kasih sayang dan kepedulian terhadap sesama jamaah mesjid.',
        Beriman: 'Mengenal mesjid sebagai tempat untuk mendekatkan diri kepada Allah, memahami bahwa mesjid adalah rumah Allah SWT, merasakan kedamaian saat berada di mesjid, dan mulai memahami konsep ibadah sebagai bentuk ketaatan kepada Tuhan.',
        Bertakwa: 'Mengenal dasar-dasar ibadah yang dilakukan di mesjid seperti salat, dzikir, dan mendengarkan ceramah, mempraktikkan gerakan salat dengan benar, memahami bacaan-bacaan dasar dalam salat, serta membiasakan diri datang ke mesjid untuk beribadah.'
      }),
      tujuanPembelajaranMendalam: `KD1: Mengenal mesjid dan fungsi sebagai tempat ibadah umat Islam untuk mendekatkan diri kepada Allah SWT
KD2: Memahami cara bersikap sopan dan hormat di mesjid sesuai dengan adab Islam
KD3: Mengenal aktivitas ibadah yang dilakukan di mesjid seperti salat berjamaah, dzikir, dan mendengarkan ceramah
KD4: Mempraktikkan gerakan salat dasar dengan benar dan penuh penghayatan
KD5: Mengenal bagian-bagian penting mesjid seperti mihrab, mimbar, dan saf salat
KD6: Memahami makna dan fungsi wudhu sebagai syarat salat
KD7: Menumbuhkan rasa cinta dan bangga terhadap mesjid sebagai rumah Allah`,
      materiIntegrasiKBC: 'Pengenalan mesjid sebagai rumah Allah dan tempat ibadah umat Islam, fungsi mesjid dalam kehidupan masyarakat muslim, adab dan tata tertib di dalam mesjid, aktivitas ibadah yang dilakukan di mesjid (salat berjamaah, dzikir, ceramah), makna dan fungsi wudhu, bagian-bagian mesjid (mihrab, mimbar, saf, menara, kubah), bacaan-bacaan dasar dalam salat, gerakan-gerakan salat beserta maknanya, konsep salat berjamaah dan keutamaannya, sejarah singkat pembangunan mesjid pertama di Islam, dan makna kebersihan sebagian dari iman.',
      tujuanPembelajaran: 'Setelah mengikuti kegiatan pembelajaran ini, anak diharapkan dapat: (1) Mengenal mesjid sebagai tempat ibadah umat Islam dan rumah Allah SWT, (2) Memahami fungsi mesjid dalam kehidupan seorang muslim, (3) Menjelaskan cara bersikap yang sopan dan hormat saat berada di dalam mesjid, (4) Mempraktikkan adab-adab yang harus dijaga di mesjid seperti menjaga kebersihan, berbicara pelan, dan tidak bermain-main saat salat, (5) Mengenal bagian-bagian mesjid seperti mihrab, mimbar, dan saf salat beserta fungsinya, (6) Mempraktikkan gerakan salat dasar dengan benar, (7) Memahami pentingnya wudhu sebelum salat, (8) Menumbuhkan rasa cinta dan bangga terhadap mesjid, (9) Menunjukkan sikap hormat dan kasih sayang terhadap tempat ibadah dan jamaah lainnya, dan (10) Membiasakan diri untuk datang ke mesjid untuk beribadah bersama keluarga.',
      kerangkaPembelajaran: JSON.stringify({
        praktekPedagogik: 'Pembelajaran berbasis pengalaman langsung melalui kunjungan ke mesjid, main peran untuk mempraktikkan aktivitas di mesjid, observasi lapangan untuk mengenal bagian-bagian mesjid, cerita bergambar tentang sejarah dan fungsi mesjid, pertanyaan terbuka untuk merangsang berpikir kritis anak tentang pentingnya mesjid, pembelajaran berbasis proyek untuk membuat miniatur mesjid, pembiasaan adab melalui praktik langsung, dan diskusi kelompok untuk berbagi pengalaman tentang mesjid.',
        lingkunganPembelajaran: {
          fisik: 'Model mesjid mini yang detail dan realistis, gambar-gambar mesjid dari berbagai sudut dan bagian-bagiannya, karpet sholat atau alas untuk praktik salat, alat-alat salat seperti sajadah, tasbih, dan mukena mini, poster tentang adab di mesjid, area untuk membuat karya seni bertema mesjid, dan sudut baca dengan buku cerita tentang mesjid.',
          sosial: 'Kerja kelompok kecil untuk proyek pembuatan karya, interaksi langsung dengan pengurus masjid untuk mendapatkan penjelasan, bermain bersama teman dalam simulasi salat berjamaah, saling membantu saat praktik wudhu dan salat, diskusi kelompok untuk berbagi pengalaman, dan presentasi hasil karya di depan teman-teman.',
          psikologis: 'Lingkungan yang nyaman, aman, dan mendukung untuk eksplorasi, pujian dan motivasi positif untuk setiap usaha anak, ruang untuk berekspresi kreativitas tanpa takut salah, suasana yang hangat dan penuh kasih sayang, dan penghargaan terhadap perbedaan kemampuan anak.',
          akademik: 'Buku cerita bergambar tentang mesjid dan sejarahnya, gambar-gambar detail tentang aktivitas ibadah di mesjid, video edukasi pendek tentang salat dan wudhu, kartu-kartu kata tentang nama bagian mesjid, dan bahan bacaan sederhana tentang adab di mesjid.'
        },
        kemitraanPembelajaran: 'Orang tua untuk mendampingi dan memperkuat pembelajaran di rumah, pengurus masjid setempat untuk memberikan penjelasan langsung dan kunjungan, tokoh agama untuk berbagi pengetahuan tentang mesjid, dan komunitas sekitar untuk mendukung kegiatan pembelajaran berbasis masyarakat.',
        pemanfaatanDigital: 'Video singkat dan animasi tentang mesjid dan aktivitas ibadah di dalamnya, aplikasi edukasi anak tentang belajar salat dan wudhu, gambar-gambar digital dari berbagai mesjid di dunia, dan audio bacaan salat untuk pengenalan suara.'
      }),
      kegiatanPembelajaran: JSON.stringify({
        persiapan: {
          pemahamanKonsep: 'Guru membaca buku cerita tentang mesjid dan mempelajari sejarah serta fungsi mesjid dalam Islam, guru menonton video pendek tentang kegiatan di mesjid untuk mendapatkan gambaran aktivitas yang akan diajarkan, guru berdiskusi dengan rekan sejawat tentang strategi terbaik untuk mengenalkan mesjid kepada anak usia dini, dan guru menyiapkan pertanyaan-pertanyaan yang akan diajukan untuk merangsang berpikir kritis anak.',
          penyiapanAlat: 'Mempersiapkan model mesjid mini yang lengkap dengan bagian-bagiannya, menyiapkan gambar-gambar besar tentang aktivitas di mesjid, mempersiapkan alat peraga salat seperti sajadah mini, tasbih, dan mukena untuk anak, menyiapkan area untuk praktik salat dan wudhu, mempersiapkan bahan-bahan seni untuk membuat karya bertema mesjid, dan menyiapkan poster atau kartu tentang adab di mesjid.',
          alatBahan: 'Kertas warna berbagai ukuran, gunting aman untuk anak, lem non-toxic, stiker bertema Islam, gambar-gambar mesjid dari berbagai sudut, model mesjid mini yang detail, karpet atau alas untuk praktik salat, sajadah mini untuk setiap anak, tasbih untuk pengenalan, mukena mini untuk anak perempuan, wastafel atau ember air untuk praktik wudhu, sabun dan handuk bersih, poster tentang adab di mesjid, buku cerita tentang mesjid, dan video edukasi tentang salat dan wudhu.'
        },
        pelaksanaan: {
          orientasi: 'Guru mengajak anak duduk melingkar di lantai dengan posisi yang nyaman, guru menanyakan pengalaman anak mengenai mesjid: "Siapa yang pernah ke mesjid?", "Apa yang kalian lihat di mesjid?", "Apa yang kalian lakukan di mesjid?", guru memperkenalkan tema pembelajaran hari ini: "Hari ini kita akan belajar tentang mesjid, rumah Allah", dan guru menunjukkan gambar mesjid yang besar dan indah untuk membangun antusiasme anak.',
          eksplorasi: 'Guru memperlihatkan model mesjid mini dan mengajak anak mengenal bagian-bagiannya: "Ini mihrab, tempat imam memimpin salat", "Ini mimbar, tempat khotib berdiri", "Ini saf, tempat jamaah salat berjamaah", anak diajak melihat-lihat model mesjid secara berkelompok, guru mempraktikkan gerakan salat sederhana seperti takbir, rukuk, dan sujud, anak diajak untuk menirukan gerakan tersebut, dan guru menjelaskan makna setiap gerakan dengan bahasa yang sederhana dan mudah dipahami anak.',
          diskusi: 'Guru membahas cara bersikap di mesjid: "Bagaimana cara kita berbicara di mesjid?", "Mengapa kita harus diam saat orang lain sedang salat?", "Bagaimana cara menjaga kebersihan mesjid?", guru mengajak anak berdiskusi tentang mengapa mesjid tempat suci: "Mengapa mesjid kita anggap sakral?", "Apa arti mesjid bagi kita sebagai muslim?", dan guru mengajak anak berbagi pengalaman: "Apa yang paling kalian sukai saat di mesjid?", "Ada kegiatan apa saja yang kalian lihat di mesjid?".',
          kolaborasi: 'Guru membagi anak menjadi beberapa kelompok kecil, setiap kelompok diberi tugas untuk membangun mesjid mini bersama menggunakan kardus dan bahan seni, kelompok lain bermain peran sholat berjamaah dengan satu anak menjadi imam dan yang lainnya menjadi makmum, kelompok lain membuat poster tentang adab di mesjid dengan gambar dan tulisan sederhana, dan guru berkeliling ke setiap kelompok untuk memberikan bimbingan dan dukungan.',
          refleksi: 'Anak duduk kembali melingkar dan guru mengajak mereka bercerita: "Apa yang kalian pelajari hari ini tentang mesjid?", "Bagian mesjid mana yang paling kalian suka?", "Apa yang akan kalian lakukan saat ke mesjid besok?", guru menanyakan: "Mengapa kita harus mencintai mesjid?", dan anak diminta untuk menunjukkan satu gerakan salat yang mereka pelajari hari ini.'
        },
        pembuatanKarya: {
          proses: 'Anak membuat gambar mesjid dengan krayon atau cat air, guru membantu menggambar kerangka mesjid dan anak mengisi dengan warna-warna cerah, anak mewarnai gambar aktivitas ibadah seperti orang sedang salat atau wudhu, anak membuat miniatur mesjid dari kardus bekas dengan bantuan guru, anak menempel stiker bertema Islam pada kertas untuk membuat hiasan dinding bertema mesjid, dan anak membuat poster tentang adab di mesjid dengan tulisan sederhana dan gambar pendukung.',
          hasil: 'Kumpulan gambar mesjid berwarna yang beragam dan kreatif, miniatur mesjid 3D dari kardus yang bisa dipajang di kelas, poster tentang adab di mesjid yang berisi aturan-aturan sederhana dengan gambar ilustrasi, hiasan dinding bertema mesjid yang bisa menghias kelas, dan dokumentasi foto anak saat sedang membuat karya sebagai bukti proses pembelajaran.'
        },
        presentasi: {
          persiapan: 'Guru membantu setiap anak menyiapkan karya hasil proyek mereka untuk ditampilkan, guru membimbing anak membuat kalimat sederhana untuk menjelaskan karya mereka: "Ini gambar mesjid saya", "Saya membuat ini dengan warna-warna cerah", dan guru menyiapkan sudut pajang di kelas sebagai "Galeri Mesjid Kita" untuk menampilkan semua karya anak.',
          pelaksanaan: 'Setiap anak diminta maju ke depan kelas satu per satu untuk menunjukkan karya mereka, anak menceritakan karya yang mereka buat dengan bimbingan guru, anak menjawab pertanyaan sederhana dari teman-teman tentang karya mereka, teman-teman lain memberikan applause sebagai bentuk apresiasi, dan guru memberikan pujian spesifik untuk setiap karya yang ditampilkan.'
        },
        refleksiAkhir: {
          refleksiGuru: 'Guru menilai pemahaman anak tentang mesjid melalui pertanyaan dan diskusi, guru mengamati sikap anak saat menirukan aktivitas di mesjid seperti salat dan wudhu, guru menilai kreativitas anak dalam membuat karya seni bertema mesjid, guru mencatat anak-anak yang masih memerlukan bimbingan tambahan untuk materi berikutnya, dan guru mengevaluasi efektivitas strategi pembelajaran yang digunakan dan merencanakan perbaikan untuk pertemuan selanjutnya.',
          refleksiAnak: 'Anak menceritakan apa yang paling mereka sukai dari kegiatan hari ini, anak menyampaikan hal baru yang mereka pelajari tentang mesjid, anak menyampaikan kesulitan yang mereka hadapi saat membuat karya atau mempraktikkan aktivitas, anak mengekspresikan perasaan mereka setelah belajar tentang mesjid, dan anak menyebutkan apa yang ingin mereka lakukan atau pelajari lebih lanjut tentang mesjid.'
        }
      })
    }
  })

  // Template 2: Generasi Sehat dan Bugar
  await prisma.rPPTemplate.upsert({
    where: { tema: 'Generasi Sehat dan Bugar' },
    update: {},
    create: {
      tema: 'Generasi Sehat dan Bugar',
      topikKBC: 'Cinta Diri dan Sesama',
      profilLulusan: 'Kesehatan, Kemandirian, Bernalar Kritis, Kreatif, Berkarakter, Beriman, Bertakwa',
      tujuanKBC: 'Menumbuhkan sikap syukur pada diri melalui penerapan self compassion, yaitu mengembangkan welas asih terhadap diri sendiri dengan memenuhi hak-hak dasar fisik, emosi, dan spiritual secara seimbang. Anak diajak untuk mencintai tubuh mereka sebagai anugerah Allah SWT, menjaga kesehatan melalui aktivitas fisik yang menyenangkan, dan memahami bahwa tubuh yang sehat adalah bentuk rasa syukur dan tanggung jawab terhadap nikmat Allah.',
      tujuanProfilLulusan: JSON.stringify({
        Kesehatan: 'Melalui aktivitas gerak seperti lari, lompat, dan permainan fisik yang terstruktur, murid dibiasakan membentuk kebiasaan hidup bersih, sehat, dan menjaga kebugaran fisik sesuai tahap perkembangan usia dini. Murid belajar memahami pentingnya olahraga, mengenali perubahan tubuh setelah beraktivitas fisik, dan membiasakan diri mencuci tangan, minum air yang cukup, serta menjaga kebersihan diri sebagai bagian dari gaya hidup sehat.',
        Kemandirian: 'Saat mengatur diri untuk beristirahat ketika lelah, mengikuti aturan permainan dengan baik, dan merapikan alat olahraga setelah digunakan, murid dibimbing untuk bertanggung jawab terhadap tindakan dan keputusan yang mereka ambil. Murid belajar mengenali batas kemampuan tubuh mereka, meminta bantuan ketika diperlukan, dan mengambil inisiatif untuk menjaga kebersihan dan kerapian lingkungan sekitar.',
        BernalarKritis: 'Melalui pertanyaan-pertanyaan seperti "Mengapa tubuh kita berkeringat setelah berlari?", "Kenapa kita perlu minum air setelah bermain?", murid diajak untuk berpikir kritis tentang hubungan antara aktivitas fisik dan kesehatan tubuh. Murid belajar menganalisis perubahan yang terjadi dalam tubuh mereka setelah bergerak, memahami sebab-akibat dari kebiasaan sehat dan tidak sehat, serta mengambil keputusan sederhana tentang perilaku yang mendukung kesehatan.',
        Kreatif: 'Murid diajak untuk menciptakan gerakan-gerakan baru secara aman, mengembangkan variasi permainan fisik yang menyenangkan, dan menemukan cara-cara kreatif untuk tetap aktif bergerak dalam berbagai situasi. Mereka juga dapat membuat karya seni atau poster bertema kesehatan dan kebugaran sebagai bentuk ekspresi kreativitas mereka tentang pentingnya menjaga tubuh.',
        Berkarakter: 'Melalui permainan kelompok, murid belajar tentang sportivitas, kerja sama, dan menghargai teman yang berbeda kemampuannya. Mereka diajak untuk saling menyemangati, tidak mengejek teman yang kalah dalam permainan, dan membantu teman yang kesulitan. Nilai-nilai seperti tanggung jawab, disiplin, dan peduli terhadap kesehatan diri dan orang lain juga ditanamkan melalui kegiatan ini.',
        Beriman: 'Murid diajak memahami bahwa tubuh yang sehat adalah anugerah Allah SWT yang harus disyukuri dan dijaga. Mereka belajar bahwa menjaga kesehatan adalah bentuk ibadah dan rasa terima kasih kepada Allah atas nikmat kesehatan yang diberikan. Konsep "tubuh adalah amanah dari Allah" diperkenalkan dengan bahasa yang sederhana dan sesuai usia.',
        Bertakwa: 'Murid diperkenalkan dengan konsep bahwa menjaga kesehatan adalah bagian dari agama. Mereka belajar doa-doa sebelum dan sesudah beraktivitas, memahami bahwa tubuh yang sehat memudahkan kita untuk beribadah, dan membiasakan diri berterima kasih kepada Allah setelah selesai beraktivitas fisik.'
      }),
      tujuanPembelajaranMendalam: `AB6: Murid berpartisipasi aktif dalam menjaga kebersihan, kesehatan, dan keselamatan diri sebagai bentuk rasa sayang terhadap dirinya dan rasa syukur kepada Allah SWT
JD5: Murid memiliki fungsi gerak (motorik kasar, halus dan taktil) untuk merawat dirinya, membangun kemandirian dan berkegiatan
LS5: Murid mengeksplorasi berbagai proses seni, mengekspresikannya serta mengapresiasi karya seni
KD1: Mengenal berbagai gerakan dasar yang dapat dilakukan tubuh (lari, lompat, lempar, tangkap)
KD2: Memahami pentingnya olahraga dan aktivitas fisik untuk kesehatan tubuh
KD3: Mempraktikkan cara mencuci tangan dengan benar dan memahami pentingnya kebersihan
KD4: Mengenal pentingnya minum air yang cukup dan makanan sehat untuk tubuh
KD5: Memahami perubahan yang terjadi pada tubuh setelah beraktivitas fisik
KD6: Menumbuhkan kebiasaan hidup sehat sejak dini`,
      materiIntegrasiKBC: 'Pengenalan berbagai gerakan dasar tubuh seperti berlari, melompat, melempar, menangkap, dan meluncur dengan aman dan menyenangkan. Konsep pentingnya olahraga dan aktivitas fisik untuk menjaga kesehatan tubuh dan memperkuat otot. Pembelajaran tentang kebersihan diri: cara mencuci tangan dengan benar menggunakan sabun, memahami kapan harus mencuci tangan, dan pentingnya menjaga kebersihan tubuh. Pengenalan tentang pentingnya hidrasi: mengenal kapan harus minum, berapa banyak air yang dibutuhkan, dan tanda-tanda dehidrasi sederhana. Konsep makanan sehat: mengenal makanan yang baik untuk tubuh dan yang tidak, serta pentingnya gizi seimbang. Pemahaman tentang perubahan tubuh setelah beraktivitas: berkeringat, detak jantung meningkat, napas lebih cepat, dan mengapa hal tersebut terjadi. Konsep istirahat dan pemulihan: mengenali tanda-tanda tubuh lelah dan pentingnya istirahat. Pembiasaan hidup sehat: rutinitas pagi hari, kebersihan pribadi, dan pola tidur yang baik. Nilai-nilai Islam tentang menjaga kesehatan: tubuh sebagai amanah Allah, rasa syukur atas kesehatan, dan kesehatan sebagai fasilitas untuk beribadah.',
      tujuanPembelajaran: 'Setelah mengikuti kegiatan pembelajaran "Generasi Sehat dan Bugar", murid diharapkan dapat: (1) Mempraktikkan berbagai gerakan dasar tubuh seperti lari, lompat, lempar, dan tangkap dengan aman dan benar, (2) Memahami pentingnya olahraga dan aktivitas fisik untuk kesehatan tubuh, (3) Menjelaskan cara mencuci tangan dengan benar dan mempraktikkannya dalam kehidupan sehari-hari, (4) Mengenal kapan waktu yang tepat untuk minum air dan mempraktikkan kebiasaan minum yang cukup, (5) Mengenali perubahan yang terjadi pada tubuh setelah beraktivitas fisik seperti berkeringat dan napas cepat, (6) Menunjukkan sikap peduli terhadap kebersihan diri dan lingkungan sekitar, (7) Bekerja sama dengan teman dalam permainan dan saling menyemangati, (8) Mengenali tanda-tanda tubuh lelah dan tahu kapan harus beristirahat, (9) Menumbuhkan rasa syukur kepada Allah atas tubuh yang sehat, dan (10) Membiasakan gaya hidup sehat dalam kehidupan sehari-hari.',
      kerangkaPembelajaran: JSON.stringify({
        praktekPedagogik: 'Pembelajaran kontekstual berbasis permainan fisik yang menyenangkan dan pembiasaan hidup sehat melalui aktivitas gerak yang terstruktur. Menggunakan pendekatan learning by doing di mana murid belajar melalui pengalaman langsung bergerak dan bermain. Penerapan model pembelajaran kooperatif melalui permainan kelompok. Pembiasaan melalui repetisi positif dan reinforcement. Penerapan asas bermain sambil belajar (learning while playing) yang sesuai dengan karakteristik anak usia dini. Integrasi nilai-nilai Islam dalam setiap aktivitas fisik.',
        lingkunganPembelajaran: {
          fisik: 'Halaman atau lapangan madrasah yang luas dan aman sebagai arena permainan gerak, sudut cuci tangan lengkap dengan air bersih, sabun, dan handuk, area minum dengan air bersih dan gelas atau botol, matras atau karpet olahraga untuk aktivitas lantai, cone atau penanda lintasan untuk permainan lari, tali lompat, bola kecil, dan peralatan permainan lainnya yang aman untuk anak.',
          sosial: 'Interaksi positif antara murid saat bermain berkelompok dengan saling menyemangati dan membantu, kolaborasi dalam menyusun rangkaian gerak, suasana kompetisi yang sehat dan sportif, dan dukungan antar teman saat ada yang kesulitan.',
          psikologis: 'Suasana kegiatan yang menyenangkan, bebas tekanan, dan penuh semangat, lingkungan yang aman untuk mencoba gerakan baru tanpa takut salah, pujian dan motivasi positif untuk setiap usaha murid, dan ruang untuk berekspresi gerak secara kreatif.',
          akademik: 'Penjelasan singkat tentang konsep kesehatan tubuh sebelum aktivitas, pengamatan perubahan tubuh setelah bergerak, diskusi sederhana tentang pentingnya hidup sehat, dan refleksi setelah kegiatan untuk memperkuat pemahaman.'
        },
        kemitraanPembelajaran: 'Puskesmas atau posyandu untuk memberikan penyuluhan pola hidup sehat, orang tua murid untuk mendampingi dan menyiapkan bekal sehat serta memperkuat kebiasaan di rumah, tenaga kesehatan atau dokter anak sebagai narasumber tamu, dan komunitas olahraga setempat untuk dukungan fasilitas dan kegiatan.',
        pemanfaatanDigital: 'Video senam anak sebagai panduan gerak yang terstruktur dan menyenangkan, video pendek edukasi tentang pentingnya olahraga dan hidup sehat, aplikasi atau game edukasi tentang kebugaran untuk anak, dan audio musik yang ceria untuk mengiringi aktivitas gerak.'
      }),
      kegiatanPembelajaran: JSON.stringify({
        persiapan: {
          pemahamanKonsep: 'Guru meninjau kembali tujuan kegiatan yang berfokus pada pembiasaan hidup sehat dan aktivitas fisik pada murid. Guru menentukan fokus nilai yang ingin dikuatkan seperti rasa syukur, tanggung jawab, dan kerja sama. Guru mempelajari berbagai gerakan dasar yang aman untuk anak usia dini dan memilih permainan yang sesuai. Guru menyiapkan penjelasan sederhana tentang konsep kesehatan yang akan diperkenalkan.',
          penyiapanAlat: 'Guru menata area bermain di halaman atau lapangan madrasah dengan aman dan jelas. Guru menyiapkan sudut cuci tangan lengkap dengan ember berkran atau wastafel, sabun, dan handuk bersih. Guru menempatkan area minum dengan air bersih dan gelas atau botol untuk setiap murid. Guru menyiapkan peralatan permainan seperti cone, tali lompat, bola kecil, dan matras olahraga. Guru memastikan semua peralatan aman untuk digunakan anak.',
          alatBahan: 'Cone atau botol bekas sebagai penanda lintasan lari, tali lompat untuk aktivitas melompat, bola kecil yang aman untuk anak, matras atau karpet olahraga untuk aktivitas lantai, ember berkran atau wastafel untuk cuci tangan, sabun cuci tangan yang lembut, handuk bersih untuk setiap murid, air minum bersih dalam galon atau dispenser, gelas atau botol minum untuk setiap murid, musik ceria untuk mengiringi aktivitas, dan papan tulis atau kertas untuk penjelasan.'
        },
        pelaksanaan: {
          orientasi: 'Guru mengumpulkan murid di area yang telah disiapkan dan mengajak mereka duduk melingkar. Guru membuka kegiatan dengan salam dan sapaan hangat, lalu memperkenalkan tema "Generasi Sehat dan Bugar". Guru bertanya: "Siapa yang suka bermain dan bergerak?", "Apa yang terjadi pada tubuh kita setelah berlari?", dan memancing antusiasme murid. Guru menjelaskan bahwa hari ini mereka akan bermain sambil belajar tentang cara menjaga tubuh agar tetap sehat dan kuat sebagai rasa syukur kepada Allah.',
          eksplorasi: 'Guru memimpin pemanasan ringan dengan gerakan menggerakkan kepala, bahu, tangan, pinggang, dan kaki secara perlahan. Guru mencontohkan gerakan lari di tempat, lompat kangguru sederhana, dan gerakan melompat tali. Murid diajak menirukan gerakan-gerakan tersebut dengan tempo yang sesuai. Guru menjelaskan manfaat setiap gerakan untuk kesehatan tubuh dengan bahasa sederhana. Guru mengamati kemampuan murid dan memberikan bantuan individual jika diperlukan.',
          diskusi: 'Guru mengajak murid kembali duduk melingkar di area yang teduh dan meminta mereka memperhatikan perasaan tubuhnya setelah bergerak. Guru bertanya: "Apakah tubuh kalian berkeringat?", "Jantung kalian berdetak lebih cepat?", "Kenapa hal itu terjadi?". Guru menjelaskan bahwa berkeringat dan detak jantung cepat adalah tanda tubuh sedang bekerja dan itu sehat. Guru bertanya: "Apa yang harus kita lakukan setelah berkeringat?", dan memancing jawaban tentang minum air dan mencuci tangan.',
          kolaborasi: 'Guru menugaskan setiap kelompok untuk menyusun satu rangkaian gerak sehat sederhana dari 3-4 gerakan yang telah dipelajari. Setiap kelompok berdiskusi singkat untuk menentukan urutan gerakan. Murid berlatih melakukan rangkaian gerak tersebut bersama-sama. Guru berkeliling untuk membantu kelompok yang kesulitan. Setelah latihan, setiap kelompok memperlihatkan rangkaian gerak mereka di depan kelompok lain. Teman-teman memberikan applause dan pujian.',
          refleksi: 'Guru mengajak murid duduk kembali dengan tenang, melakukan beberapa gerakan peregangan ringan untuk menenangkan tubuh. Guru meminta setiap murid memilih satu emotikon sederhana (senang, biasa saja, atau lelah) yang mewakili perasaan mereka setelah kegiatan. Guru bertanya: "Apa yang paling kalian sukai dari kegiatan hari ini?", "Apa yang kalian pelajari tentang menjaga kesehatan?", dan mengajak murid bersyukur kepada Allah atas tubuh yang sehat dan kuat.'
        },
        pembuatanKarya: {
          proses: 'Guru menyiapkan kertas gambar, krayon, atau cat air untuk setiap murid. Guru meminta murid menggambar tubuh mereka yang sedang bergerak atau bermain olahraga. Murid bisa menggambar diri mereka sedang berlari, melompat, atau melakukan gerakan lain yang mereka sukai. Guru membantu murid yang kesulitan dengan memberikan contoh sketsa sederhana. Murid menghias gambar dengan warna-warna cerah. Murid bisa menambahkan tulisan sederhana seperti "Tubuhku Sehat" atau "Aku Suka Olahraga".',
          hasil: 'Kumpulan gambar atau poster sederhana bertema "Tubuhku Kuat dengan Bermain dan Bergerak" yang beragam dan kreatif. Setiap gambar merefleksikan pemahaman dan pengalaman murid tentang aktivitas fisik. Karya-karya ini dapat dipajang di kelas untuk mengingatkan murid tentang pentingnya hidup sehat dan aktif bergerak.'
        },
        presentasi: {
          persiapan: 'Guru menyiapkan sudut pajang di kelas atau di koridor madrasah sebagai "Galeri Fun Sport Day". Guru menyediakan papan pajang, selotip, dan tempat untuk menempelkan karya murid. Guru membantu murid merapikan dan menyiapkan karya mereka untuk dipajang.',
          pelaksanaan: 'Murid diminta menempelkan gambar mereka pada papan pajang dengan bantuan guru. Setiap murid mendapat giliran untuk berdiri di depan karya mereka dan menjelaskan sebentar tentang gambar tersebut: "Ini gambar saya sedang berlari", "Saya suka berlari karena membuat tubuh kuat". Teman-teman memberikan applause dan pujian. Guru memberikan komentar positif tentang setiap karya dan menghubungkannya dengan pentingnya hidup sehat.'
        },
        refleksiAkhir: {
          refleksiGuru: 'Guru menilai pemahaman anak tentang menjaga kesehatan tubuh melalui observasi selama kegiatan. Guru mengamati keterlibatan anak dalam kegiatan fisik dan tingkat keaktifan mereka. Guru menilai kemampuan motorik kasar anak dalam melakukan berbagai gerakan. Guru mencatat anak-anak yang masih memerlukan bantuan dalam koordinasi gerak. Guru mengevaluasi efektivitas metode pembelajaran yang digunakan dan merencanakan peningkatan untuk pertemuan berikutnya.',
          refleksiAnak: 'Anak menceritakan bagian tubuh yang paling mereka sukai dan kenapa. Anak menyampaikan hal baru yang mereka pelajari tentang kesehatan dan aktivitas fisik. Anak mengekspresikan perasaan mereka setelah beraktivitas fisik. Anak menyebutkan apa yang ingin mereka lakukan untuk tetap sehat di rumah. Anak menceritakan bagian kegiatan mana yang paling menyenangkan bagi mereka.'
        }
      })
    }
  })

  console.log('RPP Templates seeded successfully with comprehensive content!')
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
