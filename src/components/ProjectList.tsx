import { useEffect, useState } from "react";
import { fetchPosts } from "../utils/rss";
import type { SubstackPost } from "../utils/rss";
import ProjectRow from "./ProjectRow";

const INITIAL_COUNT = 5;
const LOAD_MORE_COUNT = 5;
const FILTERS = ["all", "engineering", "music"] as const;
type Filter = (typeof FILTERS)[number];

const pointerCursor = "url('/cursor-pointer.png') 0 0, pointer";

export default function ProjectList() {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      {/* Search */}
      <div
        className="border-b"
        style={{ borderColor: "rgba(224,217,188,0.07)" }}
      >
        <input
          type="text"
          placeholder="> search projects..."
          value={search}
          onChange={handleSearch}
          className="w-full bg-transparent border-none outline-none py-4"
          style={{
            color: "var(--c)",
            fontFamily: "DM Mono, monospace",
            fontWeight: 300,
            fontSize: "0.75rem",
            letterSpacing: "0.04em",
          }}
        />
      </div>

      {/* Filters */}
      <div
        className="flex gap-6 py-3 border-b"
        style={{ borderColor: "rgba(224,217,188,0.07)" }}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            className="text-[0.55rem] uppercase tracking-wider transition-all duration-150 pb-1"
            style={{
              fontFamily: "DM Mono, monospace",
              color: activeFilter === f ? "var(--c)" : "rgba(224,217,188,0.3)",
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

        {/* Count — shows visible out of filtered */}
        <span
          className="ml-auto text-[0.55rem]"
          style={{
            color: "rgba(224,217,188,0.2)",
            fontFamily: "DM Mono, monospace",
          }}
        >
          {visible.length} / {filtered.length}
        </span>
      </div>

      {/* States */}
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
      {!loading && !error && posts.length === 0 && (
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

      {/* Rows */}
      {!loading &&
        !error &&
        visible.map((post, i) => (
          <ProjectRow key={post.slug} post={post} index={i} />
        ))}

      {/* No results */}
      {!loading && !error && filtered.length === 0 && posts.length > 0 && (
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

      {/* Load more */}
      {!loading && !error && remaining > 0 && (
        <div
          className="py-4 border-b"
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
        </div>
      )}
    </div>
  );
}
