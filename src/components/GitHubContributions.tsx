import { useEffect, useState } from "react";

interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  color?: string;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const GAP = 2;
const GRID_H = 88;

// Derive level from the color hex the API scrapes from GitHub's visual graph.
// The `level` field is 0 for private contributions; `color` is always correct.
function hexToLevel(color: string | undefined): 0 | 1 | 2 | 3 | 4 {
  if (!color || color === "#ebedf0" || color === "#161b22") return 0;
  const g = parseInt(color.slice(3, 5), 16);
  if (g >= 200) return 1;
  if (g >= 150) return 2;
  if (g >= 100) return 3;
  return 4;
}

function cellColor(day: Day) {
  const level = hexToLevel(day.color) || Number(day.level);
  if (level === 0) return "var(--bg-dim)";
  const opacity = [0, 0.35, 0.55, 0.75, 0.95][level];
  return `rgba(var(--canvas-rgb),${opacity})`;
}

async function fetchYear(username: string, year: number) {
  const r = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`);
  if (!r.ok) throw new Error(r.statusText);
  const data = await r.json();
  return data as { total: Record<string, number>; contributions: Day[] };
}

export default function GitHubContributions({ username }: { username: string }) {
  const [flatDays, setFlatDays] = useState<(Day | null)[]>([]);
  const [numWeeks, setNumWeeks] = useState(0);
  const [monthLabels, setMonthLabels] = useState<{ label: string; col: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const year = new Date().getFullYear();

    fetchYear(username, year)
      .then(async (data) => {
        let contribs = data.contributions ?? [];
        let apiTotal = data.total?.[year] ?? 0;

        // Fall back to previous year if no activity
        const hasActivity = contribs.some((c) => c.level > 0 || c.count > 0);
        if (!hasActivity) {
          const prev = await fetchYear(username, year - 1);
          contribs = prev.contributions ?? [];
          apiTotal = prev.total?.[year - 1] ?? 0;
        }

        setTotal(apiTotal);

        // Filter to last 90 calendar days, never beyond today
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        const cutoff = new Date(today);
        cutoff.setDate(cutoff.getDate() - 89);
        const cutoffStr = cutoff.toISOString().split("T")[0];
        const slice = contribs.filter((c) => c.date >= cutoffStr && c.date <= todayStr);

        // Pad to Sunday
        const startPad = new Date(slice[0].date).getDay();
        const padded: (Day | null)[] = [...Array(startPad).fill(null), ...slice];

        // Chunk into week columns
        const weeks: (Day | null)[][] = [];
        for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
        const last = weeks[weeks.length - 1];
        while (last.length < 7) last.push(null);

        setNumWeeks(weeks.length);

        // Month labels
        const labels: { label: string; col: number }[] = [];
        let lastMonth = -1;
        weeks.forEach((week, wi) => {
          const first = week.find((d) => d !== null);
          if (!first) return;
          const m = new Date(first.date).getMonth();
          if (m !== lastMonth) {
            labels.push({ label: MONTHS[m], col: wi });
            lastMonth = m;
          }
        });
        setMonthLabels(labels);
        setFlatDays(weeks.flat());
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return <div className="skeleton" style={{ width: "100%", height: GRID_H + 24, borderRadius: 2 }} />;
  }

  if (error) {
    return (
      <p style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace", fontSize: "0.65rem" }}>
        could not load contributions
      </p>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <p style={{
        color: "var(--cd)",
        fontFamily: "DM Mono, monospace",
        fontSize: "0.55rem",
        marginBottom: "0.5rem",
        marginTop: 0,
      }}>
        {total} contributions · last 90 days
      </p>

      <div style={{ position: "relative", height: 10, marginBottom: 3 }}>
        {monthLabels.map(({ label, col }) => (
          <span
            key={label}
            style={{
              position: "absolute",
              left: `${(col / numWeeks) * 100}%`,
              fontFamily: "DM Mono, monospace",
              fontSize: "0.42rem",
              color: "var(--col-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        ))}
      </div>

      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "grid",
          gridTemplateRows: "repeat(7, 1fr)",
          gridAutoFlow: "column",
          gridAutoColumns: "1fr",
          gap: GAP,
          width: "100%",
          height: GRID_H,
          textDecoration: "none",
        }}
      >
        {flatDays.map((day, i) => (
          <div
            key={i}
            title={day ? `${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}` : ""}
            style={{
              borderRadius: 2,
              background: day ? cellColor(day) : "transparent",
              cursor: "inherit",
            }}
          />
        ))}
      </a>
    </div>
  );
}
