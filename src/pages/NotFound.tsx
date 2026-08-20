import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-7"
      style={{ background: 'var(--gd)', color: 'var(--c)' }}
    >
      <img
        src="/cpu.gif"
        alt="cpu"
        style={{ width: '120px', height: 'auto', imageRendering: 'pixelated', filter: 'sepia(0.4) brightness(0.8)', marginBottom: '2rem' }}
      />

      <h1
        style={{ fontFamily: 'Dreamer, serif', color: 'var(--c)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1, letterSpacing: '0.04em' }}
        className="mb-8"
      >
        page not found.
      </h1>

      <Link
        to="/"
        className="text-[0.62rem] uppercase tracking-widest px-4 py-2 border transition-all duration-150"
        style={{ borderColor: 'var(--col-ghost)', color: 'var(--cd)', background: 'transparent', fontFamily: 'DM Mono, monospace', textDecoration: 'none', display: 'inline-block' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c)'; e.currentTarget.style.color = 'var(--c)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--col-ghost)'; e.currentTarget.style.color = 'var(--cd)' }}
      >
        back to home
      </Link>
    </div>
  )
}