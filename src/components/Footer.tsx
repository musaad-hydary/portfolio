import { Link } from "react-router-dom";

const external = [
  { label: "github",   href: "https://github.com/musaad-hydary"    },
  { label: "linkedin", href: "https://linkedin.com/in/musaadhydary" },
  { label: "substack", href: "https://substack.com/@musaadh/posts"  },
];

const linkStyle = {
  color: "var(--cd)" as const,
  fontFamily: "DM Mono, monospace",
};

const cls = "text-[0.55rem] tracking-wider transition-colors duration-150";

export default function Footer() {
  return (
    <div className="flex justify-between items-center py-6">
      <p
        className="text-[0.55rem] tracking-wider"
        style={{ color: "var(--col-ghost)", fontFamily: "DM Mono, monospace" }}
      >
        © musaad hydary
      </p>
      <div className="flex gap-6">
        {external.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className={cls}
            style={linkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cd)")}
          >
            {l.label}
          </a>
        ))}
        <Link
          to="/music"
          className={cls}
          style={linkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cd)")}
        >
          music
        </Link>
      </div>
    </div>
  );
}
