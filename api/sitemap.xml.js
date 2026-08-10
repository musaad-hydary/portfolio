const BASE_URL = "https://musaadhydary.com";

const STATIC_PAGES = [
  { path: "/",      priority: "1.0", changefreq: "weekly"  },
  { path: "/music", priority: "0.8", changefreq: "monthly" },
];

export default async function handler(req, res) {
  try {
    const response = await fetch("https://musaadh.substack.com/api/v1/posts?limit=50");
    const posts = await response.json();

    const staticUrls = STATIC_PAGES.map(({ path, priority, changefreq }) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("");

    const postUrls = Array.isArray(posts)
      ? posts.map((p) => `
  <url>
    <loc>${BASE_URL}/projects/${p.slug}</loc>
    <lastmod>${p.post_date ? p.post_date.split("T")[0] : new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.7</priority>
  </url>`).join("")
      : "";

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${postUrls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
    res.status(200).send(xml);
  } catch {
    res.status(500).send("Failed to generate sitemap");
  }
}
