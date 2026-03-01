import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');
const { render } = await import('./.server/entry-server.js');

// Helper to find all markdown files
function getMarkdownFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getMarkdownFiles(file));
        } else if (file.endsWith('.md')) {
            results.push(file);
        }
    });
    return results;
}

// 1. Determine all routes
const routes = ['/', '/vision', '/projects', '/insights'];

// Add routes for content collections
const contentDirs = ['experiments', 'projects', 'insights'];
contentDirs.forEach(dir => {
    const fullPath = toAbsolute(`content/${dir}`);
    if (fs.existsSync(fullPath)) {
        const files = getMarkdownFiles(fullPath);
        files.forEach(file => {
            const fileContent = fs.readFileSync(file, 'utf-8');
            const { data } = matter(fileContent);
            if (data.slug) {
                routes.push(`/${dir}/${data.slug}`);
            }
        });
    }
});

console.log(`Pre-rendering ${routes.length} static routes...`);

// 2. Render each route
for (const url of routes) {
    const context = {};
    const { html } = render(url, context);

    // Inject rendered HTML and Helmet meta tags into the template
    let finalHtml = template
        .replace(`<!--app-html-->`, html)
        .replace(`<!--app-head-->`, `<title>Faith Forward</title>`);

    // Determine output path
    const filePath = url === '/' ? 'index.html' : `${url.replace(/^\//, '')}/index.html`;
    const absoluteFilePath = toAbsolute(`dist/${filePath}`);

    // Create directory if it doesn't exist
    fs.mkdirSync(path.dirname(absoluteFilePath), { recursive: true });
    fs.writeFileSync(absoluteFilePath, finalHtml);
    console.log(`Generated: ${filePath}`);
}

// 3. Generate SEO files
const domain = 'https://faithfwd.cc';

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(url => `  <url>
    <loc>${domain}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(toAbsolute('dist/sitemap.xml'), sitemapXml);
console.log('Generated: sitemap.xml');

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${domain}/sitemap.xml`;

fs.writeFileSync(toAbsolute('dist/robots.txt'), robotsTxt);
console.log('Generated: robots.txt');

console.log('Static site generation complete.');
