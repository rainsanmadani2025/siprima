import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username') || 'guru1'
  const password = searchParams.get('password') || 'guru123'
  const role = searchParams.get('role') || 'guru'

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    })

    const result = await response.json()
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      result,
      sentData: { username, password: `${password.substring(0, 3)}*** (${password.length} chars)` }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}
