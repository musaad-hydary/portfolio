import { useEffect, useState } from "react";
import { fetchPosts } from "../utils/rss";
import type { SubstackPost } from "../utils/rss";
import ProjectRow from "./ProjectRow";

const INITIAL_COUNT = 5;

export default function ProjectList() {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
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

  const filtered = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase()),
  );
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

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
          onChange={(e) => {
            setSearch(e.target.value);
            setShowAll(false);
          }}
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

      {/* count */}
      <div className="flex justify-end pt-2 pb-2">
        <span
          className="text-[0.6rem]"
          style={{
            color: "rgba(224,217,188,0.2)",
            fontFamily: "DM Mono, monospace",
          }}
        >
          {visible.length} / {posts.length}
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

      {/* rows */}
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

      {/* load more substack articles */}
      {!showAll && filtered.length > INITIAL_COUNT && (
        <div
          className="py-4 border-b"
          style={{ borderColor: "rgba(224,217,188,0.07)" }}
        >
          <button
            onClick={() => setShowAll(true)}
            className="uppercase tracking-wider px-3 py-1.5 border transition-all duration-150"
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: "0.6rem",
              borderColor: "rgba(224,217,188,0.15)",
              color: "var(--cd)",
              background: "transparent",
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
            + {filtered.length - INITIAL_COUNT} more
          </button>
        </div>
      )}
    </div>
  );
}
