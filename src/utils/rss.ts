// shape of a single post fetched from substack RSS feed
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

// fetches all posts from  Substack RSS feed
// uses rss2json as a middleman to handle CORS and convert XML to JSON
export async function fetchPosts(): Promise<SubstackPost[]> {
  const res = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${SUBSTACK_URL}/feed&count=10&t=${Date.now()}`,
  );
  const data = await res.json();

  // if the feed errored or is empty, return an empty array instead of crashing
  if (data.status !== "ok" || !data.items) return [];

  return data.items.map((item: any) => ({
    title: item.title,

    // slug is the part after /p/ in the substack URL
    slug: item.link.split("/p/")[1],
    url: item.link,
    date: item.pubDate,

    // strip HTML tags from description and trim for list view
    description: item.description.replace(/<[^>]+>/g, "").slice(0, 120) + "...",
    image: item.thumbnail || item.enclosure?.link || "",
    content: item.content,
  }));
}

// fetches a single post by its slug
export async function fetchPostBySlug(
  slug: string,
): Promise<SubstackPost | null> {
  const posts = await fetchPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
