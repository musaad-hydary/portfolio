import { Link } from "react-router-dom";

const links = [
  {
    label: "github",
    href: "https://github.com/musaad-hydary",
    external: true,
  },
  {
    label: "linkedin",
    href: "https://linkedin.com/in/musaadhydary",
    external: true,
  },
  { label: "resume", href: "/resume.pdf", external: true },
  { label: "contact", href: "mailto:musaadhydary@gmail.com", external: false },
];

export default function Nav() {
  return (
    <nav
      className="flex justify-between items-center py-6 border-b"
      style={{ borderColor: "rgba(224,217,188,0.1)" }}
    >
      <Link
        to="/"
        style={{
          fontFamily: "Dreamer, serif",
          color: "var(--c)",
          fontSize: "1.4rem",
          letterSpacing: "0.01em",
        }}
      >
        m
      </Link>

      <div className="flex items-center gap-6">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.external ? "_blank" : undefined}
            rel={l.external ? "noreferrer" : undefined}
            className="text-[0.65rem] uppercase tracking-[0.13em] transition-opacity duration-150"
            style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cd)")}
          >
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
