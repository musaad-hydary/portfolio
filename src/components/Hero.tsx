export default function Hero() {
  return (
    <div
      className="grid py-6 border-b"
      style={{
        gridTemplateColumns: "1fr 220px",
        borderColor: "rgba(224,217,188,0.1)",
      }}
    >
      {/* left side (name) */}
      <div className="flex flex-col gap-6 pr-12">
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

        {/* description (roles) */}
        <div className="flex flex-col gap-1">
          <span
            style={{
              fontFamily: "DM Mono, monospace",
              color: "var(--cd)",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              fontWeight: 300,
            }}
          >
            computer engineer, software dev, & music producer
          </span>
        </div>
      </div>

      {/* right side (spinner) */}
      <div
        className="flex items-start justify-center"
        style={{ width: "220px" }}
      >
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
