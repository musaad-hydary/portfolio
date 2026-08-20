import { useEffect, useMemo, useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import { fetchPosts } from "../utils/rss";
import type { SubstackPost } from "../utils/rss";
import ProjectRow from "./ProjectRow";
import WebGraph from "./WebGraph";

const INITIAL_COUNT = 5;
const LOAD_MORE_COUNT = 5;
const DESIGN_INITIAL = 5;
const FILTERS = ["all", "engineering", "music"] as const;
type Filter = (typeof FILTERS)[number];
type View = "list" | "design";

const pointerCursor = "url('/cursor-pointer.png') 8 1, pointer";

const ALL_THEME_CLASSES = [
  "mr-robot-mode", "deus-ex-mode", "elio-mode",
  "disco-mode", "the-office-mode", "m-reds-mode", "kirby-mode",
] as const;
type ThemeClass = typeof ALL_THEME_CLASSES[number];

const THEME_TRIGGERS: { cmd: string; cls: ThemeClass; storage: string | null }[] = [
  { cmd: "mr robot",   cls: "mr-robot-mode",   storage: "mr-robot"   },
  { cmd: "deus ex",    cls: "deus-ex-mode",     storage: "deus-ex"    },
  { cmd: "elio",       cls: "elio-mode",        storage: "elio"       },
  { cmd: "disco",      cls: "disco-mode",       storage: null         },
  { cmd: "the office", cls: "the-office-mode",  storage: "the-office" },
  { cmd: "m-reds",     cls: "m-reds-mode",      storage: "m-reds"     },
];

function getActiveThemeFromDOM(): ThemeClass | null {
  for (const t of ALL_THEME_CLASSES) {
    if (document.documentElement.classList.contains(t)) return t;
  }
  return null;
}

function matchesQuery(p: SubstackPost, q: string): boolean {
  return (
    p.title.toLowerCase().includes(q) ||
    (q.length >= 3 && p.plainContent.toLowerCase().includes(q))
  );
}

function SkeletonRow() {
  return (
    <div
      className="grid items-center border-b"
      style={{
        gridTemplateColumns: "64px 52px 1fr auto",
        borderColor: "var(--bdr-faint)",
      }}
    >
      {/* thumbnail — same 64×52 with border-r */}
      <div
        className="skeleton border-r"
        style={{ width: 64, height: 52, borderColor: "var(--bdr-faint)" }}
      />

      {/* number — matches text-[0.52rem] centered */}
      <div className="flex justify-center">
        <div className="skeleton" style={{ width: 14, height: 8, borderRadius: 1 }} />
      </div>

      {/* title + description — mirrors px-4 py-4 + mb-1.5 spacing */}
      <div className="px-4 py-4">
        <div className="skeleton mb-1.5" style={{ width: "55%", height: 14, borderRadius: 1 }} />
        <div className="skeleton" style={{ width: "35%", height: 9, borderRadius: 1 }} />
      </div>

      {/* arrow — invisible ↗ holds the auto column width */}
      <span className="pr-4 text-sm" style={{ opacity: 0 }}>↗</span>
    </div>
  );
}

export default function ProjectList() {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("list");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [designVisible, setDesignVisible] = useState(DESIGN_INITIAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMobile = useIsMobile();
  const [activeTheme, setActiveTheme] = useState<ThemeClass | null>(getActiveThemeFromDOM);
  const [discoHue, setDiscoHue] = useState(0);

  useEffect(() => {
    fetchPosts()
      .then((data) => { setPosts(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => setActiveTheme(getActiveThemeFromDOM()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handler = (e: Event) => setDiscoHue((e as CustomEvent).detail);
    window.addEventListener("disco-hue", handler);
    return () => window.removeEventListener("disco-hue", handler);
  }, []);

  const q = search.toLowerCase().trim();

  const designPosts = useMemo(
    () => posts.filter((p) => p.isDesign && (!q || matchesQuery(p, q))),
    [posts, q],
  );
  const visibleDesignPosts = isMobile ? designPosts.slice(0, designVisible) : designPosts;
  const designRemaining = designPosts.length - designVisible;

  const filtered = useMemo(
    () => posts.filter((p) =>
      (activeFilter === "all" || p.category === activeFilter) && (!q || matchesQuery(p, q))
    ),
    [posts, q, activeFilter],
  );
  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;

  function handleFilterChange(f: Filter) {
    setActiveFilter(f);
    setVisibleCount(INITIAL_COUNT);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const lower = val.toLowerCase().trim();

    const trigger = THEME_TRIGGERS.find((t) => t.cmd === lower);
    if (trigger) {
      const turningOn = activeTheme !== trigger.cls;
      ALL_THEME_CLASSES.forEach((c) => document.documentElement.classList.remove(c));
      if (turningOn) document.documentElement.classList.add(trigger.cls);
      if (trigger.storage) localStorage.setItem("theme", turningOn ? trigger.storage : "green");
      setActiveTheme(turningOn ? trigger.cls : null);
      setSearch("");
      return;
    }

    setSearch(val);
    if (lower !== "secret") setVisibleCount(INITIAL_COUNT);
  }

  return (
    <div>
      {/* Single row — search + desktop filters + toggle */}
      <div
        className="flex items-center gap-4 py-3 border-b"
        style={{ borderColor: "var(--bdr-faint)" }}
      >
        <div className="flex items-center flex-1 min-w-0">
          <span
            style={{
              color: "var(--col-muted)",
              fontFamily: "DM Mono, monospace",
              fontSize: "0.75rem",
              marginRight: "0.65em",
              userSelect: "none",
              flexShrink: 0,
            }}
          >
            &gt;
          </span>
          <input
            type="text"
            placeholder="search..."
            value={search}
            onChange={handleSearch}
            className="bg-transparent border-none outline-none flex-1 min-w-0"
            style={{
              color: "var(--c)",
              fontFamily: "DM Mono, monospace",
              fontWeight: 300,
              fontSize: "0.75rem",
              letterSpacing: "0.04em",
            }}
          />
        </div>

        {/* Desktop filters — list mode only, hidden on help */}
        {view === "list" && q !== "secret" &&
          FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className="hidden sm:block text-[0.55rem] uppercase tracking-wider transition-all duration-150 shrink-0"
              style={{
                fontFamily: "DM Mono, monospace",
                color:
                  activeFilter === f ? "var(--c)" : "var(--col-muted)",
                background: "transparent",
                border: "none",
                borderBottom:
                  activeFilter === f
                    ? "1px solid var(--c)"
                    : "1px solid transparent",
                paddingBottom: "2px",
                cursor: pointerCursor,
              }}
            >
              {f}
            </button>
          ))}

        {q !== "secret" && (
          <span
            className="shrink-0 hidden sm:block"
            style={{ color: "var(--col-faintest)", fontSize: "0.6rem" }}
          >
            |
          </span>
        )}

        {/* Toggle */}
        {q !== "secret" && <div
          className="flex items-center shrink-0"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--bdr)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          {(["list", "design"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="transition-all duration-200"
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: "0.48rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: view === v ? "var(--gd)" : "var(--col-muted-hi)",
                background: view === v ? "var(--c)" : "transparent",
                border: "none",
                borderRadius: "2px",
                padding: "4px 10px",
                cursor: pointerCursor,
                lineHeight: 1,
                minWidth: "36px",
                textAlign: "center",
              }}
            >
              {v}
            </button>
          ))}
        </div>}
      </div>

      {/* Mobile filters — label left, buttons right, list mode only */}
      {view === "list" && q !== "secret" && (
        <div
          className="flex items-center justify-between gap-4 sm:hidden border-b py-3"
          style={{ borderColor: "var(--bdr-faint)" }}
        >
          <span
            className="text-[0.55rem] uppercase tracking-wider shrink-0"
            style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace" }}
          >
            filters
          </span>

          <div className="flex items-center gap-4 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className="text-[0.55rem] uppercase tracking-wider transition-all duration-150 shrink-0"
                style={{
                  fontFamily: "DM Mono, monospace",
                  color:
                    activeFilter === f ? "var(--c)" : "var(--col-muted)",
                  background: "transparent",
                  border: "none",
                  borderBottom:
                    activeFilter === f
                      ? "1px solid var(--c)"
                      : "1px solid transparent",
                  paddingBottom: "1px",
                  cursor: pointerCursor,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help easter egg */}
      {q === "secret" && (
        <div>
          {[
            { cmd: "elio",       desc: "wanderer",        bg: "#1a3a7a",                  fg: "#eaecf2", muted: "rgba(234,236,242,0.55)", border: "rgba(234,236,242,0.12)" },
            { cmd: "m-reds",     desc: "muted red",       bg: "#b03333",                  fg: "#f5ebe8", muted: "rgba(245,235,232,0.60)", border: "rgba(245,235,232,0.15)" },
            { cmd: "the office", desc: "blue ink",        bg: "#f5f4ee",                  fg: "#1c2b4a", muted: "rgba(28,43,74,0.50)",   border: "rgba(28,43,74,0.13)"    },
            { cmd: "deus ex",    desc: "gold",            bg: "#ba7c00",                        fg: "#0a0400", muted: "rgba(10,4,0,0.45)",      border: "rgba(10,4,0,0.15)"      },
            { cmd: "mr robot",   desc: "terminal",        bg: "#0a0a0a",                        fg: "#00ff41", muted: "rgba(0,255,65,0.50)",    border: "rgba(0,255,65,0.12)"    },
            { cmd: "disco",      desc: "dance!",          bg: "linear-gradient(to right, hsl(0,75%,40%), hsl(60,75%,40%), hsl(120,75%,40%), hsl(180,75%,40%), hsl(240,75%,40%), hsl(300,75%,40%), hsl(360,75%,40%))", fg: "#ffffff", muted: "rgba(255,255,255,0.75)", border: "rgba(255,255,255,0.20)" },
          ].map(({ cmd, desc, bg, fg, muted, border }) => (
            <div
              key={cmd}
              className="flex items-center justify-between py-4 border-b px-4"
              style={{
                background: bg,
                borderColor: border,
                filter: activeTheme === "disco-mode" && cmd !== "disco" ? `hue-rotate(${360 - discoHue}deg) saturate(${(1 / 1.8).toFixed(3)})` : undefined,
              }}
            >
              <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.72rem", color: fg, letterSpacing: "0.06em" }}>
                type "{cmd}"
              </span>
              <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: muted, letterSpacing: "0.08em" }}>
                {desc}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Loading / error */}
      {q !== "secret" && loading && Array.from({ length: INITIAL_COUNT }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
      {q !== "secret" && error && (
        <p
          className="py-8"
          style={{
            color: "var(--cd)",
            fontFamily: "DM Mono, monospace",
            fontSize: "0.8rem",
          }}
        >
          could not load posts — check your Substack URL
        </p>
      )}

      {/* Design graph — always mounted so positions survive filtering */}
      {q !== "secret" && !loading && !error && view === "design" && (
        <>
          {designPosts.length === 0 ? (
            <p
              className="py-8"
              style={{
                color: "var(--cd)",
                fontFamily: "DM Mono, monospace",
                fontSize: "0.8rem",
              }}
            >
              no results
            </p>
          ) : (
            <>
              <WebGraph posts={visibleDesignPosts} paused={search.length > 0} />

              {/* Mobile load more for design */}
              {isMobile && designRemaining > 0 && (
                <div
                  className="py-4 border-b"
                  style={{ borderColor: "var(--bdr-faint)" }}
                >
                  <button
                    onClick={() => setDesignVisible((v) => v + DESIGN_INITIAL)}
                    className="uppercase tracking-wider px-3 py-1.5 border transition-all duration-150"
                    style={{
                      fontFamily: "DM Mono, monospace",
                      fontSize: "0.6rem",
                      borderColor: "var(--bdr-med)",
                      color: "var(--cd)",
                      background: "transparent",
                      cursor: pointerCursor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--c)";
                      e.currentTarget.style.color = "var(--c)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--bdr-med)";
                      e.currentTarget.style.color = "var(--cd)";
                    }}
                  >
                    + {Math.min(DESIGN_INITIAL, designRemaining)} more
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}


      {/* List */}
      {q !== "secret" && !loading && !error && view === "list" && (
        <>
          {posts.length === 0 && (
            <p
              className="py-8"
              style={{
                color: "var(--cd)",
                fontFamily: "DM Mono, monospace",
                fontSize: "0.8rem",
              }}
            >
              no posts yet
            </p>
          )}

          {visible.map((post, i) => (
            <ProjectRow key={post.slug} post={post} index={i} />
          ))}

          {filtered.length === 0 && posts.length > 0 && (
            <p
              className="py-8"
              style={{
                color: "var(--cd)",
                fontFamily: "DM Mono, monospace",
                fontSize: "0.8rem",
              }}
            >
              no results
            </p>
          )}

          {remaining > 0 && (
            <div
              className="flex items-center justify-between py-4 border-b"
              style={{ borderColor: "var(--bdr-faint)" }}
            >
              <button
                onClick={() => setVisibleCount((v) => v + LOAD_MORE_COUNT)}
                className="uppercase tracking-wider px-3 py-1.5 border transition-all duration-150"
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "0.6rem",
                  borderColor: "var(--bdr-med)",
                  color: "var(--cd)",
                  background: "transparent",
                  cursor: pointerCursor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--c)";
                  e.currentTarget.style.color = "var(--c)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--bdr-med)";
                  e.currentTarget.style.color = "var(--cd)";
                }}
              >
                + {Math.min(LOAD_MORE_COUNT, remaining)} more
              </button>

              <span
                className="text-[0.55rem] tabular-nums"
                style={{
                  color: "var(--col-ghost)",
                  fontFamily: "DM Mono, monospace",
                }}
              >
                {visible.length}/{filtered.length}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
