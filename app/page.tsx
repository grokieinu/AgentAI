export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🤖 AI Trading Agent</h1>
      <p>This is an AI-powered trading analysis agent. Use the API endpoints below:</p>

      <h2>Endpoints</h2>

      <div style={{ background: '#1a1a2e', color: '#eee', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3 style={{ color: '#4fc3f7' }}>POST /api/chat</h3>
        <pre style={{ overflow: 'auto' }}>{`Request:
{
  "prompt": "Analisis BTC/USDT timeframe 4H",
  "requestId": "unique-request-id",
  "timestamp": 1234567890
}

Response:
{
  "response": "AI trading analysis..."
}`}</pre>
      </div>

      <div style={{ background: '#1a1a2e', color: '#eee', padding: '1rem', borderRadius: '8px' }}>
        <h3 style={{ color: '#4fc3f7' }}>GET /health</h3>
        <pre>{`Response: { "status": "ok" }`}</pre>
      </div>
    </main>
  )
}
