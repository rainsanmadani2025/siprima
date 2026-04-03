import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    console.log('[Test AI] Starting test with prompt:', prompt)

    // Import z-ai-web-dev-sdk
    const ZAI = (await import('z-ai-web-dev-sdk')).default

    console.log('[Test AI] Creating ZAI instance...')
    const zai = await ZAI.create()
    console.log('[Test AI] ZAI instance created')

    console.log('[Test AI] Calling chat completion...')
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      thinking: { type: 'disabled' },
      max_tokens: 100
    })

    const content = completion.choices[0]?.message?.content || ''
    console.log('[Test AI] Response received:', content.substring(0, 200))

    return NextResponse.json({
      success: true,
      content: content
    })
  } catch (error: any) {
    console.error('[Test AI] Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'AI test failed'
    }, { status: 500 })
  }
}
