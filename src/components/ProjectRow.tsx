import { Link } from "react-router-dom";
import { useState } from "react";
import type { SubstackPost } from "../utils/rss";

interface Props {
  post: SubstackPost;
  index: number;
}

const pointerCursor = "url('/cursor-pointer.png') 0 0, pointer";

export default function ProjectRow({ post, index }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link
      to={`/projects/${post.slug}`}
      className="grid items-center border-b transition-colors duration-150"
      style={{
        gridTemplateColumns: "64px 52px 1fr auto",
        borderColor: "var(--bdr-faint)",
        cursor: pointerCursor,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--bg-hover)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Thumbnail with skeleton */}
      <div
        className="overflow-hidden border-r relative"
        style={{
          width: "64px",
          height: "52px",
          borderColor: "var(--bdr-faint)",
        }}
      >
        {/* Skeleton — shows until image loads */}
        {!imgLoaded && (
          <div
            className="absolute inset-0"
            style={{ background: "var(--bg-dim)" }}
          />
        )}
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className="w-full h-full object-cover block transition-opacity duration-300"
          style={{
            filter: "saturate(0.2) brightness(0.45) sepia(0.4)",
            opacity: imgLoaded ? 1 : 0,
          }}
        />
      </div>

      {/* Number */}
      <span
        className="text-center text-[0.52rem] tracking-wider"
        style={{
          color: "var(--col-ghost)",
          fontFamily: "DM Mono, monospace",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Title + description + reading time */}
      <div className="px-4 py-4">
        <div
          className="leading-tight mb-1.5"
          style={{
            color: "var(--c)",
            fontFamily: "DM Mono, monospace",
            fontSize: "0.85rem",
            opacity: 0.85,
          }}
        >
          {post.title}
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-[0.6rem] uppercase tracking-wider"
            style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace" }}
          >
            {post.description.slice(0, 60)}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <span
        className="pr-4 text-sm"
        style={{
          color: "var(--c)",
          opacity: 0.15,
          fontFamily: "DM Mono, monospace",
        }}
      >
        ↗
      </span>
    </Link>
  );
}
