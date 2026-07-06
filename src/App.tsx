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

interface Note {
  id: string
  title: string
  content: string
  date: string
  tags: string[]
}

// ─── Terminal boot sequence ───────────────────────────────────────────────────

const BOOT: TLine[] = [
  { type: 'cmd',   text: 'init_profile --user=eugene_way --force', pause: 400 },
  { type: 'out',   text: '  loading...', pause: 200 },
  { type: 'out',   text: '  name        : Eugene Way', pause: 100 },
  { type: 'out',   text: '  role        : Blockchain Dev / DeFi Engineer', pause: 100 },
  { type: 'out',   text: '  org         : Gear Foundation', pause: 100 },
  { type: 'out',   text: '  web3_since  : 2017', pause: 100 },
  { type: 'out',   text: '  location    : Madrid, Spain 🇪🇸', pause: 100 },
  { type: 'out',   text: '  github      : github.com/EugenWay', pause: 100 },
  { type: 'out',   text: '  email       : relax211@gmail.com', pause: 100 },
  { type: 'out',   text: '  linkedin    : linkedin.com/in/eugene-way', pause: 120 },
  { type: 'ok',    text: '[OK] profile loaded — 42ms', pause: 500 },
  { type: 'blank', text: '', pause: 200 },
  { type: 'cmd',   text: 'ls ~/skills', pause: 300 },
  { type: 'out',   text: '  languages   : Rust · TypeScript · Solidity · Python · JS', pause: 80 },
  { type: 'out',   text: '  blockchain  : Gear/Vara · Ethereum · Polkadot · Substrate', pause: 80 },
  { type: 'out',   text: '  defi        : Perp Futures · CLOB · Liquidations · Funding · Oracles', pause: 80 },
  { type: 'out',   text: '  tools       : Sails · gclient · polkadot.js · Pyth', pause: 80 },
  { type: 'out',   text: '  arch        : Event-Driven · Actor Model · Cross-chain', pause: 300 },
  { type: 'blank', text: '', pause: 200 },
  { type: 'cmd',   text: 'ls ~/contracts --stat', pause: 300 },
  { type: 'out',   text: '  VaraPerps      perp futures DEX · Rust/Sails · PROD', pause: 100 },
  { type: 'out',   text: '  CrossPing      Vara↔Eth bridge · Solidity+Rust · LIVE', pause: 100 },
  { type: 'out',   text: '  TradingSim     multi-bot engine · Rust/gclient · OPEN', pause: 300 },
  { type: 'blank', text: '', pause: 200 },
  { type: 'cmd',   text: 'cat status.txt', pause: 200 },
  { type: 'ok',    text: 'open to collab on DeFi, cross-chain & on-chain derivatives', pause: 400 },
  { type: 'blank', text: '', pause: 150 },
  { type: 'ok',    text: 'welcome, bitches 😎', pause: 0 },
]

// ─── Data ─────────────────────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    period: '2021 → present',
    org: 'Gear Foundation / Gear Tech',
    role: 'Blockchain Developer',
    items: [
      {
        text: 'Designed and built VaraPerps — perpetual futures DEX on Vara Network. Full CLOB with limit/market orders, cross/isolated margin, automated liquidations, funding rate engine, Pyth oracle integration.',
        link: { label: '↗ github', url: 'https://github.com/EugenWay' },
      },
      {
        text: 'Built CrossPing — Vara ↔ Ethereum bi-directional bridge. Solidity + Rust/Sails smart contracts + TypeScript relayer service. Full reference implementation.',
        link: { label: '↗ github', url: 'https://github.com/EugenWay' },
      },
      {
        text: 'Developed on-chain trading simulation engine in Rust: market maker, arbitrageur, liquidator, hodler bots running real transactions on Vara testnet via gclient.',
        link: null,
      },
      {
        text: 'Authored whitepapers: Gear.exe technical architecture document and "How Perpetual Futures Work on Vara.eth". Active contributor: gear-foundation/dapps (★30, 204 forks) · gear-wiki (★225).',
        link: { label: '↗ gear-wiki', url: 'https://wiki.gear.foundation' },
      },
    ],
  },
  {
    period: '2018 → 2021',
    org: 'Freelance / Consulting',
    role: 'Developer & Web3 Consultant',
    items: [
      {
        text: 'Consulted for Telegram on the Polkadot ecosystem — technical advisory, developer interviews, platform architecture reviews for their staking platform.',
        link: null,
      },
      {
        text: 'Conference speaker and workshop host — EthCC, Polkadot ecosystem events, Vara meetups. Live demos, not slides.',
        link: null,
      },
      {
        text: 'Built full-stack web applications with Node.js, Express, MongoDB, GraphQL. AI-powered e-commerce tooling and catalog management systems.',
        link: null,
      },
    ],
  },
]

const MATERIALS = [
  { title: 'Gear.exe Technical Whitepaper',            type: 'whitepaper', url: '#' },
  { title: 'How Perpetual Futures Work on Vara.eth',   type: 'guide',      url: '#' },
  { title: 'gear-foundation/dapps — 30★, 204 forks',  type: 'github',     url: 'https://github.com/gear-foundation/dapps' },
  { title: 'gear-wiki — 225★',                        type: 'docs',       url: 'https://wiki.gear.foundation' },
]

const DEFAULT_NOTES: Note[] = [
  {
    id: '1',
    title: 'why they call me chainsaw man',
    content: `started in web3 in 2017.

like denji — i don't have the cleanest approach, but i cut through the noise and i ship.

while everyone was spinning up nft stores, i was deep in substrate internals, zk proofs, and writing whitepapers that actually made sense.

chainsaw man is the one who shows up, gets his hands dirty, and gets the job done.`,
    date: '2024-01-15',
    tags: ['meta'],
  },
  {
    id: '2',
    title: 'on building defi primitives on-chain',
    content: `perp futures are the hardest thing to get right on-chain.

funding rates, liquidation engines, oracle manipulation resistance — every piece has to fit perfectly.

varaperps was my way of proving it can be done outside of ethereum, with better performance and actor-model concurrency.

the clob on vara is something most people said couldn't work. we shipped it.`,
    date: '2024-02-10',
    tags: ['defi', 'vara'],
  },
]

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useLocalStorage<T>(key: string, init: T) {
  const [val, setVal] = useState<T>(() => {
    try {
      const s = localStorage.getItem(key)
      return s ? (JSON.parse(s) as T) : init
    } catch { return init }
  })
  const set = (v: T | ((p: T) => T)) => {
    const next = v instanceof Function ? v(val) : v
    setVal(next)
    localStorage.setItem(key, JSON.stringify(next))
  }
  return [val, set] as const
}

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
    const CELL = 9
    const isTouchDevice = 'ontouchstart' in window
    const MOUSE_R = isTouchDevice ? 160 : 110
    let particles: Particle[] = []
    let W = 0, H = 0

    const rndCh = () => {
      const h = () => PT_ASCII[Math.floor(Math.random() * PT_ASCII.length)]
      const r = Math.random()
      if (r < 0.06) return '0x'      // null byte standalone
      if (r < 0.12) return h()       // single nibble
      return h() + h()               // FF, A3, BE — main style
    }

    const init = () => {
      W = wrap.offsetWidth || 800

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
      const cols = Math.floor(W / CELL)
      const rows = Math.floor(H / CELL)
      particles = []

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * CELL * W + c * CELL) * 4
          const inE = imgE[i + 3] > 64
          const inW = imgW[i + 3] > 64
          if (!inE && !inW) continue

          const tx = c * CELL + CELL / 2
          const ty = r * CELL + CELL / 2
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
      ctx.font = `${CELL - 1}px "JetBrains Mono", monospace`

      for (const p of particles) {
        // Spring to target
        p.vx += (p.tx - p.x) * 0.12
        p.vy += (p.ty - p.y) * 0.12

        // Mouse repulsion
        const dx = p.x - mouse.x, dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_R && dist > 0.5) {
          const f = ((MOUSE_R - dist) / MOUSE_R) * 9
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
        ctx.fillText(p.ch, p.x - CELL / 2, p.y + CELL / 2)
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

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousemove',  onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('touchmove',  onTouch)
      canvas.removeEventListener('touchend',   onTouchEnd)
      mo.disconnect()
    }
  }, [])

  return (
    <div ref={wrapRef} className="particle-title-wrap">
      <canvas ref={canvasRef} aria-label="Eugene Way" role="img" />
    </div>
  )
}

// ─── Terminal commands ────────────────────────────────────────────────────────

const CMD_RESPONSES: Record<string, TLine[]> = {
  help: [
    { type: 'out',   text: '  commands: help · whoami · contact · ls · clear', pause: 0 },
  ],
  whoami: [
    { type: 'out',   text: '  Eugene Way — blockchain dev / DeFi engineer', pause: 0 },
    { type: 'out',   text: '  web3 since 2017 · Madrid, Spain 🇪🇸', pause: 0 },
    { type: 'out',   text: '  // chainsaw man of web3', pause: 0 },
  ],
  contact: [
    { type: 'out',   text: '  github   : github.com/EugenWay', pause: 0 },
    { type: 'out',   text: '  email    : relax211@gmail.com', pause: 0 },
    { type: 'out',   text: '  linkedin : linkedin.com/in/eugene-way', pause: 0 },
  ],
  ls: [
    { type: 'out',   text: '  VaraPerps · CrossPing · TradingSim', pause: 0 },
  ],
  'cat status.txt': [
    { type: 'ok',    text: 'open to collab on DeFi, cross-chain & on-chain derivatives', pause: 0 },
  ],
  hack: [
    { type: 'out',   text: '  initiating hack sequence...', pause: 0 },
    { type: 'ok',    text: 'access denied. nice try though 😎', pause: 0 },
  ],
}

// ─── Terminal ─────────────────────────────────────────────────────────────────

function Terminal() {
  const [lines, setLines]     = useState<TLine[]>([])
  const [done, setDone]       = useState(false)
  const [input, setInput]     = useState('')
  const bodyRef               = useRef<HTMLDivElement>(null)
  const inputRef              = useRef<HTMLInputElement>(null)
  const userScrolled          = useRef(false)

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

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    const cmd = input.trim().toLowerCase()
    setInput('')

    const cmdLine: TLine = { type: 'cmd', text: input.trim(), pause: 0 }

    if (cmd === 'clear') {
      setLines([])
      return
    }

    const response = CMD_RESPONSES[cmd] ?? [
      { type: 'out', text: `  command not found: ${cmd} — try 'help'`, pause: 0 },
    ]
    setLines(prev => [...prev, cmdLine, ...response, { type: 'blank', text: '', pause: 0 }])
    userScrolled.current = false
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
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              style={{ width: input.length > 0 ? `${input.length}ch` : '0px' }}
            />
            <span className="block-cursor">█</span>
            {input === '' && <span className="term-hint">ask me anything...</span>}
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
  const NAV = ['about', 'experience', 'materials', 'notes']

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
          <span className="dim"> [v1]</span>
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
          <button className="btn-wallet">Connect Wallet</button>

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
          <div key={exp.org} className="exp-block">
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
        {MATERIALS.map(m => (
          <a key={m.title} href={m.url} target="_blank" rel="noreferrer" className="mat-row">
            <span className="mat-type">[{m.type}]</span>
            <span className="mat-title">{m.title}</span>
            <span className="dim mat-arr">→</span>
          </a>
        ))}
      </div>
    </section>
  )
}

// ─── Notes ────────────────────────────────────────────────────────────────────

function Notes() {
  const [notes, setNotes] = useLocalStorage<Note[]>('ew-notes', DEFAULT_NOTES)
  const [activeId, setActiveId] = useState<string | null>(notes[0]?.id ?? null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Partial<Note>>({})

  const active = notes.find(n => n.id === activeId) ?? null

  function newNote() {
    const id = Date.now().toString()
    const note: Note = { id, title: 'untitled', content: '', date: new Date().toISOString().slice(0, 10), tags: [] }
    setNotes(prev => [note, ...prev])
    setActiveId(id)
    setDraft(note)
    setEditing(true)
  }

  function save() {
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, ...draft } as Note : n))
    setEditing(false)
  }

  function del(id: string) {
    const rest = notes.filter(n => n.id !== id)
    setNotes(rest)
    setActiveId(rest[0]?.id ?? null)
    setEditing(false)
  }

  return (
    <section className="section" id="notes">
      <div className="sec-head">
        <span className="sec-label">// NOTES</span>
        <span className="dim" style={{ fontSize: '0.7rem' }}>stored in localStorage</span>
      </div>
      <div className="notes-layout">
        <div className="notes-sidebar">
          <button className="btn-new-note" onClick={newNote}>+ new note</button>
          {notes.map(n => (
            <button key={n.id} onClick={() => { setActiveId(n.id); setEditing(false) }}
              className={`note-btn ${n.id === activeId ? 'active' : ''}`}>
              <div className="nbtn-title">{n.title}</div>
              <div className="nbtn-date dim">{n.date}</div>
              {n.tags.length > 0 && (
                <div className="nbtn-tags">{n.tags.map(t => <span key={t} className="ntag">{t}</span>)}</div>
              )}
            </button>
          ))}
        </div>

        <div className="notes-pane">
          {!active && <pre className="dim" style={{ fontSize: '0.78rem' }}>{`// no note selected\n// click + new note`}</pre>}

          {active && !editing && (
            <div className="note-view">
              <div className="note-head">
                <span className="g bold">{active.title}</span>
                <span className="dim"> — {active.date}  </span>
                {active.tags.map(t => <span key={t} className="ntag">{t}</span>)}
              </div>
              <pre className="note-body">{active.content}</pre>
              <div className="note-acts">
                <button onClick={() => { setDraft({ ...active }); setEditing(true) }} className="btn btn-g">edit</button>
                <button onClick={() => del(active.id)} className="btn btn-dim">delete</button>
              </div>
            </div>
          )}

          {active && editing && (
            <div className="note-editor">
              <input className="ne-title" value={draft.title ?? ''} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="title..." />
              <input className="ne-tags" value={(draft.tags ?? []).join(', ')} onChange={e => setDraft(d => ({ ...d, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} placeholder="tags: defi, vara..." />
              <textarea className="ne-body" value={draft.content ?? ''} onChange={e => setDraft(d => ({ ...d, content: e.target.value }))} placeholder="write..." />
              <div className="note-acts">
                <button onClick={save} className="btn btn-g">:w save</button>
                <button onClick={() => setEditing(false)} className="btn btn-dim">:q cancel</button>
                <button onClick={() => del(active.id)} className="btn btn-danger">:d delete</button>
              </div>
            </div>
          )}
        </div>
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
        <Notes />
      </main>
      <footer className="footer">
        <span className="dim">// </span>eugene way © 2025
        <span className="dim"> — madrid · gear foundation</span>
        <span className="cursor"> █</span>
      </footer>
    </div>
  )
}
