import 'dotenv/config'
import express from 'express'
import rateLimit from 'express-rate-limit'
import OpenAI from 'openai'
import { SYSTEM_PROMPT } from './persona.js'

// ─── Config ─────────────────────────────────────────────────────────────────
const PORT               = Number(process.env.PORT || 8787)
const MODEL              = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const MAX_MESSAGE_CHARS  = 800
const MAX_HISTORY        = 6
const MAX_OUTPUT_TOKENS  = 250
const GLOBAL_DAILY_LIMIT = Number(process.env.GLOBAL_DAILY_LIMIT || 1500)

const ALLOWED_ORIGINS = new Set([
  'https://chainsawman.dev',
  'https://www.chainsawman.dev',
])

if (!process.env.OPENAI_API_KEY) {
  console.error('FATAL: OPENAI_API_KEY is not set')
  process.exit(1)
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 20_000,
  maxRetries: 1,
})

// ─── App ────────────────────────────────────────────────────────────────────
const app = express()
app.set('trust proxy', 1) // single nginx hop in front — req.ip = real client
app.use(express.json({ limit: '4kb' }))

function upstreamErrorInfo(err) {
  const status = Number(err?.status) || null
  if (status === 401) return { status, kind: 'auth' }
  if (status === 429) return { status, kind: 'rate_limited' }
  if (status && status >= 500) return { status, kind: 'provider' }
  if (err?.code) return { status, kind: String(err.code).slice(0, 64) }
  return { status, kind: err?.name || 'request_failed' }
}

// CORS allowlist — only our own origins may call the API from a browser
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-cw-chat')
    res.setHeader('Access-Control-Max-Age', '86400')
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// ─── Global daily budget guard (hard spend ceiling) ──────────────────────────
let currentDay = ''
let dayCount   = 0
function globalGuard(req, res, next) {
  const today = new Date().toISOString().slice(0, 10) // UTC date
  if (today !== currentDay) { currentDay = today; dayCount = 0 }
  if (dayCount >= GLOBAL_DAILY_LIMIT) {
    return res.status(429).json({ error: 'daily_limit', reply: "chat's tapped out for today. come back tomorrow." })
  }
  next()
}

// ─── Per-IP rate limits ──────────────────────────────────────────────────────
const perMinute = rateLimit({
  windowMs: 60_000, max: 8,
  standardHeaders: true, legacyHeaders: false,
  message: { error: 'rate_limited', reply: 'easy tiger. too fast — give it a sec.' },
})
const perDay = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, max: 60,
  standardHeaders: true, legacyHeaders: false,
  message: { error: 'rate_limited_day', reply: "you've hit today's limit. dog needs rest too." },
})

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true, model: MODEL }))

app.post('/api/chat',
  (req, res, next) => {
    // Frontend marker — cuts trivial bots (not real security)
    if (req.headers['x-cw-chat'] !== '1') return res.status(403).json({ error: 'forbidden' })
    next()
  },
  globalGuard,
  perMinute,
  perDay,
  async (req, res) => {
    try {
      const body = req.body || {}
      const message = typeof body.message === 'string' ? body.message.trim() : ''
      if (!message) return res.status(400).json({ error: 'empty' })
      if (message.length > MAX_MESSAGE_CHARS) {
        return res.status(400).json({ error: 'too_long', reply: 'whoa, tldr. keep it under 800 chars.' })
      }

      // Trust nothing from the client: filter + cap history
      const history = (Array.isArray(body.history) ? body.history : [])
        .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .slice(-MAX_HISTORY)
        .map(m => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }))

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: message },
      ]

      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages,
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.8,
      })

      dayCount++
      const reply = completion.choices?.[0]?.message?.content?.trim() || '...'
      const u = completion.usage
      console.log(`[chat] ip=${req.ip} in=${u?.prompt_tokens ?? '?'} out=${u?.completion_tokens ?? '?'} day=${dayCount}/${GLOBAL_DAILY_LIMIT}`)
      res.json({ reply })
    } catch (err) {
      const upstream = upstreamErrorInfo(err)
      console.error('[chat] error:', `status=${upstream.status ?? '?'}`, `kind=${upstream.kind}`)
      res.status(502).json({ error: 'upstream', upstream, reply: 'brain lag. try again in a moment.' })
    }
  }
)

app.listen(PORT, '127.0.0.1', () => {
  console.log(`chainsawman-chat listening on 127.0.0.1:${PORT} model=${MODEL}`)
})
