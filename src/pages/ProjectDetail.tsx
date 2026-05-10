import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPostBySlug, type SubstackPost } from "../utils/rss";

export default function ProjectDetail() {
  // useParams grabs :slug from the URL
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<SubstackPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // fetch post matching the slug when the page loads
  useEffect(() => {
    if (!slug) return;
    fetchPostBySlug(slug)
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--gd)", color: "var(--c)" }}
    >
      <div className="max-w-[800px] mx-auto px-7">
        {/* nav */}
        <nav className="flex justify-between items-center py-5 border-b border-[rgba(221,216,184,0.1)]">
          <Link
            to="/"
            className="text-[0.6rem] uppercase tracking-widest transition-colors duration-150"
            style={{ color: "var(--cd)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cd)")}
          >
            back
          </Link>
        </nav>

        {/* loading posts */}
        {loading && (
          <p className="text-[0.62rem] py-10" style={{ color: "var(--cd)" }}>
            fetching post...
          </p>
        )}

        {/* error loading posts */}
        {error && (
          <p className="text-[0.62rem] py-10" style={{ color: "var(--cd)" }}>
            could not load this post
          </p>
        )}

        {/* posts not found */}
        {!loading && !error && !post && (
          <p className="text-[0.62rem] py-10" style={{ color: "var(--cd)" }}>
            post not found, please try again later
          </p>
        )}

        {/* post */}
        {post && (
          <div>
            {/* post header */}
            <div className="py-8 border-b border-[rgba(221,216,184,0.1)]">
              {/* post date */}
              <p
                className="text-[0.55rem] uppercase tracking-widest mb-4"
                style={{ color: "rgba(221,216,184,0.3)" }}
              >
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              {/* post title */}
              <h1
                className="text-5xl leading-tight mb-6"
                style={{
                  fontFamily: "Special Elite, serif",
                  color: "var(--c)",
                }}
              >
                {post.title}
              </h1>

              {/* Link to original post */}
              <a
                href={post.url}
                target="_blank"
                rel="noreferrer"
                className="text-[0.6rem] uppercase tracking-widest transition-colors duration-150"
                style={{ color: "var(--cd)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c)")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--cd)")
                }
              >
                read on substack
              </a>
            </div>
            {/* post body */}{" "}
            <div
              className="py-8 prose"
              style={{ color: "var(--c)", fontFamily: "DM Mono, monospace" }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
