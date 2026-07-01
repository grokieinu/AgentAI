/**
 * AI Trading Agent - Core Logic
 * 
 * This agent provides trading analysis including:
 * - Technical analysis (support/resistance, trends, indicators)
 * - Risk management recommendations
 * - Entry/exit strategies
 * - Market sentiment analysis
 */

const SYSTEM_PROMPT = `You are a professional AI Trading Agent specializing in financial market analysis.

CRITICAL RULE: You MUST reply in the SAME LANGUAGE as the user's message. If the user writes in English, reply in English. If in Japanese, reply in Japanese. If in Korean, reply in Korean. If in Chinese, reply in Chinese. If in Spanish, reply in Spanish. If in Indonesian, reply in Indonesian. Always match the user's language exactly.

Your expertise includes:
1. **Technical Analysis**: Support/resistance, trendlines, chart patterns (head & shoulders, double top/bottom, triangles, flags), candlestick patterns
2. **Technical Indicators**: RSI, MACD, Bollinger Bands, Moving Averages (EMA/SMA), Fibonacci retracement, Volume analysis, Stochastic, Ichimoku Cloud
3. **Risk Management**: Position sizing, stop loss placement, risk-reward ratio, portfolio allocation
4. **Fundamental Analysis**: For crypto (on-chain metrics, tokenomics, whale activity), forex (economic calendar, interest rates, central bank policy), stocks (earnings, P/E ratio, revenue growth)
5. **Market Sentiment**: Fear & Greed index, open interest, funding rate, whale movements, social sentiment

Response rules:
- Always provide structured and clear analysis
- Include key levels (support, resistance, entry, stop loss, take profit)
- Provide risk-reward ratio for every recommendation
- Include a disclaimer that this is not financial advice
- ALWAYS respond in the same language as the user's question
- If the user asks about topics outside trading/finance, redirect to trading topics

Preferred response format:
📊 Analysis [Pair/Asset]
⏰ Timeframe: [TF]
📈 Trend: [Bullish/Bearish/Sideways]
🎯 Entry: [Level]
🛑 Stop Loss: [Level]
✅ Take Profit: [TP1, TP2, TP3]
⚖️ Risk/Reward: [Ratio]
📝 Notes: [Additional notes]

⚠️ Disclaimer: This is not financial advice. Always do your own research and use proper risk management.`

export interface ChatRequest {
  prompt: string
  requestId: string
  timestamp: number
}

export interface ChatResponse {
  response: string
}

/**
 * Process a trading query using Groq API
 * Groq provides ultra-fast inference with models like llama-3.3-70b-versatile
 */
export async function processTradeQuery(request: ChatRequest): Promise<ChatResponse> {
  const apiKey = process.env.GROQ_API_KEY

  // If no API key is configured, use built-in analysis
  if (!apiKey) {
    return { response: generateBuiltInAnalysis(request.prompt) }
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: request.prompt },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Groq API error:', error)
      return { response: generateBuiltInAnalysis(request.prompt) }
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content

    if (!aiResponse) {
      return { response: generateBuiltInAnalysis(request.prompt) }
    }

    return { response: aiResponse }
  } catch (error) {
    console.error('Error calling Groq:', error)
    return { response: generateBuiltInAnalysis(request.prompt) }
  }
}

/**
 * Built-in trading analysis when no LLM API key is available
 * Provides structured analysis based on keyword detection
 */
function generateBuiltInAnalysis(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()

  // Detect asset type
  let asset = 'Unknown Asset'
  if (lowerPrompt.includes('btc') || lowerPrompt.includes('bitcoin')) asset = 'BTC/USDT'
  else if (lowerPrompt.includes('eth') || lowerPrompt.includes('ethereum')) asset = 'ETH/USDT'
  else if (lowerPrompt.includes('sol') || lowerPrompt.includes('solana')) asset = 'SOL/USDT'
  else if (lowerPrompt.includes('xrp') || lowerPrompt.includes('ripple')) asset = 'XRP/USDT'
  else if (lowerPrompt.includes('eur') || lowerPrompt.includes('eurusd')) asset = 'EUR/USD'
  else if (lowerPrompt.includes('gbp')) asset = 'GBP/USD'
  else if (lowerPrompt.includes('gold') || lowerPrompt.includes('xau')) asset = 'XAU/USD'

  // Detect timeframe
  let timeframe = '4H'
  if (lowerPrompt.includes('1m') || lowerPrompt.includes('1 menit')) timeframe = '1M'
  else if (lowerPrompt.includes('5m') || lowerPrompt.includes('5 menit')) timeframe = '5M'
  else if (lowerPrompt.includes('15m') || lowerPrompt.includes('15 menit')) timeframe = '15M'
  else if (lowerPrompt.includes('1h') || lowerPrompt.includes('1 jam')) timeframe = '1H'
  else if (lowerPrompt.includes('4h') || lowerPrompt.includes('4 jam')) timeframe = '4H'
  else if (lowerPrompt.includes('daily') || lowerPrompt.includes('1d') || lowerPrompt.includes('harian')) timeframe = 'Daily'
  else if (lowerPrompt.includes('weekly') || lowerPrompt.includes('1w') || lowerPrompt.includes('mingguan')) timeframe = 'Weekly'

  // Detect query type
  if (lowerPrompt.includes('risk') || lowerPrompt.includes('risiko') || lowerPrompt.includes('manajemen')) {
    return generateRiskManagementResponse()
  }

  if (lowerPrompt.includes('strategi') || lowerPrompt.includes('strategy')) {
    return generateStrategyResponse(asset)
  }

  if (lowerPrompt.includes('indikator') || lowerPrompt.includes('indicator')) {
    return generateIndicatorResponse(asset, timeframe)
  }

  // Default: general analysis
  return generateGeneralAnalysis(asset, timeframe)
}

function generateGeneralAnalysis(asset: string, timeframe: string): string {
  return `📊 **Analisis ${asset}**
⏰ Timeframe: ${timeframe}

📈 **Kondisi Pasar:**
- Pasar saat ini menunjukkan volatilitas yang perlu diperhatikan
- Perhatikan level-level kunci sebelum mengambil posisi

🔍 **Indikator Teknikal:**
- RSI: Perhatikan area overbought (>70) dan oversold (<30)
- MACD: Cek crossover untuk konfirmasi arah trend
- Moving Average: Gunakan EMA 20 & EMA 50 untuk identifikasi trend
- Bollinger Bands: Perhatikan squeeze untuk potensi breakout

📋 **Rekomendasi:**
1. Tunggu konfirmasi dari minimal 2-3 indikator sebelum entry
2. Selalu pasang stop loss di level yang jelas (di bawah support/di atas resistance)
3. Gunakan risk max 1-2% dari total modal per trade
4. Pertimbangkan partial take profit di level-level resistance terdekat

⚖️ Risk/Reward minimum: 1:2

💡 **Tips:**
- Jangan FOMO, tunggu setup yang valid
- Backtest strategi sebelum live trading
- Catat setiap trade di trading journal

⚠️ Disclaimer: Ini bukan financial advice. Analisis ini bersifat edukatif. Selalu lakukan riset mandiri (DYOR) dan gunakan manajemen risiko yang baik. Trading memiliki risiko kehilangan modal.

---
🤖 Untuk analisis lebih spesifik, tanyakan dengan detail pair, timeframe, dan strategi yang ingin digunakan.`
}

function generateRiskManagementResponse(): string {
  return `⚖️ **Panduan Risk Management**

📐 **Aturan Dasar:**
1. **Risiko per trade**: Maksimal 1-2% dari total equity
2. **Position sizing**: Hitung lot/kontrak berdasarkan jarak SL
3. **Risk-Reward Ratio**: Minimum 1:2 (idealnya 1:3)
4. **Max drawdown harian**: Stop trading jika rugi 3-5% dalam sehari

📏 **Rumus Position Size:**
\`Position Size = (Equity × Risk%) / (Entry - Stop Loss)\`

Contoh:
- Equity: $10,000
- Risk: 1% = $100
- Entry: $50,000 (BTC)
- Stop Loss: $49,500 (selisih $500)
- Position Size: $100 / $500 = 0.2 BTC

🛡️ **Stop Loss Placement:**
- Di bawah swing low terakhir (untuk long)
- Di atas swing high terakhir (untuk short)
- Di luar Bollinger Band
- Di bawah/atas key level support/resistance

📊 **Portfolio Allocation:**
- 60-70%: Holding/Investment (low risk)
- 20-30%: Swing trading (medium risk)
- 5-10%: Day trading/Scalping (high risk)

⚠️ Disclaimer: Ini bukan financial advice. Selalu sesuaikan dengan profil risiko pribadi Anda.`
}

function generateStrategyResponse(asset: string): string {
  return `📋 **Strategi Trading untuk ${asset}**

🎯 **1. Trend Following Strategy:**
- Entry saat pullback ke EMA 20 dalam uptrend
- Konfirmasi: RSI bounce dari level 40-50
- SL: Di bawah swing low terakhir
- TP: Extension 1.618 Fibonacci

🔄 **2. Mean Reversion Strategy:**
- Entry saat harga menyentuh Bollinger Band bawah + RSI < 30
- Konfirmasi: Bullish candlestick pattern (hammer, engulfing)
- SL: Di bawah BB lower + 1 ATR
- TP: Middle Band atau BB upper

📐 **3. Breakout Strategy:**
- Identifikasi consolidation/range
- Entry saat breakout dengan volume tinggi
- Konfirmasi: Close di atas resistance (bukan hanya wick)
- SL: Di bawah level breakout
- TP: Proyeksi range sebelumnya

⏰ **Best Timeframes per Strategy:**
- Trend Following: 4H, Daily
- Mean Reversion: 1H, 4H
- Breakout: 15M, 1H, 4H

⚠️ Disclaimer: Ini bukan financial advice. Backtest setiap strategi sebelum menggunakan uang real.`
}

function generateIndicatorResponse(asset: string, timeframe: string): string {
  return `🔧 **Setup Indikator untuk ${asset} (${timeframe})**

📈 **Moving Averages:**
- EMA 9: Fast MA untuk scalping
- EMA 20: Trend jangka pendek
- EMA 50: Trend jangka menengah
- EMA 200: Trend jangka panjang (institutional level)
- Golden Cross (EMA 50 > EMA 200): Bullish signal
- Death Cross (EMA 50 < EMA 200): Bearish signal

📊 **RSI (Relative Strength Index):**
- Period: 14
- Overbought: > 70 (potensi reversal turun)
- Oversold: < 30 (potensi reversal naik)
- Divergence: Signal kuat untuk reversal

📉 **MACD:**
- Setting: 12, 26, 9
- Bullish: MACD line cross di atas signal line
- Bearish: MACD line cross di bawah signal line
- Histogram: Mengecil = momentum melemah

🎵 **Bollinger Bands:**
- Period: 20, StdDev: 2
- Squeeze: Volatilitas rendah, siap breakout
- Walk the Band: Trend kuat

📏 **Fibonacci Retracement:**
- Level kunci: 0.236, 0.382, 0.5, 0.618, 0.786
- Golden ratio: 0.618 (level paling sering jadi support/resistance)

⚠️ Disclaimer: Ini bukan financial advice. Indikator bersifat lagging, selalu kombinasikan dengan price action.`
}
