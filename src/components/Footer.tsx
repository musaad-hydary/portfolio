export default function Footer() {
  return (
    <div className="flex justify-between items-center py-6">
      <p
        className="text-[0.55rem] tracking-wider"
        style={{
          color: "rgba(224,217,188,0.2)",
          fontFamily: "DM Mono, monospace",
        }}
      >
        © musaad hydary
      </p>
      <div className="flex gap-6">
        {[
          { label: "github", href: "https://github.com/musaad-hydary" },
          { label: "linkedin", href: "https://linkedin.com/in/musaadhydary" },
          { label: "contact", href: "mailto:musaadhydary@gmail.com" },
        ].map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="text-[0.55rem] tracking-wider transition-colors duration-150"
            style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cd)")}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
