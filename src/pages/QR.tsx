import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

const options = [
  { label: "portfolio", value: "https://musaadhydary.com" },
  { label: "linkedin", value: "https://linkedin.com/in/musaad-hydary" },
  { label: "github", value: "https://github.com/musaad-hydary" },
  { label: "substack", value: "https://musaadh.substack.com" },
];

function useThemeColors() {
  const read = () => ({
    bg: getComputedStyle(document.documentElement).getPropertyValue("--gd").trim(),
    fg: getComputedStyle(document.documentElement).getPropertyValue("--c").trim(),
  });

  const [colors, setColors] = useState(read);

  useEffect(() => {
    const observer = new MutationObserver(() => setColors(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return colors;
}

export default function QRPage() {
  const [active, setActive] = useState(0);
  const { bg, fg } = useThemeColors();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8"
      style={{ background: "var(--gd)", color: "var(--c)" }}
    >
      <div className="flex flex-col items-center gap-10 w-full max-w-[320px]">
        {/* Name — links home */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            cursor: "url('/cursor-pointer.png') 0 0, pointer",
          }}
        >
          <h1
            style={{
              fontFamily: "Dreamer, serif",
              color: "var(--c)",
              fontSize: "clamp(3rem, 12vw, 6rem)",
              lineHeight: 1,
              letterSpacing: "0.06em",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            musaad hydary
          </h1>
        </Link>

        {/* Toggle */}
        <div className="flex gap-4 flex-wrap justify-center">
          {options.map((o, i) => (
            <button
              key={o.label}
              onClick={() => setActive(i)}
              className="text-[0.6rem] uppercase tracking-widest pb-1 transition-all duration-150"
              style={{
                fontFamily: "DM Mono, monospace",
                color: active === i ? "var(--c)" : "var(--col-muted)",
                background: "transparent",
                border: "none",
                borderBottom:
                  active === i ? "1px solid var(--c)" : "1px solid transparent",
                cursor: "url('/cursor-pointer.png') 0 0, pointer",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* QR Code */}
        <div
          style={{
            background: bg,
            padding: "1.5rem",
            borderRadius: "2px",
          }}
        >
          <QRCodeSVG
            value={options[active].value}
            size={220}
            bgColor={bg}
            fgColor={fg}
            level="H"
          />
        </div>

        {/* URL */}
        <p
          className="text-[0.6rem] tracking-widest text-center"
          style={{
            color: "var(--col-muted-hi)",
            fontFamily: "DM Mono, monospace",
          }}
        >
          {options[active].value.replace("https://", "")}
        </p>
      </div>
    </div>
  );
}
