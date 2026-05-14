import { Link } from "react-router-dom";

const links = [
  {
    label: "github",
    href: "https://github.com/musaad-hydary",
    external: true,
    icon: "GH",
  },
  {
    label: "linkedin",
    href: "https://linkedin.com/in/musaad-hydary",
    external: true,
    icon: "IN",
  },
  { label: "resume", href: "/resume.pdf", external: true, icon: "CV" },
  {
    label: "contact",
    href: "mailto:musaadhydary@gmail.com",
    external: false,
    icon: "@",
  },
];

export default function Nav() {
  return (
    <nav
      className="fixed top-0 z-50 border-b w-full"
      style={{ borderColor: "rgba(224,217,188,0.1)", background: "var(--gd)" }}
    >
      <div className="max-w-[800px] mx-auto px-7 flex justify-between items-center py-6">
        {/* text logo — hidden on mobile */}
        <Link
          to="/"
          className="hidden sm:block"
          style={{
            fontFamily: "Dreamer, serif",
            color: "var(--c)",
            fontSize: "1.4rem",
            letterSpacing: "0.01em",
          }}
        >
          m
        </Link>

        {/* gif logo — mobile only */}
        <Link to="/" className="block sm:hidden">
          <img
            src="/cpu.gif"
            alt="logo"
            style={{
              width: "42px",
              height: "auto",
              imageRendering: "pixelated",
              filter: "sepia(0.4) brightness(0.8)",
            }}
          />
        </Link>

        <div className="flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noreferrer" : undefined}
              className="transition-colors duration-150"
              style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cd)")}
            >
              <span className="block sm:hidden text-[0.7rem] tracking-wider">
                {l.icon}
              </span>
              <span className="hidden sm:block text-[0.65rem] uppercase tracking-[0.13em]">
                {l.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
