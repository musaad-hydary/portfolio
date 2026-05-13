import { Link } from 'react-router-dom'

const links = [
  { label: 'github', href: 'https://github.com/musaad-hydary', external: true, icon: 'gh' },
  { label: 'linkedin', href: 'https://linkedin.com/in/musaad-hydary', external: true, icon: 'in' },
  { label: 'resume', href: '/resume.pdf', external: true, icon: 'cv' },
  { label: 'contact', href: 'mailto:musaadhydary@gmail.com', external: false, icon: '@' },
]

export default function Nav() {
  return (
    <nav
      className="flex justify-between items-center py-6 border-b"
      style={{ borderColor: 'rgba(224,217,188,0.1)' }}
    >
      {/* text logo — hidden on mobile */}
      <Link
        to="/"
        className="hidden sm:block"
        style={{ fontFamily: 'Dreamer, serif', color: 'var(--c)', fontSize: '1.4rem', letterSpacing: '0.01em' }}
      >
        m
      </Link>

      {/* gif logo — mobile only */}
      <Link to="/" className="block sm:hidden">
        <img
          src="/cpu.gif"
          alt="logo"
          style={{ width: '42px', height: 'auto', imageRendering: 'pixelated', filter: 'sepia(0.4) brightness(0.8)' }}
        />
      </Link>

      <div className="flex items-center gap-6">
        {links.map(l => (
          <a
            key={l.label}
            href={l.href}
            target={l.external ? '_blank' : undefined}
            rel={l.external ? 'noreferrer' : undefined}
            className="transition-colors duration-150"
            style={{ color: 'var(--cd)', fontFamily: 'DM Mono, monospace' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--c)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--cd)')}
          >
            {/* icon — mobile only */}
            <span className="block sm:hidden text-[0.7rem] tracking-wider">
              {l.icon}
            </span>
            {/* text — desktop only */}
            <span className="hidden sm:block text-[0.65rem] uppercase tracking-[0.13em]">
              {l.label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  )
}
