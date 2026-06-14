import { useState } from "react";
import { Link } from "react-router-dom";
import ContactModal from "./ContactModal";

const pointerCursor = "url('/cursor-pointer.png') 0 0, pointer";

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
  {
    label: "substack",
    href: "https://substack.com/@musaadh/posts",
    external: true,
    icon: "SS",
  },
  {
    label: "resume",
    href: "/musaadhydary-resume.pdf",
    external: true,
    icon: "CV",
  },
];

export default function Nav() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 z-50 border-b w-full"
        style={{
          borderColor: "rgba(224,217,188,0.1)",
          background: "var(--gd)",
        }}
      >
        <div className="max-w-[800px] mx-auto px-7 flex justify-between items-center py-6">
          {/* Text logo — hidden on mobile */}
          <Link
            to="/"
            className="hidden sm:block"
            style={{
              fontFamily: "Dreamer, serif",
              color: "var(--c)",
              fontSize: "1.4rem",
              letterSpacing: "0.01em",
              cursor: pointerCursor,
            }}
          >
            m
          </Link>

          {/* Gif logo — mobile only */}
          <Link
            to="/"
            className="block sm:hidden"
            style={{ cursor: pointerCursor }}
          >
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
                target="_blank"
                rel="noreferrer"
                className="transition-colors duration-150"
                style={{
                  color: "var(--cd)",
                  fontFamily: "DM Mono, monospace",
                  cursor: pointerCursor,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c)")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--cd)")
                }
              >
                <span className="block sm:hidden text-[0.7rem] tracking-wider">
                  {l.icon}
                </span>
                <span className="hidden sm:block text-[0.65rem] uppercase tracking-[0.13em]">
                  {l.label}
                </span>
              </a>
            ))}

            {/* Contact button — opens modal */}
            <button
              onClick={() => setModalOpen(true)}
              className="transition-colors duration-150"
              style={{
                color: "var(--cd)",
                fontFamily: "DM Mono, monospace",
                background: "transparent",
                border: "none",
                cursor: pointerCursor,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cd)")}
            >
              <span className="block sm:hidden text-[0.7rem] tracking-wider">
                @
              </span>
              <span className="hidden sm:block text-[0.65rem] uppercase tracking-[0.13em]">
                contact
              </span>
            </button>
          </div>
        </div>
      </nav>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
