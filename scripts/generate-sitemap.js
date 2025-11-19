import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define your site URL
const siteUrl = 'https://www.yugalmeet.com';

// Define your routes
const pages = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: 1.0,
    lastmod: new Date().toISOString().split('T')[0]
  }
  // Add more pages here as they are created
];

async function generateSitemap() {
  try {
    const sitemapStream = new SitemapStream({ hostname: siteUrl });
    const writeStream = createWriteStream(resolve(__dirname, '../public/sitemap.xml'));
    
    sitemapStream.pipe(writeStream);
    
    // Add all pages to the sitemap
    pages.forEach(page => {
      sitemapStream.write(page);
    });
    
    sitemapStream.end();
    
    // Wait for the stream to finish
    await streamToPromise(sitemapStream);
    
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();