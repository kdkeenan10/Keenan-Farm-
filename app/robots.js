export default function robots() {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }], sitemap: 'https://keenanfarm.com/sitemap.xml', host: 'https://keenanfarm.com' };
}
