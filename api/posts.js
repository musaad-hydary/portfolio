export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://musaadh.substack.com/api/v1/posts?limit=50",
    );
    const data = await response.json();

    const posts = Array.isArray(data) ? data : (data.posts ?? []);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}
