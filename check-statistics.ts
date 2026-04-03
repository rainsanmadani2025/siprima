import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkStatistics() {
  console.log('=== CHECK STATISTICS DATA REAL ===\n');
  
  try {
    // 1. Total Students (aktif)
    const students = await prisma.student.findMany({
      where: { status: 'aktif' },
      include: { class: true }
    });
    console.log('1. TOTAL SISWA (aktif):', students.length);
    console.log('   Detail:', students.map(s => `${s.name} (Kelas: ${s.class?.name || 'N/A'})`).join(', '));
    
    // 2. Today's Attendance
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = await prisma.studentAttendance.findMany({
      where: { date: today }
    });
    
    console.log('\n2. ABSENSI HARI INI (' + today + '):');
    console.log('   Total records:', todayAttendance.length);
    console.log('   Hadir:', todayAttendance.filter(a => a.status === 'hadir').length);
    console.log('   Izin:', todayAttendance.filter(a => a.status === 'izin').length);
    console.log('   Sakit:', todayAttendance.filter(a => a.status === 'sakit').length);
    console.log('   Alpha:', todayAttendance.filter(a => a.status === 'alpha').length);
    console.log('   Detail:', todayAttendance.map(a => `${a.date} - ${a.status}`).join(', '));
    
    // 3. Total RPP
    const allRPPs = await prisma.rPP.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log('\n3. TOTAL RPP:');
    console.log('   Jumlah:', allRPPs.length);
    if (allRPPs.length > 0) {
      console.log('   Terbaru:', allRPPs[0].tema, '-', allRPPs[0]?.subtema || 'N/A');
    }
    
    // 4. Today's RPPH
    const todayRPPH = await prisma.dailyPlan.findFirst({
      where: { date: today }
    });
    console.log('\n4. RPPH HARI INI:');
    console.log('   Status:', todayRPPH?.status || 'Tidak ada');
    if (todayRPPH) {
      console.log('   Tema:', todayRPPH.theme);
      console.log('   Subtema:', todayRPPH.subTheme);
    }
    
    // 5. Student Assessments This Month
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const assessments = await prisma.studentAssessment.findMany({
      where: {
        date: {
          startsWith: currentMonth
        }
      },
      select: {
        studentId: true
      }
    });
    
    const assessedStudents = new Set(assessments.map(a => a.studentId)).size;
    console.log('\n5. PENILAIAN BULAN INI (' + currentMonth + '):');
    console.log('   Total siswa:', students.length);
    console.log('   Siswa sudah dinilai:', assessedStudents);
    console.log('   Progress:', students.length > 0 ? ((assessedStudents / students.length) * 100).toFixed(0) + '%' : '0%');
    
    // 6. Check attendance by student
    console.log('\n6. DETAIL ABSENSI PER SISWA HARI INI:');
    for (const student of students) {
      const attendance = todayAttendance.find(a => a.studentId === student.id);
      if (attendance) {
        console.log(`   ${student.name}: ${attendance.status}`);
      } else {
        console.log(`   ${student.name}: Belum diabsen`);
      }
    }
    
  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkStatistics();
