import { useState, useEffect, useRef, type ReactNode } from 'react'

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

type ChatMode = 'default' | 'review' | 'thinking' | 'proof' | 'story' | 'deeper' | 'challenge'

interface ChatSuggestion {
  label: string
  prompt: string
  mode: ChatMode
}

// ─── Terminal boot sequence ───────────────────────────────────────────────────

const SKILL_GROUPS = [
  {
    title: 'Software Engineering',
    rows: [
      { label: 'Languages', value: 'TypeScript · JavaScript · Rust · Python' },
      { label: 'Frontend', value: 'React · Vue · HTML · CSS' },
      { label: 'Backend & APIs', value: 'Node.js · REST · GraphQL · MongoDB' },
      { label: 'Engineering', value: 'Workflow automation · Event-driven systems · Simulation' },
      { label: 'Tools & testing', value: 'Git · TDD · Jest · Nginx' },
      { label: 'Technical work', value: 'Architecture · Technical leadership · Documentation · Workshops' },
    ],
  },
  {
    title: 'Blockchain & DeFi',
    rows: [
      { label: 'Contracts', value: 'Rust / Sails · Solidity · WebAssembly' },
      { label: 'Ecosystems', value: 'Gear / Vara · Vara.eth · Ethereum · Polkadot · Substrate' },
      { label: 'DeFi', value: 'Perpetual futures · CLOBs · Margin · Liquidations · Funding · Oracles' },
      { label: 'Infrastructure', value: 'Cross-chain messaging · Actor model · TypeScript relayers' },
      { label: 'Tooling', value: 'gclient · polkadot.js · Pyth' },
    ],
  },
]

const SKILL_LINES = SKILL_GROUPS.flatMap<TLine>(group => [
  { type: 'out', text: `  [${group.title}]`, pause: 150 },
  ...group.rows.map<TLine>(row => ({
    type: 'out',
    text: `  ${row.label.toLowerCase().padEnd(15)} : ${row.value}`,
    pause: 80,
  })),
  { type: 'blank', text: '', pause: 100 },
])

const BOOT: TLine[] = [
  { type: 'cmd',   text: 'init_profile --user=eugene_way --force', pause: 400 },
  { type: 'out',   text: '  loading...', pause: 200 },
  { type: 'out',   text: '  name        : Eugene Way', pause: 100 },
  { type: 'out',   text: '  role        : Software Engineer', pause: 100 },
  { type: 'out',   text: '  background  : Web apps · Workflow automation · Blockchain', pause: 100 },
  { type: 'out',   text: '  gear        : 2021–2026 · Ecosystem → Growth Tech Lead', pause: 100 },
  { type: 'out',   text: '  location    : Madrid, Spain 🇪🇸', pause: 100 },
  { type: 'out',   text: '  speaks      : Русский · Español · English', pause: 100 },
  { type: 'out',   text: '  github      : github.com/EugenWay', pause: 100 },
  { type: 'out',   text: '  email       : relax211@gmail.com', pause: 100 },
  { type: 'out',   text: '  linkedin    : linkedin.com/in/eugene-way-5b81b4188', pause: 120 },
  { type: 'ok',    text: '[OK] profile loaded — 42ms', pause: 500 },
  { type: 'blank', text: '', pause: 200 },
  { type: 'cmd',   text: 'ls ~/skills', pause: 300 },
  ...SKILL_LINES,
  { type: 'cmd',   text: 'ls ~/contracts --stat', pause: 300 },
  { type: 'out',   text: '  VaraPerps      on-chain perps · CLOB · Rust/Sails', pause: 100 },
  { type: 'out',   text: '  CrossPing      Ethereum↔Vara reference flow', pause: 100 },
  { type: 'out',   text: '  Benchmarks     Gear.exe / Vara.eth performance demos', pause: 300 },
  { type: 'blank', text: '', pause: 200 },
  { type: 'cmd',   text: 'cat status.txt', pause: 200 },
  { type: 'ok',    text: 'open to collab on software, automation & blockchain systems', pause: 400 },
  { type: 'blank', text: '', pause: 150 },
  { type: 'ok',    text: "ghost online. bring me a system — i'll tell you what breaks first.", pause: 0 },
]

const START_SUGGESTIONS: ChatSuggestion[] = [
  {
    label: 'stress-test my idea',
    prompt: 'I want to stress-test an idea. Start by asking me no more than three questions that would expose the important assumptions.',
    mode: 'review',
  },
  {
    label: 'what breaks first?',
    prompt: 'Show me how Eugene thinks. Pick one real system he built and explain the first invariant or failure mode he cared about.',
    mode: 'thinking',
  },
  {
    label: 'show one real build',
    prompt: 'Show me one real build that best reveals how Eugene works. Give me one link and tell me exactly what to inspect.',
    mode: 'proof',
  },
  {
    label: 'one true story',
    prompt: 'Tell me one verified story that reveals how Eugene thinks. Do not invent missing details.',
    mode: 'story',
  },
]

const FOLLOW_UP_SUGGESTIONS: ChatSuggestion[] = [
  {
    label: 'go deeper',
    prompt: 'Go one level deeper on your previous answer. Be concrete and name the important tradeoff.',
    mode: 'deeper',
  },
  {
    label: 'show the proof',
    prompt: 'Show the single most relevant proof for your previous answer and tell me what I should inspect.',
    mode: 'proof',
  },
  {
    label: 'challenge that',
    prompt: 'Challenge your previous answer. Which assumption could be wrong, and what would you test first?',
    mode: 'challenge',
  },
]

function renderTerminalText(text: string) {
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s<]+)/g
  const parts: ReactNode[] = []
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > cursor) parts.push(text.slice(cursor, match.index))

    const markdownLabel = match[1]
    const matchedUrl = match[2] || match[3]
    const url = matchedUrl.replace(/[),.;!?]+$/, '')
    const suffix = matchedUrl.slice(url.length)

    parts.push(
      <a key={`${match.index}-${url}`} className="term-link" href={url} target="_blank" rel="noreferrer">
        {markdownLabel || url}
      </a>
    )
    if (suffix) parts.push(suffix)
    cursor = match.index + match[0].length
  }

  if (cursor < text.length) parts.push(text.slice(cursor))
  return parts
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    period: 'Feb 2023 → Aug 2026',
    org: 'Gear Foundation',
    role: 'Growth Tech Lead (Europe)',
    items: [
      {
        text: 'Led technical work across product, frontend, backend, and external contributors: scoped features, shaped architecture, and guided implementation.',
        link: null,
      },
      {
        text: 'Built and documented Ethereum ↔ Vara reference flows with Solidity and Rust/Sails contracts and TypeScript relayers.',
        link: { label: '↗ cross-ping', url: 'https://github.com/gear-foundation/cross-ping' },
      },
      {
        text: 'Built product prototypes, performance benchmarks, and trading simulations, including perpetual futures tooling and agents interacting with Vara contracts on testnet.',
        link: null,
      },
      {
        text: 'Wrote technical documentation, whitepapers, and architecture explainers for Vara.eth, connecting protocol design to working reference applications.',
        link: { label: '↗ vara.eth', url: 'https://eth.vara.network/whitepaper' },
      },
    ],
  },
  {
    period: '2025',
    org: 'Freelance / Consulting',
    role: 'Software Developer & Consultant',
    items: [
      {
        text: 'Advised Cointelegraph Decentralization Guardians on Polkadot staking, validator setup, and a frontend dashboard.',
        link: { label: '↗ project website', url: 'https://cointelegraph-guardians.com/' },
      },
      {
        text: 'Explained consensus mechanics and validator-set operation, and guided frontend developers through client-library usage and integration.',
        link: null,
      },
    ],
  },
  {
    period: 'Aug 2021 → Jul 2023',
    org: 'Gear Technologies Inc.',
    role: 'Ecosystem Lead (Europe)',
    items: [
      {
        text: 'Built example applications, smart contracts, and demos that turned Gear/Vara protocol capabilities into working use cases for developers.',
        link: { label: '↗ examples', url: 'https://github.com/gear-foundation/dapps' },
      },
      {
        text: 'Created technical documentation and ran developer workshops, including a Gear/SubQuery indexing workshop at the Encode hackathon alongside Polkadot Decoded 2023.',
        link: { label: '↗ workshop recap', url: 'https://subquery.ghost.io/subquery-joins-polkadot-prague-polkadot-decoded/' },
      },
      {
        text: 'Contributed Vara network integration to Polkadot.js Apps and supported wallet, explorer, market data, and indexing integrations, including SubWallet, Subscan, and CoinMarketCap.',
        link: { label: '↗ Polkadot.js Apps', url: 'https://github.com/polkadot-js/apps/pull/8285' },
      },
    ],
  },
  {
    period: 'Sep 2013 → Dec 2015',
    org: 'Comindware',
    role: 'Frontend Developer',
    items: [
      {
        text: 'Developed frontend interfaces for configurable workflow automation and process tracking tools, later expanding into project management software.',
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
        title: 'What Could You Build on Vara.eth? Five Ideas Worth Stealing',
        type: 'medium',
        url: 'https://medium.com/@VaraNetwork/what-could-you-build-on-vara-eth-five-ideas-worth-stealing-d90713987923',
      },
      {
        title: 'How Robo Miner Runs in Real Time on Vara.eth',
        type: 'medium',
        url: 'https://medium.com/@VaraNetwork/how-robo-miner-runs-in-real-time-on-vara-eth-61ebefc961b0',
      },
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
        title: 'Gear & Vara at Polkadot World Madrid (2022)',
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=-lvdD7yVdME',
      },
      {
        title: 'Robo Miner (Digger) on Vara.eth demo',
        type: 'x',
        url: 'https://x.com/VaraNetwork/status/2080242009231540566',
      },
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

// ─── Gallery data ─────────────────────────────────────────────────────────────

interface GalleryItem {
  src: string
  event: string
  year?: string
  place?: string
  note?: string
}

// drop photos into public/gallery/ and list them here:
// { src: '/gallery/ethcc-2023.jpg', event: 'EthCC', year: '2023', place: 'Paris', note: 'talking Vara' },
const GALLERY: GalleryItem[] = [
  { src: '/gallery/polkadot-world-on-stage.jpg', event: 'Polkadot World', note: 'on stage' },
  { src: '/gallery/polkadot-world-community.jpg', event: 'Polkadot World', note: 'community' },
  { src: '/gallery/polkadot-decoded-vara-team.jpg', event: 'Polkadot Decoded', note: 'Vara team' },
  { src: '/gallery/event-01-vara-booth.webp', event: 'ETHGlobal', year: '2024', place: 'Brussels' },
  { src: '/gallery/event-02-stage-current-limitations.webp', event: 'Conference', year: '2024', place: 'Budapest' },
  { src: '/gallery/game-changer-brussels-2024-oracle-talk.webp', event: 'Conference', year: '2024', place: 'Budapest', note: 'oracle solutions' },
  { src: '/gallery/event-04-community.webp', event: 'ETHGlobal', year: '2024', place: 'Brussels', note: 'judges' },
  { src: '/gallery/event-05-hackathon-floor.webp', event: 'ETHGlobal', year: '2024', place: 'Brussels' },
  { src: '/gallery/ethglobal-brussels-2024-vara-demo.webp', event: 'ETHGlobal', year: '2024', place: 'Brussels' },
  { src: '/gallery/event-07-meme-token-demo.webp', event: 'Event', year: '2024', place: 'Brussels' },
  { src: '/gallery/event-08-live-coding.webp', event: 'Workshop', year: '2024', place: 'Brussels', note: 'live coding' },
  { src: '/gallery/event-09-madrid-polkadot-conference.webp', event: 'Polkadot Conference', year: '2024', place: 'Madrid' },
  { src: '/gallery/event-10-gear-protocol.webp', event: 'Polkadot Conference', year: '2024', place: 'Madrid' },
  { src: '/gallery/event-11-rust-code-walkthrough.webp', event: 'Workshop', year: '2024', place: 'Brussels' },
]

const galleryEvent = (photo: GalleryItem) => [photo.event, photo.year].filter(Boolean).join(' ')
const galleryAlt = (photo: GalleryItem) => [galleryEvent(photo), photo.place, photo.note].filter(Boolean).join(' — ')

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
        { type: 'out', text: "  still there? bring me a system — i'll tell you what breaks first." },
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
      i += 3
      setLines(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = { type: 'out', text: '  ' + text.slice(0, i) }
        return copy
      })
      if (i >= text.length) { clearInterval(iv); resolve() }
    }, 8)
  })

  const askAI = async (question: string, mode: ChatMode = 'default') => {
    setBusy(true)
    setLines(prev => [...prev, { type: 'out', text: '  ...' }])
    userScrolled.current = false
    let reply = ''
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-cw-chat': '1' },
        body: JSON.stringify({ message: question, history: history.current, mode }),
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

    if (cmd === 'clear') {
      setLines([])
      setAsked(false)
      history.current = []
      return
    }

    setLines(prev => [...prev, cmdLine])

    const print = (out: TLine[]) => {
      setLines(prev => [...prev, ...out, { type: 'blank', text: '', pause: 0 }])
      userScrolled.current = false
    }

    if (cmd === 'help') {
      print([
        { type: 'out', text: '  just talk to me — ask about my work, projects, web3, whatever.', pause: 0 },
        { type: 'out', text: '  commands: help · skills · clear · neofetch · stats · crt on|off', pause: 0 },
      ])
      return
    }

    if (cmd === 'skills' || cmd === 'ls ~/skills') {
      print(SKILL_LINES)
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
    askAI(raw, 'default')
  }

  const runSuggestion = (suggestion: ChatSuggestion) => {
    if (busy) return
    interacted.current = true
    setAsked(true)
    setLines(prev => [...prev, { type: 'cmd', text: suggestion.label, pause: 0 }])
    askAI(suggestion.prompt, suggestion.mode)
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
            {renderTerminalText(l.text)}
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
              maxLength={800}
              aria-label="Ask Eugene's terminal ghost"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              style={{ width: input.length > 0 ? `${input.length}ch` : '0px' }}
            />
            <span className="block-cursor">█</span>
            {input === '' && <span className="term-hint">{busy ? 'thinking…' : 'type skills, or ask me a question...'}</span>}
          </div>
        )}
        {done && !asked && !busy && (
          <div className="term-onboard">
            <div className="term-origin">
              <span className="term-origin-key">a CV that talks back.</span>
            </div>
            <div className="term-origin-note">
              built from Eugene's work and real conversations — bring it a system or a bad idea and see how he thinks.
            </div>
            <div className="term-suggest">
              {START_SUGGESTIONS.map(s => (
                <button key={s.label} className="term-chip"
                  onClick={e => { e.stopPropagation(); runSuggestion(s) }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {done && asked && !busy && (
          <div className="term-suggest term-suggest-followup">
            <span className="term-suggest-label">next:</span>
            {FOLLOW_UP_SUGGESTIONS.map(s => (
              <button key={s.label} className="term-chip"
                onClick={e => { e.stopPropagation(); runSuggestion(s) }}>
                {s.label}
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
  const NAV = ['about', 'experience', 'education', ...(GALLERY.length > 0 ? ['events'] : []), 'materials']

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
          <span className="dim"> [v1.3.1]</span>
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
            <span className="pulse-dot" /> Software Engineer
          </div>
          <ParticleTitle />
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
          Before Web3, I worked in frontend development and workflow automation.
          At Gear, from 2021 to 2026, my work grew from developer tools and ecosystem
          examples into product development and technical leadership.
        </p>
        <p>
          Blockchain and DeFi are where I've gone deepest: Rust and Solidity
          contracts, order books, perpetual futures, cross-chain messaging, and
          market simulations. I also write the docs and explain how the pieces fit
          together, whether that's in a whitepaper or a room full of developers.
        </p>
        <p>
          I like moving between investigation, implementation, and explanation.
          Give me an unfamiliar problem, let me figure it out, and
          <span className="g"> build something real out of it</span>.
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

// ─── Education ────────────────────────────────────────────────────────────────

function Education() {
  return (
    <section className="section" id="education" aria-labelledby="education-heading">
      <div className="sec-head">
        <h2 className="sec-label" id="education-heading">// EDUCATION</h2>
      </div>
      <article className="education-card" aria-labelledby="education-school">
        <div className="education-bar">
          <span className="education-label"><span className="education-marker" aria-hidden="true" /> Academic foundation</span>
          <span className="education-period">[2006 — 2012]</span>
        </div>
        <div className="education-main">
          <div className="education-qualification">
            <h3 className="education-school" id="education-school">Moscow Aviation Institute</h3>
            <p className="education-university">National Research University</p>
            <p className="education-degree">Engineer's degree in Aerodynamics</p>
            <span className="education-completed"><span aria-hidden="true">✓</span> Degree completed</span>
          </div>
          <figure className="education-figure">
            <svg className="education-flow" viewBox="0 0 300 170" role="img" aria-labelledby="flow-title">
              <title id="flow-title">Schematic streamlines around an airfoil</title>
              <defs>
                <pattern id="flow-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 H 0 V 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="300" height="170" fill="url(#flow-grid)" className="flow-grid" />
              <g className="flow-guides" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M10 28 C80 28 95 17 145 20 S230 30 290 28" />
                <path d="M10 49 C70 49 85 29 132 33 S220 52 290 49" />
                <path d="M10 70 C60 70 78 39 127 46 S220 75 290 70" />
                <path d="M10 91 C55 91 72 125 132 117 S230 91 290 91" />
                <path d="M10 112 C70 112 83 143 142 136 S230 112 290 112" />
                <path d="M10 137 C85 137 108 158 161 151 S230 137 290 137" />
              </g>
              <path className="flow-airfoil" d="M76 86 C84 54 135 48 233 85 C159 97 99 107 76 86Z" />
              <path className="flow-chord" d="M76 86 L233 85" />
              <g className="flow-arrows" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 66 L25 70 L19 74 M19 108 L25 112 L19 116" />
                <path d="M275 66 L281 70 L275 74 M275 108 L281 112 L275 116" />
              </g>
              <g className="flow-points" fill="currentColor">
                <circle cx="76" cy="86" r="2.5" />
                <circle cx="233" cy="85" r="2.5" />
              </g>
            </svg>
          </figure>
        </div>
        <div className="education-fields" aria-label="Areas of study">
          <div className="education-field">
            <span className="education-field-index" aria-hidden="true">[01]</span>
            <h4>Aerodynamics</h4>
            <p>High-speed flow<br />Gas dynamics</p>
          </div>
          <div className="education-field">
            <span className="education-field-index" aria-hidden="true">[02]</span>
            <h4>Fluid mechanics</h4>
            <p>Hydrodynamics<br />Fluid behavior</p>
          </div>
          <div className="education-field">
            <span className="education-field-index" aria-hidden="true">[03]</span>
            <h4>Numerical modeling</h4>
            <p>Numerical methods<br />Mathematical models</p>
          </div>
        </div>
      </article>
    </section>
  )
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

function Gallery() {
  const [open, setOpen] = useState<number | null>(null)
  const stripRef  = useRef<HTMLDivElement>(null)
  const paused    = useRef(false)
  const dragging  = useRef(false)
  const drag      = useRef({ startX: 0, startLeft: 0, moved: false })

  // Auto-drift: the strip slowly rolls; content is doubled, so wrap at half for a seamless loop
  useEffect(() => {
    const el = stripRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf: number
    const tick = () => {
      if (!paused.current && !dragging.current) {
        el.scrollLeft += 0.5
        const half = el.scrollWidth / 2
        if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Lightbox keyboard — single listener for the component's lifetime
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      setOpen(o => {
        if (o === null) return o
        if (e.key === 'Escape')     return null
        if (e.key === 'ArrowRight') return (o + 1) % GALLERY.length
        if (e.key === 'ArrowLeft')  return (o - 1 + GALLERY.length) % GALLERY.length
        return o
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Lock page scroll while the lightbox is open
  useEffect(() => {
    document.body.style.overflow = open === null ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Mouse drag to scroll; touch scrolls natively
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !stripRef.current) return
    dragging.current = true
    drag.current = { startX: e.clientX, startLeft: stripRef.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || e.pointerType !== 'mouse' || !stripRef.current) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    stripRef.current.scrollLeft = drag.current.startLeft - dx
  }
  const endDrag = () => { dragging.current = false }

  const items = [...GALLERY, ...GALLERY]
  const item  = open === null ? null : GALLERY[open]

  return (
    <section className="section" id="events">
      <div className="sec-head">
        <span className="sec-label">// EVENTS</span>
        <span className="dim">field evidence — talks, conferences, hackathons</span>
      </div>
      <div className="gal-strip-wrap">
        <div
          ref={stripRef}
          className="gal-strip"
          onMouseEnter={() => { paused.current = true }}
          onMouseLeave={() => { paused.current = false; endDrag() }}
          onTouchStart={() => { paused.current = true }}
          onTouchEnd={() => { setTimeout(() => { paused.current = false }, 2500) }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {items.map((p, i) => (
            <figure key={i} className="gal-cell"
              onClick={() => { if (!drag.current.moved) setOpen(i % GALLERY.length) }}>
              <img src={p.src} alt={galleryAlt(p)} loading="lazy" draggable={false} />
              <figcaption className="gal-cell-cap">
                <span className="gal-tag">[{galleryEvent(p).toLowerCase()}]</span> {p.place || p.note}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {item && (
        <div className="gal-lb" onClick={() => setOpen(null)}>
          <button className="gal-lb-close" onClick={() => setOpen(null)} aria-label="close">✕</button>
          {GALLERY.length > 1 && (
            <button className="gal-lb-nav gal-lb-prev" aria-label="previous"
              onClick={e => { e.stopPropagation(); setOpen(o => o === null ? o : (o - 1 + GALLERY.length) % GALLERY.length) }}>
              ‹
            </button>
          )}
          <img src={item.src} alt={galleryAlt(item)} onClick={e => e.stopPropagation()} />
          {GALLERY.length > 1 && (
            <button className="gal-lb-nav gal-lb-next" aria-label="next"
              onClick={e => { e.stopPropagation(); setOpen(o => o === null ? o : (o + 1) % GALLERY.length) }}>
              ›
            </button>
          )}
          <div className="gal-lb-cap" onClick={e => e.stopPropagation()}>
            <span className="gal-tag">[{galleryEvent(item).toLowerCase()}]</span> {item.place}
            {item.note ? <span className="dim"> — {item.note}</span> : null}
            <span className="dim gal-lb-count"> · {(open as number) + 1}/{GALLERY.length}</span>
          </div>
        </div>
      )}
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

// ─── 404 ──────────────────────────────────────────────────────────────────────

function NotFound({ path }: { path: string }) {
  useEffect(() => { document.title = '404 // no such file' }, [])
  return (
    <div className="app">
      <div className="noise" />
      <div className="nf-wrap">
        <div className="term-wrap nf-term">
          <div className="term-bar">
            <div className="term-dots"><span /><span /><span /></div>
            <span className="term-title">bash — eugene@way:~</span>
            <span className="term-status"><span className="pulse-dot" /> ONLINE</span>
          </div>
          <div className="term-body nf-body">
            <div className="tl tl-cmd"><span className="tl-prompt">eugene@way:~$ </span>cat {path}</div>
            <div className="tl tl-out">  cat: {path}: No such file or directory</div>
            <div className="tl tl-blank" />
            <div className="tl tl-out">  error 404 — this path never shipped.</div>
            <div className="tl tl-blank" />
            <div className="tl tl-cmd">
              <span className="tl-prompt">eugene@way:~$ </span>
              <a className="nf-home" href="/">cd ~</a>
              <span className="block-cursor"> █</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const path = window.location.pathname
  if (path !== '/' && path !== '/index.html') return <NotFound path={path} />
  return (
    <div className="app">
      <div className="noise" />
      <Header />
      <Hero />
      <main className="container">
        <About />
        <Experience />
        <Education />
        {GALLERY.length > 0 && <Gallery />}
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
