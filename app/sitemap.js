export default function sitemap() {
  const now = new Date();
  return [
    { url: 'https://keenanfarm.com/', lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: 'https://keenanfarm.com/beef-shares', lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://keenanfarm.com/request', lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];
}
