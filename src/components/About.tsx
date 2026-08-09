import { useState } from "react";

const STACK = [
  // Languages
  "TypeScript",
  "JavaScript",
  "Python",
  "C",
  "C++",
  "Java",
  "SQL",

  // Frontend
  "React",
  "React Native",
  "HTML5",
  "Tailwind CSS",
  "Redux",

  // Backend
  "Node.js",
  "GraphQL",

  // DevOps & Tools
  "Docker",
  "Kubernetes",

  // Hardware & Design
  "Arduino",
  "Figma",
];

export default function About() {
  const [kirbyActive, setKirbyActive] = useState(
    () => document.documentElement.classList.contains("kirby-mode")
  );

  function toggleKirby() {
    const next = !kirbyActive;
    document.documentElement.classList.toggle("kirby-mode", next);
    localStorage.setItem("theme", next ? "kirby" : "green");
    setKirbyActive(next);
  }

  const gameName = kirbyActive ? "Balatro" : "Kirby Air Riders";

  return (
    <div
      className="flex flex-col gap-8 py-12 border-b sm:grid sm:gap-0"
      style={{
        borderColor: "var(--bdr)",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      {/* left side */}
      <div
        className="sm:border-r sm:pr-10"
        style={{ borderColor: "var(--bdr-faint)" }}
      >
        <p
          className="text-[0.65rem] uppercase tracking-[0.15em] mb-4"
          style={{
            color: "var(--col-muted)",
            fontFamily: "DM Mono, monospace",
          }}
        >
          about
        </p>
        <p
          style={{
            fontFamily: "DM Mono, monospace",
            color: "var(--cd)",
            fontSize: "0.7rem",
            lineHeight: 1.6,
          }}
        >
          i'm a computer engineer based in Toronto with experience in embedded
          systems and full-stack development. i like building things at every
          level of the stack, from firmware up to the user interface. in my free
          time i make lofi beats with Ableton, read slice-of-life novels, and{" "}
          <button
            onClick={toggleKirby}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: "DM Mono, monospace",
              fontSize: "inherit",
              color: "var(--cd)",
              display: "inline",
            }}
          >
            play <span className="kirby-hint">{gameName}</span>
          </button>
          .
        </p>
      </div>

      {/* right side */}
      <div className="sm:pl-10">
        <p
          className="text-[0.65rem] uppercase tracking-[0.15em] mb-4"
          style={{
            color: "var(--col-muted)",
            fontFamily: "DM Mono, monospace",
          }}
        >
          tech stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {STACK.map((s) => (
            <span
              key={s}
              className="text-[0.58rem] tracking-wider px-2.5 py-1 border cursor-default transition-all duration-150"
              style={{
                color: "var(--cd)",
                borderColor: "var(--bdr)",
                fontFamily: "DM Mono, monospace",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--c)";
                e.currentTarget.style.borderColor = "var(--col-muted)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--cd)";
                e.currentTarget.style.borderColor = "var(--bdr)";
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
