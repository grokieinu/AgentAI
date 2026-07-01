import { NextRequest, NextResponse } from 'next/server'
import { processTradeQuery, ChatRequest } from '@/lib/trading-agent'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { prompt, requestId, timestamp } = body as ChatRequest

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "prompt" field' },
        { status: 400 }
      )
    }

    if (!requestId || typeof requestId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "requestId" field' },
        { status: 400 }
      )
    }

    if (!timestamp || typeof timestamp !== 'number') {
      return NextResponse.json(
        { error: 'Missing or invalid "timestamp" field' },
        { status: 400 }
      )
    }

    // Process the trading query
    const result = await processTradeQuery({ prompt, requestId, timestamp })

    return NextResponse.json({ response: result.response })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      message: 'AI Trading Agent API',
      usage: 'Send a POST request with { prompt, requestId, timestamp }',
      health: 'GET /health for health check',
    },
    { status: 200 }
  )
}
