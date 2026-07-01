import { NextRequest, NextResponse } from 'next/server'
import { processTradeQuery, ChatRequest } from '@/lib/trading-agent'

// CORS headers untuk mengizinkan request dari platform marketplace
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handle preflight CORS request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { prompt, requestId, timestamp } = body as ChatRequest

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "prompt" field' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (!requestId || typeof requestId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "requestId" field' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (!timestamp || typeof timestamp !== 'number') {
      return NextResponse.json(
        { error: 'Missing or invalid "timestamp" field' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Process the trading query
    const result = await processTradeQuery({ prompt, requestId, timestamp })

    return NextResponse.json(
      { response: result.response },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// Handle GET request — some platforms check this for availability
export async function GET() {
  return NextResponse.json(
    { status: 'ok' },
    { status: 200, headers: corsHeaders }
  )
}
