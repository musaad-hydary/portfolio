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

export async function fetchPosts(): Promise<SubstackPost[]> {
  const res = await fetch(
    `https://corsproxy.io/?${encodeURIComponent(`${SUBSTACK_URL}/api/v1/posts?limit=50`)}`,
  );
  const data = await res.json();

  if (!Array.isArray(data)) return [];

  return data.map((item: any) => ({
    title: item.title,
    slug: item.slug,
    url: `${SUBSTACK_URL}/p/${item.slug}`,
    date: item.post_date,
    description: item.subtitle || "",
    image: item.cover_image || "",
    content: item.body_html || "",
  }));
}

export async function fetchPostBySlug(
  slug: string,
): Promise<SubstackPost | null> {
  const posts = await fetchPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
