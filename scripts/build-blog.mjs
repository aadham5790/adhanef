import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data');
const templatesDir = path.join(root, 'templates');
const blogDir = path.join(root, 'blog');

const posts = JSON.parse(fs.readFileSync(path.join(dataDir, 'blog.json'), 'utf8'));

if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

const template = fs.readFileSync(path.join(templatesDir, 'blog-post.html'), 'utf8');

posts.forEach((post) => {
  const html = template
    .replace(/{{title}}/g, post.title)
    .replace(/{{excerpt}}/g, post.excerpt)
    .replace(/{{slug}}/g, post.slug)
    .replace(/{{category}}/g, post.category)
    .replace(/{{date}}/g, post.date)
    .replace(/{{readTime}}/g, post.readTime)
    .replace(/{{cover}}/g, post.cover)
    .replace(/{{content}}/g, post.content);

  fs.writeFileSync(path.join(blogDir, `${post.slug}.html`), html);
});

const siteUrl = 'https://aadham5790.github.io/adhanef';
const now = new Date().toISOString();

const staticPages = [
  { url: `${siteUrl}/index.html`, priority: '1.0', changefreq: 'weekly' },
  { url: `${siteUrl}/about.html`, priority: '0.8', changefreq: 'monthly' },
  { url: `${siteUrl}/projects.html`, priority: '0.8', changefreq: 'weekly' },
  { url: `${siteUrl}/blog.html`, priority: '0.8', changefreq: 'weekly' },
  { url: `${siteUrl}/services.html`, priority: '0.7', changefreq: 'monthly' },
  { url: `${siteUrl}/contact.html`, priority: '0.7', changefreq: 'monthly' }
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...posts.map(post => ({ url: `${siteUrl}/blog/${post.slug}.html`, priority: '0.7', changefreq: 'weekly' }))].map(item => `  <url>
    <loc>${item.url}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);

const rssItems = posts.map(post => `  <item>
    <title>${post.title}</title>
    <link>${siteUrl}/blog/${post.slug}.html</link>
    <guid>${siteUrl}/blog/${post.slug}.html</guid>
    <description><![CDATA[${post.excerpt}]]></description>
    <content:encoded><![CDATA[${post.content}]]></content:encoded>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
  </item>`).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Ady Hanef Blog</title>
    <link>${siteUrl}/blog.html</link>
    <description>Technology, creativity, and ideas from the Maldives.</description>
    <lastBuildDate>${now}</lastBuildDate>
    <language>en</language>
${rssItems}
  </channel>
</rss>`;

fs.writeFileSync(path.join(root, 'rss.xml'), rss);

const atomEntries = posts.map(post => `  <entry>
    <title>${post.title}</title>
    <link href="${siteUrl}/blog/${post.slug}.html"/>
    <id>${siteUrl}/blog/${post.slug}.html</id>
    <updated>${post.date}T00:00:00Z</updated>
    <published>${post.date}T00:00:00Z</published>
    <summary><![CDATA[${post.excerpt}]]></summary>
    <content type="html"><![CDATA[${post.content}]]></content>
  </entry>`).join('\n');

const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Ady Hanef Blog</title>
  <link href="${siteUrl}/blog.html"/>
  <updated>${now}</updated>
  <author>
    <name>Ady Hanef</name>
  </author>
  <id>${siteUrl}/blog.html</id>
${atomEntries}
</feed>`;

fs.writeFileSync(path.join(root, 'atom.xml'), atom);

console.log(`Generated ${posts.length} blog posts.`);
console.log('Generated sitemap.xml, rss.xml, atom.xml');
