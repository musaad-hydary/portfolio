export interface SubstackPost {
  title: string;
  slug: string;
  url: string;
  date: string;
  description: string;
  image: string;
  content: string;
}

const SUBSTACK_URL = "https://musaadh.substack.com";
const RSS2JSON_KEY = import.meta.env.VITE_RSS2JSON_KEY;

export async function fetchPosts(): Promise<SubstackPost[]> {
  const res = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${SUBSTACK_URL}/feed&api_key=${RSS2JSON_KEY}&count=50&t=${Date.now()}`,
  );
  const data = await res.json();

  if (data.status !== "ok" || !data.items) return [];

  return data.items.map((item: any) => ({
    title: item.title,
    slug: item.link.split("/p/")[1],
    url: item.link,
    date: item.pubDate,
    description: item.description.replace(/<[^>]+>/g, "").slice(0, 120) + "...",
    image: item.thumbnail || item.enclosure?.link || "",
    content: item.content,
  }));
}

export async function fetchPostBySlug(
  slug: string,
): Promise<SubstackPost | null> {
  const posts = await fetchPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
