import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchPostBySlug,
  fetchPosts,
  readingTime,
  type SubstackPost,
} from "../utils/rss";
import Nav from "../components/Nav";

const pointerCursor = "url('/cursor-pointer.png') 0 0, pointer";

function getRelated(
  current: SubstackPost,
  all: SubstackPost[],
): SubstackPost[] {
  const currentWords = current.title.toLowerCase().split(/\s+/);
  return all
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      const words = p.title.toLowerCase().split(/\s+/);
      const overlap = currentWords.filter((w) => words.includes(w)).length;
      const categoryBoost = p.category === current.category ? 2 : 0;
      return { post: p, score: overlap + categoryBoost };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.post);
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<SubstackPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<SubstackPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // ref for progress bar — avoids re-renders on scroll
  const progressRef = useRef<HTMLDivElement>(null);

  // scroll to top on new article
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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

  useEffect(() => {
    if (!post) return;
    fetchPosts().then((all) => {
      setRelatedPosts(getRelated(post, all));
    });
  }, [post]);

  // update progress bar directly via DOM — no React re-render on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progressRef.current) {
        progressRef.current.style.width = `${progress}%`;
      }
      setShowBackToTop(scrollTop > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "var(--gd)", color: "var(--c)" }}
    >
      {/* Scroll progress bar */}
      <div
        ref={progressRef}
        className="fixed top-0 left-0 z-[60] h-[4px]"
        style={{
          width: "0%",
          background: "var(--c)",
          opacity: 0.4,
          willChange: "width",
          transition: "width 0.1s linear",
        }}
      />

      <Nav />

      <div className="max-w-[800px] mx-auto px-7 pt-24">
        {/* Loading */}
        {loading && (
          <p
            className="py-10 text-[0.62rem]"
            style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace" }}
          >
            fetching post...
          </p>
        )}

        {/* Error */}
        {error && (
          <p
            className="py-10 text-[0.62rem]"
            style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace" }}
          >
            could not load this post, please try again later
          </p>
        )}

        {/* Not found */}
        {!loading && !error && !post && (
          <p
            className="py-10 text-[0.62rem]"
            style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace" }}
          >
            post not found, please try again later
          </p>
        )}

        {/* Post */}
        {post && (
          <div>
            <div className="py-8 border-b border-[var(--bdr)]">
              {/* Date · reading time */}
              <div className="flex items-center gap-2 mb-4">
                <p
                  className="text-[0.55rem] uppercase tracking-widest"
                  style={{
                    color: "var(--col-muted)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <span
                  style={{
                    color: "var(--col-ghost)",
                    fontFamily: "DM Mono, monospace",
                    fontSize: "0.55rem",
                  }}
                >
                  ·
                </span>
                <p
                  className="text-[0.55rem] uppercase tracking-widest"
                  style={{
                    color: "var(--col-muted)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {readingTime(post.content)}
                </p>
              </div>

              {/* Title */}
              <h1
                className="leading-tight mb-6"
                style={{
                  fontFamily: "Times New Roman, serif",
                  color: "var(--c)",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                }}
              >
                {post.title}
              </h1>

              {/* Link to Substack */}
              <a
                href={post.url}
                target="_blank"
                rel="noreferrer"
                className="text-[0.6rem] uppercase tracking-widest transition-colors duration-150"
                style={{
                  color: "var(--cd)",
                  fontFamily: "DM Mono, monospace",
                  cursor: pointerCursor,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c)")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--cd)")
                }
              >
                read on substack ↗
              </a>
            </div>

            {/* Post body */}
            <div
              className="py-8 prose"
              style={{
                color: "var(--c)",
                fontFamily: "DM Mono, monospace",
                overflowX: "auto",
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div className="border-t border-[var(--bdr)] py-8">
                <p
                  className="text-[0.55rem] uppercase tracking-widest mb-6"
                  style={{
                    color: "var(--col-muted)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  related posts
                </p>
                <div className="flex flex-col gap-4">
                  {relatedPosts.map((related) => (
                    <a
                      key={related.slug}
                      href={`/projects/${related.slug}`}
                      className="flex items-center gap-4 transition-colors duration-150"
                      style={{ cursor: pointerCursor }}
                    >
                      <div
                        className="overflow-hidden flex-shrink-0"
                        style={{ width: "52px", height: "40px" }}
                      >
                        <img
                          src={related.image}
                          alt={related.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          style={{
                            filter: "saturate(0.2) brightness(0.45) sepia(0.4)",
                          }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-[0.75rem] leading-tight mb-1"
                          style={{
                            color: "var(--c)",
                            fontFamily: "DM Mono, monospace",
                            opacity: 0.85,
                          }}
                        >
                          {related.title}
                        </p>
                        <p
                          className="text-[0.58rem]"
                          style={{
                            color: "var(--cd)",
                            fontFamily: "DM Mono, monospace",
                          }}
                        >
                          {readingTime(related.content)}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 text-[0.55rem] uppercase tracking-widest px-3 py-2 border transition-all duration-150"
          style={{
            fontFamily: "DM Mono, monospace",
            borderColor: "var(--col-ghost)",
            color: "var(--cd)",
            background: "var(--gd)",
            cursor: pointerCursor,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--c)";
            e.currentTarget.style.color = "var(--c)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--col-ghost)";
            e.currentTarget.style.color = "var(--cd)";
          }}
        >
          ↑ top
        </button>
      )}
    </div>
  );
}
