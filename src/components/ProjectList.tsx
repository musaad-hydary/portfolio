import { useEffect, useState } from "react";
import { fetchPosts } from "../utils/rss";
import type { SubstackPost } from "../utils/rss";
import ProjectRow from "./ProjectRow";
import WebGraph from "./WebGraph";

const INITIAL_COUNT = 5;
const LOAD_MORE_COUNT = 5;
const FILTERS = ["all", "engineering", "music"] as const;
type Filter = (typeof FILTERS)[number];
type View = "list" | "design";

const pointerCursor = "url('/cursor-pointer.png') 0 0, pointer";

export default function ProjectList() {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("list");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPosts()
      .then((data) => {
        console.log("total posts:", data.length);
        console.log("design posts:", data.filter((p) => p.isDesign).length);
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const designPosts = posts.filter((p) => p.isDesign);

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
    setSearch(e.target.value);
    setVisibleCount(INITIAL_COUNT);
  }

  return (
    <div>
      {/* Single row — search + filters + toggle */}
      <div
        className="flex items-center gap-4 border-b py-3"
        style={{ borderColor: "rgba(224,217,188,0.07)" }}
      >
        {/* Search */}
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

        {/* Category filters — list mode, desktop only */}
        {view === "list" &&
          FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className="hidden sm:block text-[0.55rem] uppercase tracking-wider pb-1 transition-all duration-150 shrink-0"
              style={{
                fontFamily: "DM Mono, monospace",
                color:
                  activeFilter === f ? "var(--c)" : "rgba(224,217,188,0.3)",
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

        {/* Divider */}
        <span
          className="shrink-0"
          style={{ color: "rgba(224,217,188,0.1)", fontSize: "0.6rem" }}
        >
          |
        </span>

        {/* View toggle */}
        {(["list", "design"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="text-[0.55rem] uppercase tracking-wider pb-1 transition-all duration-150 shrink-0"
            style={{
              fontFamily: "DM Mono, monospace",
              color: view === v ? "var(--c)" : "rgba(224,217,188,0.3)",
              background: "transparent",
              border: "none",
              borderBottom:
                view === v ? "1px solid var(--c)" : "1px solid transparent",
              cursor: pointerCursor,
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Loading / error */}
      {loading && (
        <p
          className="py-8"
          style={{
            color: "var(--cd)",
            fontFamily: "DM Mono, monospace",
            fontSize: "0.8rem",
          }}
        >
          fetching posts...
        </p>
      )}
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
        <WebGraph posts={designPosts} />
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

          {/* Load more + count in same row */}
          {remaining > 0 && (
            <div
              className="flex items-center justify-between py-4 border-b"
              style={{ borderColor: "rgba(224,217,188,0.07)" }}
            >
              <button
                onClick={() => setVisibleCount((v) => v + LOAD_MORE_COUNT)}
                className="uppercase tracking-wider px-3 py-1.5 border transition-all duration-150"
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: "0.6rem",
                  borderColor: "rgba(224,217,188,0.15)",
                  color: "var(--cd)",
                  background: "transparent",
                  cursor: pointerCursor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--c)";
                  e.currentTarget.style.color = "var(--c)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(224,217,188,0.15)";
                  e.currentTarget.style.color = "var(--cd)";
                }}
              >
                + {Math.min(LOAD_MORE_COUNT, remaining)} more
              </button>

              <span
                className="text-[0.55rem] tabular-nums"
                style={{
                  color: "rgba(224,217,188,0.2)",
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
