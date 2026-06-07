export default function Hero() {
  return (
    <div
      className="flex flex-col py-6 border-b sm:grid sm:gap-0"
      style={{
        borderColor: "rgba(224,217,188,0.1)",
        gridTemplateColumns: "1fr 220px",
      }}
    >
      {/* left side */}
      <div className="flex flex-col gap-4 sm:pr-12">
        <h1
          style={{
            fontFamily: "Dreamer, serif",
            color: "var(--c)",
            fontSize: "clamp(3rem, 6vw, 5rem)",
            lineHeight: 1,
            letterSpacing: "0.04em",
          }}
        >
          musaad hydary
        </h1>

        <span
          style={{
            fontFamily: "DM Mono, monospace",
            color: "var(--cd)",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            fontWeight: 300,
          }}
        >
          computer engineer & music producer
        </span>

        <span
          style={{
            fontFamily: "DM Mono, monospace",
            color: "rgba(224,217,188,0.3)",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
          }}
        >
          toronto
        </span>
      </div>

      {/* right side — gif, hidden on mobile */}
      <div className="hidden sm:flex items-start justify-center">
        <img
          src="/cpu.gif"
          alt="splash"
          style={{
            width: "70%",
            height: "auto",
            imageRendering: "pixelated",
            filter: "sepia(0.4) brightness(0.8)",
            marginTop: "-1rem",
          }}
        />
      </div>
    </div>
  );
}
