export interface SubstackPost {
  title: string;
  slug: string;
  url: string;
  date: string;
  description: string;
  image: string;
  content: string;
  category: "engineering" | "music" | "all";
}

const SUBSTACK_URL = "https://musaadh.substack.com";
const RSS2JSON_KEY = import.meta.env.VITE_RSS2JSON_KEY;

// infers category from post title and content using keyword scoring
function inferCategory(
  title: string,
  content: string,
): "engineering" | "music" | "all" {
  const text = (title + " " + content).toLowerCase();

  const musicKeywords = [
    "music",
    "ableton",
    "beat",
    "song",
    "track",
    "producer",
    "audio",
    "sound",
    "mix",
    "chord",
    "melody",
    "rhythm",
    "lofi",
    "synth",
    "sample",
    "bpm",
    "daw",
    "instrument",
    "recording",
  ];

  const engineeringKeywords = [
    "code",
    "software",
    "hardware",
    "system",
    "algorithm",
    "api",
    "database",
    "react",
    "python",
    "circuit",
    "embedded",
    "compiler",
    "kernel",
    "network",
    "server",
    "machine learning",
    "model",
    "data",
    "javascript",
    "typescript",
    "css",
    "html",
    "gpu",
    "cpu",
    "memory",
    "firmware",
    "microcontroller",
    "pcb",
    "sensor",
    "bluetooth",
    "verilog",
  ];

  const musicScore = musicKeywords.filter((k) => text.includes(k)).length;
  const engineeringScore = engineeringKeywords.filter((k) =>
    text.includes(k),
  ).length;

  if (musicScore === 0 && engineeringScore === 0) return "all";
  if (musicScore > engineeringScore) return "music";
  return "engineering";
}

export async function fetchPosts(): Promise<SubstackPost[]> {
  const res = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${SUBSTACK_URL}/feed&api_key=${RSS2JSON_KEY}&count=50&t=${Date.now()}`,
  );
  const data = await res.json();

  if (data.status !== "ok" || !data.items) return [];

  return data.items.map((item: any) => {
    const slug = item.link.split("/p/")[1];
    const content = item.content || "";
    return {
      title: item.title,
      slug,
      url: item.link,
      date: item.pubDate,
      description:
        item.description.replace(/<[^>]+>/g, "").slice(0, 120) + "...",
      image: item.thumbnail || item.enclosure?.link || "",
      content,
      category: inferCategory(item.title, content),
    };
  });
}

export async function fetchPostBySlug(
  slug: string,
): Promise<SubstackPost | null> {
  const posts = await fetchPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

// estimates reading time based on average 200 words per minute
export function readingTime(content: string): string {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}
