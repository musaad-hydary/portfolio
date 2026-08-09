import { useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [mrRobot, setMrRobot] = useState(false);
  const [deusEx, setDeusEx] = useState(false);
  const [elio, setElio] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchPosts()
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const designPosts = posts.filter((p) => p.isDesign);
  const visibleDesignPosts = isMobile
    ? designPosts.slice(0, designVisible)
    : designPosts;
  const designRemaining = designPosts.length - designVisible;

  const filtered = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || post.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;

  function handleFilterChange(f: Filter) {
    setActiveFilter(f);
    setVisibleCount(INITIAL_COUNT);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const lower = val.toLowerCase().trim();

    if (lower === "mr robot") {
      const next = !mrRobot;
      document.documentElement.classList.remove("mr-robot-mode", "deus-ex-mode", "elio-mode");
      if (next) document.documentElement.classList.add("mr-robot-mode");
      setMrRobot(next);
      setDeusEx(false);
      setElio(false);
      setSearch("");
      return;
    }

    if (lower === "deus ex") {
      const next = !deusEx;
      document.documentElement.classList.remove("mr-robot-mode", "deus-ex-mode", "elio-mode");
      if (next) document.documentElement.classList.add("deus-ex-mode");
      setDeusEx(next);
      setMrRobot(false);
      setElio(false);
      setSearch("");
      return;
    }

    if (lower === "elio") {
      const next = !elio;
      document.documentElement.classList.remove("mr-robot-mode", "deus-ex-mode", "elio-mode");
      if (next) document.documentElement.classList.add("elio-mode");
      setElio(next);
      setMrRobot(false);
      setDeusEx(false);
      setSearch("");
      return;
    }

    setSearch(val);
    setVisibleCount(INITIAL_COUNT);
  }

  return (
    <div>
      {/* Single row — search + desktop filters + toggle */}
      <div
        className="flex items-center gap-4 border-b py-3"
        style={{ borderColor: "var(--bdr-faint)" }}
      >
        {view === "list" && (
          <input
            type="text"
            placeholder="> search..."
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
        )}

        {/* Desktop filters — list mode only */}
        {view === "list" &&
          FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className="hidden sm:block text-[0.55rem] uppercase tracking-wider pb-1 transition-all duration-150 shrink-0"
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
                cursor: pointerCursor,
              }}
            >
              {f}
            </button>
          ))}

        {view === "list" && (
          <span
            className="shrink-0 hidden sm:block"
            style={{ color: "var(--col-faintest)", fontSize: "0.6rem" }}
          >
            |
          </span>
        )}

        {/* Toggle */}
        <div
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
        </div>
      </div>

      {/* Mobile filters — label left, buttons right, list mode only */}
      {view === "list" && (
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
                className="text-[0.55rem] uppercase tracking-wider pb-1 transition-all duration-150 shrink-0"
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
                  cursor: pointerCursor,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading / error */}
      {loading && Array.from({ length: INITIAL_COUNT }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
      {error && (
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

      {/* Design graph */}
      {!loading && !error && view === "design" && (
        <>
          <WebGraph posts={visibleDesignPosts} />

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

      {/* List */}
      {!loading && !error && view === "list" && (
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
              project not found
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
