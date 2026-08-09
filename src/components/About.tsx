const STACK = [
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "C/C++",
  "Java",
  "HTML5",
  "Tailwind CSS",
  "SQL",
  "Verilog",
  "React",
  "React Native",
  "GraphQL",
  "Redux",
  "Docker",
  "Kubernetes",
  "Arduino",
  "Figma",
];

export default function About() {
  return (
    <div
      className="flex flex-col gap-8 py-12 border-b sm:grid sm:gap-0"
      style={{
        borderColor: "rgba(224,217,188,0.1)",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      {/* left side */}
      <div
        className="sm:border-r sm:pr-10"
        style={{ borderColor: "rgba(224,217,188,0.07)" }}
      >
        <p
          className="text-[0.65rem] uppercase tracking-[0.15em] mb-4"
          style={{
            color: "rgba(224,217,188,0.3)",
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
          time i make lofi beats with Ableton, read slice-of-life novels, and
          play Kirby Air Riders.
        </p>
      </div>

      {/* right side */}
      <div className="sm:pl-10">
        <p
          className="text-[0.65rem] uppercase tracking-[0.15em] mb-4"
          style={{
            color: "rgba(224,217,188,0.3)",
            fontFamily: "DM Mono, monospace",
          }}
        >
          stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {STACK.map((s) => (
            <span
              key={s}
              className="text-[0.58rem] tracking-wider px-2.5 py-1 border cursor-default transition-all duration-150"
              style={{
                color: "var(--cd)",
                borderColor: "rgba(224,217,188,0.1)",
                fontFamily: "DM Mono, monospace",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--c)";
                e.currentTarget.style.borderColor = "rgba(224,217,188,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--cd)";
                e.currentTarget.style.borderColor = "rgba(224,217,188,0.1)";
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
