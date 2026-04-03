async function testStatistics() {
  try {
    console.log('=== TEST API STATISTICS SETELAH RESTART ===');
    
    // Test dengan userId Ibu Dewi
    const userId = 'cmn4ix1lm0006p0jxaj8v7msw'; // userId Ibu Dewi
    
    const response = await fetch(`http://localhost:3000/api/dashboard/guru/statistics?userId=${userId}`);
    const text = await response.text();
    
    console.log('Response status:', response.status);
    console.log('Content type:', response.headers.get('content-type'));
    
    try {
      const data = JSON.parse(text);
      console.log('Response success:', data.success);
      
      if (data.success) {
        console.log('\n✅ API BERHASIL!');
        console.log('\nData Siswa:');
        console.log('   Total:', data.data.students.total, 'siswa');
        console.log('   Hadir:', data.data.students.present, 'siswa');
        console.log('   Izin:', data.data.students.izin, 'siswa');
        console.log('   Sakit:', data.data.students.sakit, 'siswa');
        console.log('   Alpha:', data.data.students.alpha, 'siswa');
        console.log('\nData RPP:');
        console.log('   Total:', data.data.rpp.total, 'RPP');
        console.log('   Terbaru:', data.data.rpp.theme || '-');
        console.log('\nData Penilaian:');
        console.log('   Progress:', data.data.assessments.progress + '%');
        console.log('   Dinilai:', data.data.assessments.assessed + '/' + data.data.assessments.total + ' siswa');
      } else {
        console.log('❌ API GAGAL - Response success:', data.success);
        console.log('Error:', data.error || 'Unknown error');
      }
    } catch (e: any) {
      console.log('❌ JSON Parse Error:', e.message);
      console.log('Raw response (first 500 chars):', text.substring(0, 500));
    }
  } catch (error: any) {
    console.log('❌ Network Error:', error.message);
  }
}

testStatistics();
