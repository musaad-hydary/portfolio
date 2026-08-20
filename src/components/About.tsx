import { useState, useEffect } from "react";
import GitHubContributions from "./GitHubContributions";

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

const THEME_CLASSES = [
  "kirby-mode", "mr-robot-mode", "deus-ex-mode",
  "elio-mode", "disco-mode", "the-office-mode", "m-reds-mode",
] as const;
type ThemeClass = typeof THEME_CLASSES[number];

function getActiveTheme(): ThemeClass | null {
  for (const t of THEME_CLASSES) {
    if (document.documentElement.classList.contains(t)) return t;
  }
  return null;
}

export default function About() {
  const [activeTheme, setActiveTheme] = useState<ThemeClass | null>(getActiveTheme);
  const [rightView, setRightView] = useState<"stack" | "graph">("stack");

  useEffect(() => {
    const observer = new MutationObserver(() => setActiveTheme(getActiveTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const kirbyActive    = activeTheme === "kirby-mode";
  const mrRobotActive  = activeTheme === "mr-robot-mode";
  const deusExActive   = activeTheme === "deus-ex-mode";
  const elioActive     = activeTheme === "elio-mode";
  const discoActive    = activeTheme === "disco-mode";
  const theOfficeActive = activeTheme === "the-office-mode";
  const mRedsActive    = activeTheme === "m-reds-mode";

  function toggleKirby() {
    if (activeTheme !== null && !kirbyActive) return;
    const turningOn = !kirbyActive;
    document.documentElement.classList.toggle("kirby-mode", turningOn);
    localStorage.setItem("theme", turningOn ? "kirby" : "green");
    setActiveTheme(turningOn ? "kirby-mode" : null);
  }

  const verb = mrRobotActive ? "watch" : "play";
  const gameName = mrRobotActive
    ? "Mr. Robot"
    : theOfficeActive
      ? "Flonkerton"
      : kirbyActive
        ? "Balatro"
        : "Kirby Air Riders";
  const buttonLabel = mRedsActive ? (
    "and dream of corduroy"
  ) : discoActive ? (
    "party"
  ) : elioActive ? (
    "travel"
  ) : (
    <>
      {verb} <span className={activeTheme === null || kirbyActive ? "kirby-hint" : undefined}>{gameName}</span>
    </>
  );

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
          {deusExActive ? (
            "i never asked for this."
          ) : (
            <>
              i'm a computer engineer based in Toronto with experience in
              embedded systems and full-stack development. i like building
              things at every level of the stack, from firmware up to the user
              interface. in my free time i make lofi beats with Ableton, read
              slice-of-life novels, and{" "}
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
                {buttonLabel}
              </button>
              .
            </>
          )}
        </p>
      </div>

      {/* right side */}
      <div className="sm:pl-10">
        {/* Header row with toggle */}
        <div
          className={`flex items-center justify-between ${rightView === "stack" ? "mb-4" : "mb-2"}`}
        >
          <p
            className="text-[0.65rem] uppercase tracking-[0.15em]"
            style={{
              color: "var(--col-muted)",
              fontFamily: "DM Mono, monospace",
            }}
          >
            {rightView === "stack" ? "technologies" : "github"}
          </p>
          <div
            className="flex items-center"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--bdr)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            {(["stack", "graph"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setRightView(v)}
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "0.48rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: rightView === v ? "var(--gd)" : "var(--col-muted-hi)",
                  background: rightView === v ? "var(--c)" : "transparent",
                  border: "none",
                  borderRadius: "2px",
                  padding: "4px 9px",
                  lineHeight: 1,
                  minWidth: "36px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {rightView === "stack" ? (
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
        ) : (
          <GitHubContributions username="musaad-hydary" />
        )}
      </div>
    </div>
  );
}
