import { useEffect, useReducer, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchPosts,
  readingTime,
  type SubstackPost,
} from "../utils/rss";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import AnimatedDots from "../components/AnimatedDots";

const pointerCursor = "url('/cursor-pointer.png') 0 0, pointer";

function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled share
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="text-[0.6rem] uppercase tracking-widest transition-colors duration-150"
      style={{
        color: copied ? "var(--c)" : "var(--cd)",
        fontFamily: "DM Mono, monospace",
        background: "transparent",
        border: "none",
        cursor: pointerCursor,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c)")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = copied ? "var(--c)" : "var(--cd)")
      }
    >
      {copied ? "copied ✓" : "share"}
    </button>
  );
}

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

type FetchState = {
  post: SubstackPost | null;
  relatedPosts: SubstackPost[];
  loading: boolean;
  error: boolean;
};

type FetchAction =
  | { type: "start" }
  | { type: "success"; post: SubstackPost | null; related: SubstackPost[] }
  | { type: "error" };

function fetchReducer(_: FetchState, action: FetchAction): FetchState {
  switch (action.type) {
    case "start":
      return { post: null, relatedPosts: [], loading: true, error: false };
    case "success":
      return { post: action.post, relatedPosts: action.related, loading: false, error: false };
    case "error":
      return { post: null, relatedPosts: [], loading: false, error: true };
  }
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [{ post, relatedPosts, loading, error }, dispatch] = useReducer(fetchReducer, {
    post: null,
    relatedPosts: [],
    loading: true,
    error: false,
  });
  const [showBackToTop, setShowBackToTop] = useState(false);

  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const proseRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!post || !proseRef.current) return;
    const imgs = proseRef.current.querySelectorAll<HTMLImageElement>("img");
    imgs.forEach((img) => {
      img.setAttribute("loading", "lazy");
      if (!img.complete) {
        img.classList.add("img-loading");
        img.addEventListener(
          "load",
          () => {
            img.classList.remove("img-loading");
            img.classList.add("img-loaded");
          },
          { once: true },
        );
      }
    });
  }, [post]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    dispatch({ type: "start" });

    fetchPosts()
      .then((all) => {
        if (cancelled) return;
        const found = all.find((p) => p.slug === slug) ?? null;
        dispatch({ type: "success", post: found, related: found ? getRelated(found, all) : [] });
      })
      .catch(() => {
        if (cancelled) return;
        dispatch({ type: "error" });
      });

    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (!post) return;

    const setMeta = (sel: string, val: string) => {
      const el = document.querySelector<HTMLMetaElement>(sel);
      if (el) el.content = val;
    };
    const prev = document.title;
    document.title = `${post.title} — musaad hydary`;
    setMeta('meta[property="og:title"]', post.title);
    setMeta('meta[property="og:description"]', post.description);
    setMeta('meta[property="og:image"]', post.image);
    setMeta('meta[property="og:url"]', post.url);
    setMeta('meta[property="og:type"]', "article");
    setMeta('meta[name="twitter:title"]', post.title);
    setMeta('meta[name="twitter:description"]', post.description);
    setMeta('meta[name="twitter:image"]', post.image);

    return () => {
      document.title = prev;
      setMeta('meta[property="og:title"]', "Musaad Hydary");
      setMeta(
        'meta[property="og:description"]',
        "Computer engineer and music producer based in Toronto.",
      );
      setMeta(
        'meta[property="og:image"]',
        "https://musaadhydary.com/og-image.png",
      );
      setMeta('meta[property="og:url"]', "https://musaadhydary.com");
      setMeta('meta[property="og:type"]', "website");
      setMeta('meta[name="twitter:title"]', "Musaad Hydary");
      setMeta(
        'meta[name="twitter:description"]',
        "Computer engineer and music producer based in Toronto.",
      );
      setMeta(
        'meta[name="twitter:image"]',
        "https://musaadhydary.com/og-image.png",
      );
    };
  }, [post]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = `${progress}%`;
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
        {loading && (
          <p
            className="py-10 text-[0.62rem]"
            style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace" }}
          >
            fetching post
            <AnimatedDots />
          </p>
        )}
        {error && (
          <p
            className="py-10 text-[0.62rem]"
            style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace" }}
          >
            could not load this post, please try again later
          </p>
        )}
        {!loading && !error && !post && (
          <p
            className="py-10 text-[0.62rem]"
            style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace" }}
          >
            post not found, please try again later
          </p>
        )}

        {post && (
          <div>
            <div className="py-8 border-b border-[var(--bdr)]">
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

              <div className="flex items-center gap-2">
                <ShareButton url={post.url} title={post.title} />
                <span
                  style={{
                    color: "var(--col-ghost)",
                    fontFamily: "DM Mono, monospace",
                    fontSize: "0.55rem",
                  }}
                >
                  ·
                </span>
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
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--c)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--cd)")
                  }
                >
                  read on substack ↗
                </a>
              </div>
            </div>

            <div
              ref={proseRef}
              className="py-8 prose"
              style={{
                color: "var(--c)",
                fontFamily: "DM Mono, monospace",
                overflowX: "auto",
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

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
                    <Link
                      key={related.slug}
                      to={`/projects/${related.slug}`}
                      className="flex items-center gap-4 transition-colors duration-150"
                      style={{ cursor: pointerCursor, textDecoration: "none" }}
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
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="max-w-[800px] mx-auto px-7">
        <Footer />
      </div>

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
