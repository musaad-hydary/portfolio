import { useEffect } from "react";

export default function Feed() {
  useEffect(() => {
    window.location.href = "https://musaadh.substack.com/feed";
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--gd)", color: "var(--c)" }}
    >
      <p
        style={{
          fontFamily: "DM Mono, monospace",
          fontSize: "0.7rem",
          color: "var(--cd)",
        }}
      >
        redirecting to feed...
      </p>
    </div>
  );
}
