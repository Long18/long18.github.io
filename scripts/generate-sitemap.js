const fs = require('fs').promises;
const path = require('path');

async function generateSitemap() {
  const baseUrl = 'https://long18.github.io';
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'monthly' },
    { url: '/public/v2.0/', priority: '1.0', changefreq: 'weekly' },
    { url: '/public/v1.0/', priority: '0.8', changefreq: 'monthly' },
  ];

  // Add game pages
  const gamesDir = './public/Games';
  try {
    const gamesDirs = await fs.readdir(gamesDir);
    for (const gameDir of gamesDirs) {
      const stat = await fs.stat(path.join(gamesDir, gameDir));
      if (stat.isDirectory()) {
        pages.push({
          url: `/public/Games/${gameDir}/`,
          priority: '0.7',
          changefreq: 'monthly'
        });
      }
    }
  } catch (error) {
    console.log('Games directory not found, skipping...');
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  await fs.writeFile('./public/sitemap.xml', sitemap);
  console.log('Sitemap generated successfully!');

  // Generate robots.txt
  const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  await fs.writeFile('./public/robots.txt', robots);
  console.log('Robots.txt generated successfully!');
}

generateSitemap().catch(console.error);
