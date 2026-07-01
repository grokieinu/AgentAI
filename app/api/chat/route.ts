import { NextRequest, NextResponse } from 'next/server'
import { processTradeQuery, ChatRequest } from '@/lib/trading-agent'

// CORS headers untuk mengizinkan request dari platform marketplace
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
}

// Handle preflight CORS request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

/**
 * Extract user prompt from various body formats:
 * 1. { "prompt": "..." }
 * 2. { "message": "..." }
 * 3. { "messages": [{"role": "user", "content": "..."}] }
 * 4. { "query": "..." }
 * 5. { "input": "..." }
 */
function extractPrompt(body: Record<string, unknown>): string | null {
  // Format 1: { prompt: "..." }
  if (body.prompt && typeof body.prompt === 'string') {
    return body.prompt
  }

  // Format 2: { message: "..." }
  if (body.message && typeof body.message === 'string') {
    return body.message
  }

  // Format 3: { messages: [{role: "user", content: "..."}] }
  if (body.messages && Array.isArray(body.messages) && body.messages.length > 0) {
    // Get the last user message
    const userMessages = body.messages.filter(
      (msg: { role?: string; content?: string }) => msg.role === 'user'
    )
    const lastMessage = userMessages.length > 0
      ? userMessages[userMessages.length - 1]
      : body.messages[body.messages.length - 1]

    if (lastMessage && typeof lastMessage.content === 'string') {
      return lastMessage.content
    }
  }

  // Format 4: { query: "..." }
  if (body.query && typeof body.query === 'string') {
    return body.query
  }

  // Format 5: { input: "..." }
  if (body.input && typeof body.input === 'string') {
    return body.input
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract prompt from any supported format
    const prompt = extractPrompt(body)

    if (!prompt) {
      return NextResponse.json(
        { error: 'No prompt found. Send { "prompt": "..." }, { "message": "..." }, or { "messages": [{"role": "user", "content": "..."}] }' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Use provided requestId/timestamp or generate defaults
    const requestId = body.requestId || body.request_id || `req_${Date.now()}`
    const timestamp = body.timestamp || Date.now()

    // Process the trading query
    const chatRequest: ChatRequest = { prompt, requestId, timestamp }
    const result = await processTradeQuery(chatRequest)

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

// Handle GET request — platform health/availability check
export async function GET() {
  return NextResponse.json(
    { status: 'ok' },
    { status: 200, headers: corsHeaders }
  )
}
