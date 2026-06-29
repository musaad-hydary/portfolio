import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SubstackPost } from "../utils/rss";

interface Props {
  posts: SubstackPost[];
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  el: HTMLDivElement;
}

const pointerCursor = "url('/cursor-pointer.png') 0 0, pointer";
const NODE_W = 200;
const NODE_H = 160;
const SPEED = 0.04;
const PADDING = 8;

function MobileGrid({ posts }: { posts: SubstackPost[] }) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 gap-3 py-6">
      {posts.map((post) => (
        <div
          key={post.slug}
          onClick={() => navigate(`/projects/${post.slug}`)}
          className="relative overflow-hidden transition-all duration-150 border"
          style={{
            cursor: pointerCursor,
            aspectRatio: "4/3",
            borderColor: "rgba(224,217,188,0.15)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "rgba(224,217,188,0.4)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "rgba(224,217,188,0.15)")
          }
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute bottom-0 left-0 right-0 p-2"
            style={{ background: "rgba(42,59,30,0.85)" }}
          >
            <p
              className="text-[0.5rem] uppercase tracking-wider"
              style={{ color: "var(--c)", fontFamily: "DM Mono, monospace" }}
            >
              {post.title.length > 24
                ? post.title.slice(0, 22) + "..."
                : post.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopGraph({ posts }: { posts: SubstackPost[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animRef = useRef<number>(0);
  const navigate = useNavigate();
  const H = 500;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const W = container.offsetWidth;

    const els = Array.from(
      container.querySelectorAll(".graph-node"),
    ) as HTMLDivElement[];

    nodesRef.current = els.map((el, i) => {
      const cols = Math.ceil(Math.sqrt(els.length));
      const rows = Math.ceil(els.length / cols);
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cellW = (W - NODE_W - PADDING * 2) / cols;
      const cellH = (H - NODE_H - PADDING * 2) / rows;
      return {
        x: Math.max(
          PADDING + NODE_W / 2,
          Math.min(
            W - PADDING - NODE_W / 2,
            PADDING +
              NODE_W / 2 +
              col * cellW +
              cellW / 2 +
              (Math.random() - 0.5) * cellW * 0.9,
          ),
        ),
        y: Math.max(
          PADDING + NODE_H / 2,
          Math.min(
            H - PADDING - NODE_H / 2,
            PADDING +
              NODE_H / 2 +
              row * cellH +
              cellH / 2 +
              (Math.random() - 0.5) * cellH * 0.9,
          ),
        ),
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        el,
      };
    });

    function draw() {
      const nodes = nodesRef.current;

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x - NODE_W / 2 < PADDING) {
          n.x = PADDING + NODE_W / 2;
          n.vx = Math.abs(n.vx);
        }
        if (n.x + NODE_W / 2 > W - PADDING) {
          n.x = W - PADDING - NODE_W / 2;
          n.vx = -Math.abs(n.vx);
        }
        if (n.y - NODE_H / 2 < PADDING) {
          n.y = PADDING + NODE_H / 2;
          n.vy = Math.abs(n.vy);
        }
        if (n.y + NODE_H / 2 > H - PADDING) {
          n.y = H - PADDING - NODE_H / 2;
          n.vy = -Math.abs(n.vy);
        }

        n.el.style.left = `${n.x - NODE_W / 2}px`;
        n.el.style.top = `${n.y - NODE_H / 2}px`;
      });

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [posts]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: H, overflow: "hidden" }}
    >
      {posts.map((post) => (
        <div
          key={post.slug}
          className="graph-node"
          onClick={() => navigate(`/projects/${post.slug}`)}
          style={{
            position: "absolute",
            width: NODE_W,
            cursor: pointerCursor,
            border: "1px solid rgba(224,217,188,0.15)",
            transition: "border-color 0.2s, transform 0.2s",
            zIndex: 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(224,217,188,0.5)";
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.zIndex = "10";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(224,217,188,0.15)";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.zIndex = "1";
          }}
        >
          {/* Image */}
          <div
            style={{ width: NODE_W, height: NODE_H - 28, overflow: "hidden" }}
          >
            <img
              src={post.image}
              alt={post.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* Title */}
          <div
            style={{
              padding: "0.4rem 0.5rem",
              background: "var(--gd)",
              borderTop: "1px solid rgba(224,217,188,0.1)",
              height: 28,
              display: "flex",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: "0.5rem",
                color: "var(--cd)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
              }}
            >
              {post.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WebGraph({ posts }: Props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) return <MobileGrid posts={posts} />;
  return <DesktopGraph posts={posts} />;
}
