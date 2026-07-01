# 🤖 AI Trading Agent

AI-powered trading analysis agent yang bisa di-deploy ke Vercel. Agent ini menyediakan analisis teknikal, manajemen risiko, dan rekomendasi trading.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` dan tambahkan Groq API key (dapatkan gratis di https://console.groq.com/keys):

```
GROQ_API_KEY=gsk_your-groq-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## 📡 API Endpoints

### POST /api/chat

Kirim pertanyaan trading ke agent.

**Request:**
```json
{
  "prompt": "Analisis BTC/USDT timeframe 4H",
  "requestId": "unique-request-id",
  "timestamp": 1234567890
}
```

**Response:**
```json
{
  "response": "📊 Analisis BTC/USDT..."
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## 🌐 Deploy ke Vercel

### Option 1: Via Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2: Via GitHub

1. Push repo ini ke GitHub
2. Buka [vercel.com](https://vercel.com)
3. Import repository
4. Tambahkan environment variable `GROQ_API_KEY` di Vercel dashboard
5. Deploy!

### Setelah Deploy

Agent endpoint kamu akan menjadi:
```
https://your-project-name.vercel.app/api/chat
```

Masukkan URL ini ke platform marketplace sebagai Agent API Endpoint.

## 🧠 Fitur Agent

- **Analisis Teknikal**: Support/resistance, chart patterns, candlestick patterns
- **Indikator**: RSI, MACD, Bollinger Bands, Moving Averages, Fibonacci
- **Risk Management**: Position sizing, stop loss, risk-reward ratio
- **Multi-Asset**: Crypto, Forex, Saham, Komoditas
- **Multi-Timeframe**: Dari 1M hingga Weekly
- **Bilingual**: Mendukung Bahasa Indonesia dan English

## 📝 Contoh Pertanyaan

- "Analisis BTC/USDT timeframe 4H"
- "Bagaimana cara risk management yang baik?"
- "Strategi trading untuk ETH/USDT"
- "Indikator apa yang cocok untuk scalping?"
- "Analisis gold/XAU daily"

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **AI**: Groq (Llama 3.3 70B) — ultra-fast inference
- **Hosting**: Vercel
- **Runtime**: Edge-compatible

## ⚠️ Disclaimer

Agent ini dibuat untuk tujuan edukatif. Bukan financial advice. Selalu lakukan riset mandiri (DYOR) dan gunakan manajemen risiko yang baik sebelum melakukan trading.
