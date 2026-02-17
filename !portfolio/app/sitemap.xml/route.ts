export async function GET() {
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://aleviclop.vercel.app";
  const pages = ["", "/about", "/projects", "/photography", "/contact"];
  const lastmod = new Date().toISOString();

  const urls = pages
    .map(
      (p) => `
  <url>
    <loc>${SITE_URL}${p}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p === "" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
