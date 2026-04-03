async function testAPI() {
  try {
    console.log('=== TEST API STATISTICS DENGAN userId GURU ===');
    
    const userId = 'cmn4ix1lm0006p0jxaj8v7msw';
    
    const response = await fetch(`http://localhost:3000/api/dashboard/guru/statistics?userId=${userId}`);
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', text);
    
    try {
      const data = JSON.parse(text);
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
        if (data.data.rpp.theme) {
          console.log('   Terbaru:', data.data.rpp.theme);
        } else {
          console.log('   Terbaru: -');
        }
        console.log('\nData Penilaian:');
        console.log('   Progress:', data.data.assessments.progress + '%');
        console.log('   Dinilai:', data.data.assessments.assessed + '/' + data.data.assessments.total + ' siswa');
      }
    } catch (e: any) {
      console.log('JSON Parse Error:', e.message);
    }
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

testAPI();
