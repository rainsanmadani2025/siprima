async function testAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/dashboard/guru/statistics');
    const data = await response.json();
    console.log('=== API RESPONSE ===');
    console.log(JSON.stringify(data, null, 2));
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

testAPI();
