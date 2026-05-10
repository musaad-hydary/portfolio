import { Link } from "react-router-dom";
import type { SubstackPost } from "../utils/rss";

interface Props {
  post: SubstackPost;
  index: number;
}

export default function ProjectRow({ post, index }: Props) {
  return (
    <Link
      to={`/projects/${post.slug}`}
      className="grid items-center border-b transition-colors duration-150 group"
      style={{
        gridTemplateColumns: "64px 52px 1fr auto",
        borderColor: "rgba(224,217,188,0.07)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(224,217,188,0.02)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Thumbnail */}
      <div
        className="overflow-hidden border-r"
        style={{
          width: "64px",
          height: "52px",
          borderColor: "rgba(224,217,188,0.07)",
        }}
      >
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover block"
          style={{ filter: "saturate(0.2) brightness(0.45) sepia(0.4)" }}
        />
      </div>

      {/* Number */}
      <span
        className="text-center text-[0.52rem] tracking-wider"
        style={{
          color: "rgba(224,217,188,0.2)",
          fontFamily: "DM Mono, monospace",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Title + description */}
      <div className="px-4 py-4">
        <div
          className="leading-tight mb-1.5"
          style={{
            color: "var(--cd)",
            fontFamily: "DM Mono, monospace",
            fontSize: "0.85rem",
          }}
        >
          {post.title}
        </div>
        <div
          className="text-[0.65rem] uppercase tracking-wider"
          style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace" }}
        >
          {post.description.slice(0, 60)}
        </div>
      </div>

      {/* Arrow */}
      <span
        className="pr-4 text-sm transition-opacity duration-150"
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
