import { useState, useEffect, useRef } from 'react'

// ─── Icons ────────────────────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

// ─── GitHub icon ──────────────────────────────────────────────────────────────

function GhIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle' }}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface TLine {
  type: 'cmd' | 'out' | 'ok' | 'blank'
  text: string
  pause?: number
}

// ─── Terminal boot sequence ───────────────────────────────────────────────────

const BOOT: TLine[] = [
  { type: 'cmd',   text: 'init_profile --user=eugene_way --force', pause: 400 },
  { type: 'out',   text: '  loading...', pause: 200 },
  { type: 'out',   text: '  name        : Eugene Way', pause: 100 },
  { type: 'out',   text: '  role        : Growth Tech Lead / Blockchain Engineer', pause: 100 },
  { type: 'out',   text: '  org         : Gear Technologies Inc.', pause: 100 },
  { type: 'out',   text: '  gear_since  : 2021', pause: 100 },
  { type: 'out',   text: '  location    : Madrid, Spain 🇪🇸', pause: 100 },
  { type: 'out',   text: '  github      : github.com/EugenWay', pause: 100 },
  { type: 'out',   text: '  email       : relax211@gmail.com', pause: 100 },
  { type: 'out',   text: '  linkedin    : linkedin.com/in/eugene-way-5b81b4188', pause: 120 },
  { type: 'ok',    text: '[OK] profile loaded — 42ms', pause: 500 },
  { type: 'blank', text: '', pause: 200 },
  { type: 'cmd',   text: 'ls ~/skills', pause: 300 },
  { type: 'out',   text: '  languages   : Rust · TypeScript · Solidity · Python · JS', pause: 80 },
  { type: 'out',   text: '  blockchain  : Gear/Vara · Ethereum · Polkadot · Substrate', pause: 80 },
  { type: 'out',   text: '  defi        : Perp Futures · CLOB · Orderbooks · Oracles', pause: 80 },
  { type: 'out',   text: '  tools       : Sails · gclient · polkadot.js · Pyth', pause: 80 },
  { type: 'out',   text: '  arch        : Event-Driven · Actor Model · Cross-chain', pause: 300 },
  { type: 'blank', text: '', pause: 200 },
  { type: 'cmd',   text: 'ls ~/contracts --stat', pause: 300 },
  { type: 'out',   text: '  VaraPerps      on-chain perps · CLOB · Rust/Sails', pause: 100 },
  { type: 'out',   text: '  CrossPing      Ethereum↔Vara reference flow', pause: 100 },
  { type: 'out',   text: '  Benchmarks     Gear.exe / Vara.eth performance demos', pause: 300 },
  { type: 'blank', text: '', pause: 200 },
  { type: 'cmd',   text: 'cat status.txt', pause: 200 },
  { type: 'ok',    text: 'open to collab on DeFi, cross-chain & on-chain derivatives', pause: 400 },
  { type: 'blank', text: '', pause: 150 },
  { type: 'ok',    text: 'ghost online. ask me about the builds 😎', pause: 0 },
]

const SUGGESTIONS = ['why hire eugene', 'show me proof', 'war stories', 'hot takes']

// ─── Data ─────────────────────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    period: 'Aug 2021 → Jul 2023',
    org: 'Gear Technologies Inc.',
    role: 'Ecosystem Lead (Europe)',
    items: [
      {
        text: 'Built practical use cases, demos, and reference examples that showed what the Gear/Vara L1 could actually do.',
        link: null,
      },
      {
        text: 'Worked across developer education, technical workshops, smart-contract examples, docs, and conference talks at Polkadot ecosystem events, Sub0, EthCC, and ETH conferences.',
        link: { label: '↗ gear-wiki', url: 'https://github.com/gear-foundation/gear-wiki' },
      },
      {
        text: 'Took abstract protocol capabilities and turned them into things builders could see, run, break, and build on top of.',
        link: null,
      },
      {
        text: 'Supported external integrations with ecosystem partners and infrastructure providers — wallets, explorers, market data platforms, data/indexing tools, and Polkadot developer tooling, including SubWallet, Subscan, CoinMarketCap, RPC setup, network metadata, and wallet/extension flows.',
        link: null,
      },
    ],
  },
  {
    period: 'Feb 2023 → present',
    org: 'Gear Technologies Inc.',
    role: 'Growth Tech Lead (Europe)',
    items: [
      {
        text: 'Worked as the technical point between product, frontend, backend, and external contributors — scoping features, shaping architecture, reviewing implementation direction, and turning protocol ideas into things the team could actually ship.',
        link: null,
      },
      {
        text: 'Moved deeper into internal products, Vara.eth, and developer-facing infrastructure: technical docs, whitepapers, reference apps, cross-chain examples, and on-chain systems that made the platform easier to understand and harder to dismiss.',
        link: { label: '↗ vara.eth', url: 'https://eth.vara.network/whitepaper' },
      },
      {
        text: 'Worked on Vara.eth materials and architecture explainers, including the public whitepaper and technical documentation.',
        link: { label: '↗ technical pdf', url: 'https://eth.vara.network/whitepaper/vara.eth-technical.pdf' },
      },
      {
        text: 'Built and documented reference flows around Ethereum ↔ Vara messaging with Solidity, Rust/Sails, and TypeScript relayers.',
        link: { label: '↗ cross-ping', url: 'https://github.com/gear-foundation/cross-ping' },
      },
      {
        text: 'Built product prototypes and simulations around on-chain compute and DeFi: Gear.exe / Vara.eth benchmark examples, perp futures tooling, and trading simulation systems that run against real Vara contracts instead of staying as diagrams.',
        link: null,
      },
      {
        text: 'Public footprint: 600+ commits across Gear/Vara repos, from docs and ecosystem examples to cross-chain flows, whitepapers, and product prototypes.',
        link: { label: '↗ github', url: 'https://github.com/search?q=author%3AEugenWay+org%3Agear-foundation&type=commits' },
      },
    ],
  },
  {
    period: '2018 → 2021',
    org: 'Freelance / Consulting',
    role: 'Developer & Web3 Consultant',
    items: [
      {
        text: 'Consulted for CoinTelegraph on the Polkadot ecosystem and architecture.',
        link: null,
      },
    ],
  },
]

const MATERIAL_GROUPS = [
  {
    label: 'articles',
    description: 'thinking / technical narratives',
    items: [
      {
        title: 'Real DeFi: Build HyperLiquid on Ethereum with Vara.eth',
        type: 'medium',
        url: 'https://medium.com/@VaraNetwork/real-defi-build-hyperliquid-on-ethereum-with-vara-eth-1617b84fd7a5',
      },
      {
        title: 'OrderBook on Vara.eth',
        type: 'medium',
        url: 'https://medium.com/@VaraNetwork/orderbook-on-vara-eth-dd71d420feb1',
      },
      {
        title: 'Fractured But Whole: Ethereum Fragmentation',
        type: 'medium',
        url: 'https://medium.com/@gear_techs/fractured-but-whole-can-ethereums-fragmentation-challenge-be-solved-77b7740f356b',
      },
      {
        title: 'Introducing Gear.exe: Computation Engine for Ethereum',
        type: 'medium',
        url: 'https://medium.com/@gear_techs/introducing-gear-exe-computation-engine-for-ethereum-54816874d8e6',
      },
    ],
  },
  {
    label: 'docs',
    description: 'whitepapers / architecture',
    items: [
      {
        title: 'Vara.eth Whitepaper',
        type: 'whitepaper',
        url: 'https://eth.vara.network/whitepaper',
      },
      {
        title: 'Vara.eth Technical PDF',
        type: 'pdf',
        url: 'https://eth.vara.network/whitepaper/vara.eth-technical.pdf',
      },
      {
        title: 'Vara Bridge Technical Overview',
        type: 'docs',
        url: 'https://wiki.gear.foundation/docs/vara-network/bridge/bridge_technical',
      },
    ],
  },
  {
    label: 'demos',
    description: 'code / videos / reference apps',
    items: [
      {
        title: 'Gear.exe performance benchmark demo',
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=KXLQ5kbteS0',
      },
      {
        title: 'OrderBook on Vara.eth demo',
        type: 'x',
        url: 'https://x.com/VaraNetwork/status/2064713689886785989',
      },
      {
        title: 'CrossPing: Ethereum ↔ Vara reference flow',
        type: 'github',
        url: 'https://github.com/gear-foundation/cross-ping',
      },
      {
        title: 'Vara.eth dApps and benchmark examples',
        type: 'github',
        url: 'https://github.com/gear-foundation/Vara.eth-dapps',
      },
    ],
  },
]

// ─── Particle title ───────────────────────────────────────────────────────────

const PT_ASCII = '0123456789ABCDEF'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  tx: number; ty: number
  ch: string
  word: 'E' | 'W'
}

function ParticleTitle() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let cancelled = false
    const mouse = { x: -999, y: -999 }
    const isTouchDevice = 'ontouchstart' in window
    let cell = 9
    let mouseR = isTouchDevice ? 160 : 110
    let particles: Particle[] = []
    let W = 0, H = 0

    const rndCh = () => {
      const h = () => PT_ASCII[Math.floor(Math.random() * PT_ASCII.length)]
      if (cell <= 4) return h()
      const r = Math.random()
      if (r < 0.06) return '0x'      // null byte standalone
      if (r < 0.12) return h()       // single nibble
      return h() + h()               // FF, A3, BE — main style
    }

    const init = () => {
      W = wrap.offsetWidth || 800
      const isMobileTitle = W <= 560
      cell = isMobileTitle ? 4 : 9
      mouseR = isTouchDevice ? (isMobileTitle ? 96 : 160) : 110

      const probe = document.createElement('canvas').getContext('2d')!
      let FS = 130
      probe.font = `700 ${FS}px "JetBrains Mono", monospace`
      const testW = probe.measureText('EUGENE WAY').width
      if (testW > W * 0.92) FS = Math.floor(FS * (W * 0.92 / testW))

      H = Math.ceil(FS * 1.3)
      canvas.width  = W
      canvas.height = H
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'

      // Sample letter pixel masks
      const off  = document.createElement('canvas'); off.width = W; off.height = H
      const octx = off.getContext('2d')!
      const font = `700 ${FS}px "JetBrains Mono", monospace`
      octx.font  = font

      const spW    = octx.measureText(' ').width
      const eW     = octx.measureText('EUGENE').width
      const totalW = eW + spW + octx.measureText('WAY').width
      const ox     = (W - totalW) / 2
      const y      = FS * 0.88

      octx.fillStyle = '#fff'
      octx.fillText('EUGENE', ox, y)
      const imgE = octx.getImageData(0, 0, W, H).data

      octx.clearRect(0, 0, W, H)
      octx.fillText('WAY', ox + eW + spW, y)
      const imgW = octx.getImageData(0, 0, W, H).data

      const cx = W / 2, cy = H / 2
      const cols = Math.floor(W / cell)
      const rows = Math.floor(H / cell)
      particles = []

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = Math.min(W - 1, c * cell)
          const py = Math.min(H - 1, r * cell)
          const i = (py * W + px) * 4
          const inE = imgE[i + 3] > 64
          const inW = imgW[i + 3] > 64
          if (!inE && !inW) continue

          const tx = c * cell + cell / 2
          const ty = r * cell + cell / 2
          const angle = Math.random() * Math.PI * 2
          const d     = 20 + Math.random() * Math.max(W, H) * 0.25

          particles.push({
            x: cx + Math.cos(angle) * d,
            y: cy + Math.sin(angle) * d,
            vx: 0, vy: 0, tx, ty,
            ch: rndCh(),
            word: inW ? 'W' : 'E',
          })
        }
      }
    }

    const tick = () => {
      if (cancelled) return
      const cs      = getComputedStyle(document.documentElement)
      const isLight = document.documentElement.getAttribute('data-theme') === 'light'
      const textCol = cs.getPropertyValue('--text').trim() || '#1c1a18'
      const green   = isLight ? textCol : (cs.getPropertyValue('--g').trim()      || '#4ade80')
      const purple  = isLight ? textCol : (cs.getPropertyValue('--purple').trim() || '#a78bfa')

      ctx.clearRect(0, 0, W, H)
      ctx.font = `${cell <= 4 ? cell : cell - 1}px "JetBrains Mono", monospace`

      for (const p of particles) {
        // Spring to target
        p.vx += (p.tx - p.x) * 0.12
        p.vy += (p.ty - p.y) * 0.12

        // Mouse repulsion
        const dx = p.x - mouse.x, dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < mouseR && dist > 0.5) {
          const f = ((mouseR - dist) / mouseR) * 9
          p.vx += (dx / dist) * f
          p.vy += (dy / dist) * f
        }

        p.vx *= 0.88; p.vy *= 0.88
        p.x  += p.vx; p.y  += p.vy

        // Scramble char while far from target
        if (Math.abs(p.x - p.tx) + Math.abs(p.y - p.ty) > 4 && Math.random() < 0.12) {
          p.ch = rndCh()
        }

        ctx.fillStyle = p.word === 'W' ? purple : green
        ctx.fillText(p.ch, p.x - cell / 2, p.y + cell / 2)
      }

      raf = requestAnimationFrame(tick)
    }

    const getPos = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = clientX - r.left
      mouse.y = clientY - r.top
    }

    const onMove  = (e: MouseEvent)  => getPos(e.clientX, e.clientY)
    const onLeave = ()               => { mouse.x = -999; mouse.y = -999 }
    const onTouch = (e: TouchEvent)  => { getPos(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault() }
    const onTouchEnd = ()            => { mouse.x = -999; mouse.y = -999 }

    document.fonts.ready.then(() => {
      if (cancelled) return
      init()
      tick()
    })

    canvas.addEventListener('mousemove',  onMove)
    canvas.addEventListener('mouseleave', onLeave)
    canvas.addEventListener('touchmove',  onTouch,    { passive: false })
    canvas.addEventListener('touchend',   onTouchEnd)

    const mo = new MutationObserver(() => { if (!cancelled) init() })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const ro = new ResizeObserver(() => { if (!cancelled) init() })
    ro.observe(wrap)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousemove',  onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('touchmove',  onTouch)
      canvas.removeEventListener('touchend',   onTouchEnd)
      mo.disconnect()
      ro.disconnect()
    }
  }, [])

  return (
    <div ref={wrapRef} className="particle-title-wrap">
      <canvas ref={canvasRef} className="particle-title-canvas" aria-label="Eugene Way" role="img" />
    </div>
  )
}

// ─── Terminal ─────────────────────────────────────────────────────────────────

function Terminal() {
  const [lines, setLines]     = useState<TLine[]>([])
  const [done, setDone]       = useState(false)
  const [input, setInput]     = useState('')
  const [busy, setBusy]       = useState(false)
  const [asked, setAsked]     = useState(false)
  const bodyRef               = useRef<HTMLDivElement>(null)
  const inputRef              = useRef<HTMLInputElement>(null)
  const userScrolled          = useRef(false)
  const interacted            = useRef(false)
  const history               = useRef<{ role: 'user' | 'assistant'; content: string }[]>([])

  // Boot animation
  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    let idx = 0
    const next = () => {
      if (cancelled) return
      if (idx >= BOOT.length) { setDone(true); return }
      const line = BOOT[idx]
      setLines(prev => [...prev, line])
      idx++
      timer = setTimeout(next, line.pause ?? 150)
    }
    timer = setTimeout(next, 600)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [])

  // Focus input when boot finishes
  useEffect(() => {
    if (done) setTimeout(() => inputRef.current?.focus(), 50)
  }, [done])

  // One-time nudge if the visitor goes quiet after boot
  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => {
      if (interacted.current) return
      setLines(prev => [...prev,
        { type: 'blank', text: '' },
        { type: 'out', text: '  still there? ask me why they call me chainsaw man.' },
      ])
      userScrolled.current = false
    }, 30_000)
    return () => clearTimeout(t)
  }, [done])

  // Track manual scroll
  const onScroll = () => {
    const el = bodyRef.current
    if (!el) return
    userScrolled.current = el.scrollHeight - el.scrollTop - el.clientHeight > 24
  }

  // Auto-scroll
  useEffect(() => {
    if (bodyRef.current && !userScrolled.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [lines])

  // Typewriter-reveal a reply line, matching the boot animation vibe
  const typeLine = (text: string) => new Promise<void>(resolve => {
    setLines(prev => [...prev, { type: 'out', text: '' }])
    let i = 0
    const iv = setInterval(() => {
      i += 2
      setLines(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = { type: 'out', text: '  ' + text.slice(0, i) }
        return copy
      })
      if (i >= text.length) { clearInterval(iv); resolve() }
    }, 12)
  })

  const askAI = async (question: string) => {
    setBusy(true)
    setLines(prev => [...prev, { type: 'out', text: '  ...' }])
    userScrolled.current = false
    let reply = ''
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-cw-chat': '1' },
        body: JSON.stringify({ message: question, history: history.current }),
      })
      const data = await res.json().catch(() => ({} as { reply?: string }))
      reply = data.reply || (res.status === 429
        ? 'easy tiger — rate limited. give it a sec.'
        : 'brain lag. try again in a moment.')
    } catch {
      reply = 'connection glitch. is the backend up?'
    }
    setLines(prev => prev.slice(0, -1)) // drop the "..." placeholder
    await typeLine(reply)
    setLines(prev => [...prev, { type: 'blank', text: '' }])
    history.current = [
      ...history.current,
      { role: 'user' as const, content: question },
      { role: 'assistant' as const, content: reply },
    ].slice(-6)
    setBusy(false)
    setTimeout(() => inputRef.current?.focus(), 20)
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || busy) return
    const raw = input.trim()
    if (!raw) return
    setInput('')
    const cmd = raw.toLowerCase()
    const cmdLine: TLine = { type: 'cmd', text: raw, pause: 0 }

    if (cmd === 'clear') { setLines([]); return }

    setLines(prev => [...prev, cmdLine])

    const print = (out: TLine[]) => {
      setLines(prev => [...prev, ...out, { type: 'blank', text: '', pause: 0 }])
      userScrolled.current = false
    }

    if (cmd === 'help') {
      print([
        { type: 'out', text: '  just talk to me — ask about my work, projects, web3, whatever.', pause: 0 },
        { type: 'out', text: '  commands: help · clear · neofetch · stats · crt on|off', pause: 0 },
      ])
      return
    }

    if (cmd === 'neofetch') {
      print([
        { type: 'ok',  text: 'eugene@way', pause: 0 },
        { type: 'out', text: '  ──────────', pause: 0 },
        { type: 'out', text: '  os       : web3/linux (madrid remix)', pause: 0 },
        { type: 'out', text: '  host     : gear technologies inc.', pause: 0 },
        { type: 'out', text: '  kernel   : rust · sails · typescript', pause: 0 },
        { type: 'out', text: '  uptime   : web3 since 2017 · gear since 2021', pause: 0 },
        { type: 'out', text: '  shell    : bash (this one, actually)', pause: 0 },
        { type: 'out', text: '  packages : perps · clob · bridges · whitepapers', pause: 0 },
        { type: 'out', text: '  theme    : chainsaw [dark]', pause: 0 },
        { type: 'out', text: '  cpu      : caffeine @ 4.20GHz', pause: 0 },
        { type: 'out', text: '  memory   : 600+ commits and counting', pause: 0 },
      ])
      return
    }

    if (cmd === 'sudo hire eugene' || cmd === 'sudo hire') {
      print([
        { type: 'out', text: '  [sudo] password for visitor: ********', pause: 0 },
        { type: 'ok',  text: 'access granted.', pause: 0 },
        { type: 'out', text: '  hire sequence initiated → relax211@gmail.com', pause: 0 },
        { type: 'out', text: '  he\'s expecting you 😎', pause: 0 },
      ])
      return
    }

    if (cmd === 'vim' || cmd === 'vi' || cmd === 'nvim') {
      print([{ type: 'out', text: '  no escape.', pause: 0 }])
      return
    }

    if (cmd === ':q' || cmd === ':q!' || cmd === ':wq' || cmd === 'exit') {
      print([{ type: 'out', text: '  you\'re not in vim. you never were.', pause: 0 }])
      return
    }

    if (cmd === 'stats') {
      ;(async () => {
        try {
          const res = await fetch('/api/stats')
          const d = await res.json()
          print([
            { type: 'ok',  text: 'ghost stats', pause: 0 },
            { type: 'out', text: `  questions answered : ${d.total} all-time · ${d.today} today`, pause: 0 },
            { type: 'out', text: '  hallucinations     : [redacted]', pause: 0 },
            { type: 'out', text: '  uptime             : the human since 2017 · the ghost since 2026', pause: 0 },
          ])
        } catch {
          print([{ type: 'out', text: '  stats offline. the ghost keeps its secrets today.', pause: 0 }])
        }
      })()
      return
    }

    if (cmd === 'crt on' || cmd === 'crt off') {
      const on = cmd.endsWith('on')
      document.documentElement.classList.toggle('crt', on)
      print([{ type: 'ok', text: on ? 'crt mode on. welcome to 1987.' : 'crt mode off. back to the future.', pause: 0 }])
      return
    }

    setAsked(true)
    askAI(raw)
  }

  const runSuggestion = (q: string) => {
    if (busy) return
    interacted.current = true
    setAsked(true)
    setLines(prev => [...prev, { type: 'cmd', text: q, pause: 0 }])
    askAI(q)
  }

  return (
    <div className="term-wrap">
      <div className="term-bar">
        <div className="term-dots"><span /><span /><span /></div>
        <span className="term-title">bash — eugene@way:~</span>
        <span className="term-status"><span className="pulse-dot" /> ONLINE</span>
      </div>
      <div ref={bodyRef} className="term-body" onScroll={onScroll}
           onClick={() => inputRef.current?.focus()}>
        {lines.map((l, i) => (
          <div key={i} className={`tl tl-${l.type}`}>
            {l.type === 'cmd' && <span className="tl-prompt">eugene@way:~$ </span>}
            {l.type === 'ok'  && <span className="tl-ok">✓ </span>}
            {l.text}
          </div>
        ))}
        {done && (
          <div className="tl tl-cmd term-input-row">
            <span className="tl-prompt">eugene@way:~$ </span>
            <input
              ref={inputRef}
              className="term-input"
              value={input}
              onChange={e => { interacted.current = true; setInput(e.target.value) }}
              onKeyDown={handleKey}
              disabled={busy}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              style={{ width: input.length > 0 ? `${input.length}ch` : '0px' }}
            />
            <span className="block-cursor">█</span>
            {input === '' && <span className="term-hint">{busy ? 'thinking…' : 'ask me anything...'}</span>}
          </div>
        )}
        {done && !asked && !busy && (
          <div className="term-suggest">
            <span className="term-suggest-label">try:</span>
            {SUGGESTIONS.map(s => (
              <button key={s} className="term-chip"
                onClick={e => { e.stopPropagation(); runSuggestion(s) }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  const [dark, setDark] = useState(true)
  const [open, setOpen] = useState(false)
  const NAV = ['about', 'experience', 'materials']

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  // close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const el = document.querySelector('.header')
      if (el && !el.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <header className="header">
      <div className="wrap">
        <span className="header-brand">
          <span className="g">EW</span>
          <span className="dim"> [v1.1]</span>
        </span>

        {/* desktop nav */}
        <nav className="header-nav">
          {NAV.map(s => (
            <a key={s} href={`#${s}`} className="nav-link">{s.toUpperCase()}<span className="nav-ul">_</span></a>
          ))}
        </nav>

        <div className="header-right">
          <button onClick={() => setDark(d => !d)} className="theme-btn" title="Toggle theme">
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href="https://github.com/EugenWay" target="_blank" rel="noreferrer" className="hbtn">
            <GhIcon /> github
          </a>

          {/* burger */}
          <button className={`burger${open ? ' burger--open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* mobile dropdown */}
      <nav className={`mobile-nav${open ? ' mobile-nav--open' : ''}`}>
        {NAV.map(s => (
          <a key={s} href={`#${s}`} className="mobile-nav-link"
            onClick={() => setOpen(false)}>
            {s.toUpperCase()}<span className="g">_</span>
          </a>
        ))}
      </nav>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg-grid" />
      <div className="hero-inner">
        <div className="hero-head">
          <div className="hero-eyebrow">
            <span className="pulse-dot" /> Tech Lead · Blockchain Engineer · Technical Writer
          </div>
          <ParticleTitle />
          <div className="hero-aka dim">// chainsaw man of web3</div>
        </div>
        <Terminal />
      </div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section className="section" id="about">
      <div className="sec-head">
        <span className="sec-label">// ABOUT</span>
      </div>
      <div className="output about-text">
        <p>
          Beyond the <span className="g">exceptional aesthetic taste</span>. I can actually build things.
        </p>
        <p>
          Web3 has a funny way of making you try on every hat in the wardrobe.
          Over the years I've worked across ecosystem, DevRel, technical writing,
          smart contracts, cross-chain infrastructure, conference talks, and product
          architecture. Sometimes in the same month. Honestly, I like it that way.
        </p>
        <p>
          I started around the Substrate and smart-contract rabbit hole, then kept
          going deeper: AMMs, CLOBs, bridges, whitepapers, perp futures, and enough
          protocol edge cases to ruin a normal person's weekend.
        </p>
        <p>
          These days, most of my work sits around Vara and Vara.eth: building DeFi
          primitives, cross-chain flows, reference apps, technical docs, and all the
          weird little use cases that turn a protocol from "interesting" into actually usable.
        </p>
        <p>
          That's the chainsaw man way: cut through the noise, get your hands dirty,
          <span className="g"> ship the thing properly</span>.
        </p>
      </div>
    </section>
  )
}

// ─── Experience ───────────────────────────────────────────────────────────────

function Experience() {
  return (
    <section className="section" id="experience">
      <div className="sec-head">
        <span className="sec-label">// EXPERIENCE</span>
      </div>
      <div className="output">
        {EXPERIENCE.map(exp => (
          <div key={`${exp.period}-${exp.role}`} className="exp-block">
            <div className="exp-header">
              <span className="exp-period dim">[{exp.period}]</span>
              <span className="exp-org g"> {exp.org}</span>
              <span className="exp-role dim"> · {exp.role}</span>
            </div>
            <div className="exp-items">
              {exp.items.map((item, i) => (
                <div key={i} className="exp-item">
                  <span className="exp-bullet g">▸ </span>
                  <span className="exp-text">
                    {item.text}
                    {item.link && (
                      <> <a href={item.link.url} target="_blank" rel="noreferrer" className="exp-link">{item.link.label}</a></>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Materials ────────────────────────────────────────────────────────────────

function Materials() {
  return (
    <section className="section" id="materials">
      <div className="sec-head">
        <span className="sec-label">// MATERIALS</span>
      </div>
      <div className="output">
        {MATERIAL_GROUPS.map(group => (
          <div key={group.label} className="mat-group">
            <div className="mat-group-head">
              <span className="mat-group-label">[{group.label}]</span>
              <span className="dim">{group.description}</span>
            </div>
            {group.items.map(m => (
              <a key={m.title} href={m.url} target="_blank" rel="noreferrer" className="mat-row">
                <span className="mat-type">[{m.type}]</span>
                <span className="mat-title">{m.title}</span>
                <span className="dim mat-arr">→</span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="app">
      <div className="noise" />
      <Header />
      <Hero />
      <main className="container">
        <About />
        <Experience />
        <Materials />
      </main>
      <footer className="footer">
        <span className="dim">// </span>eugene way © 2026
        <span className="dim"> — madrid</span>
        <span className="cursor"> █</span>
      </footer>
    </div>
  )
}
