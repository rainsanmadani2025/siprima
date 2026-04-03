import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testStatistics() {
  try {
    console.log('=== VERIFIKASI PERBEDAAN SISWA ===\n');
    
    // 1. Get all students (tanpa filter)
    const allStudents = await prisma.student.findMany({
      where: { status: 'aktif' },
      include: { class: true }
    });
    console.log('1. SEMUA SISWA (tanpa filter):', allStudents.length, 'siswa');
    allStudents.forEach(s => {
      console.log(`   - ${s.name} (Kelas: ${s.class?.name || 'N/A'})`);
    });
    
    // 2. Get all teachers
    const teachers = await prisma.teacher.findMany({
      select: { id: true, userId: true, user: { select: { name: true, username: true } } }
    });
    console.log('\n2. DAFTAR GURU:');
    teachers.forEach(t => {
      console.log(`   - ${t.user.name} (userId: ${t.userId})`);
    });
    
    if (teachers.length > 0) {
      const teacher1 = teachers[0]; // Ambil guru pertama
      
      // 3. Get guru's classes
      const teacherClasses = await prisma.class.findMany({
        where: { teacherId: teacher1.id },
        select: { id: true, name: true, ageGroup: true }
      });
      console.log(`\n3. GURU: ${teacher1.user.name}`);
      console.log('   Kelas yang diampu:');
      if (teacherClasses.length > 0) {
        teacherClasses.forEach(c => {
          console.log(`   - ${c.name} (${c.ageGroup})`);
        });
        
        const classIds = teacherClasses.map(c => c.id);
        const teacherStudents = await prisma.student.findMany({
          where: {
            status: 'aktif',
            classId: { in: classIds }
          },
          include: { class: true }
        });
        console.log(`\n4. SISWA YANG DIAMPU GURU: ${teacherStudents.length} siswa`);
        teacherStudents.forEach(s => {
          console.log(`   - ${s.name} (Kelas: ${s.class?.name || 'N/A'})`);
        });
      } else {
        console.log('\n3. SISWA YANG DIAMPU GURU: 0 siswa (guru belum ada kelas)');
      }
    } else {
      console.log('\n⚠️ TIDAK ADA GURU di database!');
    }
    
    // 4. Compare
    console.log('\n=== PERBANDINGAN ===');
    console.log('Semua siswa:', allStudents.length, 'siswa');
    console.log('Siswa guru:', teacherStudents?.length || 0, 'siswa');
    
    if (allStudents.length !== (teacherStudents?.length || 0)) {
      console.log('\n✅ PERBEDAAN DITEMUKAN! Sebelumnya menampilkan', allStudents.length, 'siswa');
      console.log('   Sekarang hanya menampilkan', teacherStudents?.length || 0, 'siswa');
    } else {
      console.log('\n⚠️ JUMLAH SAMA - Guru mengampu SEMUA siswa');
    }
    
  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testStatistics();
