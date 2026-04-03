async function testAPI() {
  try {
    console.log('=== TEST API STATISTICS DENGAN userId GURU ===');
    
    // Ambil userId dari localStorage (simulasi)
    const userId = 'cmn4ix1lm0006p0jxaj8v7msw'; // userId Ibu Dewi
    
    // Test API dengan userId
    const response = await fetch(`http://localhost:3000/api/dashboard/guru/statistics?userId=${userId}`);
    const data = await response.json();
    
    console.log('Response success:', data.success);
    if (data.success) {
      console.log('\nData Siswa:');
      console.log('   Total:', data.data.students.total, 'siswa');
      console.log('   Hadir:', data.data.students.present, 'siswa');
      console.log('   Izin:', data.data.students.izin, 'siswa');
      console.log('   Sakit:', data.data.students.sakit, 'siswa');
      console.log('   Alpha:', data.data.students.alpha, 'siswa');
      console.log('\nData RPP:');
      console.log('   Total:', data.data.rpp.total, 'RPP');
      console.log('   Terbaru:', data.data.rpp.theme);
      console.log('\nData Penilaian:');
      console.log('   Progress:', data.data.assessments.progress + '%');
      console.log('   Dinilai:', data.data.assessments.assessed, '/', data.data.assessments.total, 'siswa');
    }
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

testAPI();
