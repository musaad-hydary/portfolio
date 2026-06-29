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
const NODE_W = 180;
const NODE_H = 130;
const SPEED = 0.02;
const LINE_DISTANCE = 400;

function MobileGrid({ posts }: { posts: SubstackPost[] }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-3 py-6">
      {posts.map((post) => (
        <div
          key={post.slug}
          onClick={() => navigate(`/projects/${post.slug}`)}
          className="relative overflow-hidden transition-all duration-150 border"
          style={{
            cursor: pointerCursor,
            borderColor: "rgba(224,217,188,0.15)",
            width: "100%",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "rgba(224,217,188,0.4)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "rgba(224,217,188,0.15)")
          }
        >
          <div style={{ width: "100%", height: 140, overflow: "hidden" }}>
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="p-2"
            style={{
              background: "var(--gd)",
              borderTop: "1px solid rgba(224,217,188,0.1)",
            }}
          >
            <p
              className="text-[0.5rem] uppercase tracking-wider"
              style={{ color: "var(--cd)", fontFamily: "DM Mono, monospace" }}
            >
              {post.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopGraph({ posts }: { posts: SubstackPost[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animRef = useRef<number>(0);
  const navigate = useNavigate();
  const H = 500;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let ctx: CanvasRenderingContext2D | null = null;

    const init = (W: number) => {
      canvas.width = W;
      canvas.height = H;
      ctx = canvas.getContext("2d");
      if (!ctx) return;

      const els = Array.from(
        container.querySelectorAll(".graph-node"),
      ) as HTMLDivElement[];
      const cols = Math.ceil(Math.sqrt(els.length));
      const rows = Math.ceil(els.length / cols);
      const cellW = W / cols;
      const cellH = H / rows;

      nodesRef.current = els.map((el, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return {
          x: Math.max(
            NODE_W / 2 + 4,
            Math.min(
              W - NODE_W / 2 - 4,
              col * cellW +
                cellW / 2 +
                (Math.random() - 0.5) * (cellW - NODE_W) * 0.5,
            ),
          ),
          y: Math.max(
            NODE_H / 2 + 4,
            Math.min(
              H - NODE_H / 2 - 4,
              row * cellH +
                cellH / 2 +
                (Math.random() - 0.5) * (cellH - NODE_H) * 0.5,
            ),
          ),
          vx: (Math.random() - 0.5) * SPEED,
          vy: (Math.random() - 0.5) * SPEED,
          el,
        };
      });

      cancelAnimationFrame(animRef.current);
      draw(W);
    };

    const draw = (W: number) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const nodes = nodesRef.current;

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x - NODE_W / 2 < 4) {
          n.x = NODE_W / 2 + 4;
          n.vx = Math.abs(n.vx);
        }
        if (n.x + NODE_W / 2 > W - 4) {
          n.x = W - NODE_W / 2 - 4;
          n.vx = -Math.abs(n.vx);
        }
        if (n.y - NODE_H / 2 < 4) {
          n.y = NODE_H / 2 + 4;
          n.vy = Math.abs(n.vy);
        }
        if (n.y + NODE_H / 2 > H - 4) {
          n.y = H - NODE_H / 2 - 4;
          n.vy = -Math.abs(n.vy);
        }

        n.el.style.left = `${n.x - NODE_W / 2}px`;
        n.el.style.top = `${n.y - NODE_H / 2}px`;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINE_DISTANCE) {
            const opacity = (1 - dist / LINE_DISTANCE) * 0.12;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(224,217,188,${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(() => draw(W));
    };

    const observer = new ResizeObserver((entries) => {
      const W = entries[0].contentRect.width;
      if (W > 0) init(W);
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animRef.current);
    };
  }, [posts]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: H, overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />
      {posts.map((post) => (
        <div
          key={post.slug}
          className="graph-node"
          onClick={() => navigate(`/projects/${post.slug}`)}
          style={{
            position: "absolute",
            width: NODE_W,
            height: NODE_H,
            overflow: "hidden",
            cursor: pointerCursor,
            border: "1px solid rgba(224,217,188,0.15)",
            transition: "border-color 0.2s, filter 0.2s",
            zIndex: 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(224,217,188,0.5)";
            e.currentTarget.style.filter = "brightness(1.05)";
            e.currentTarget.style.zIndex = "10";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(224,217,188,0.15)";
            e.currentTarget.style.filter = "brightness(1)";
            e.currentTarget.style.zIndex = "1";
          }}
        >
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
