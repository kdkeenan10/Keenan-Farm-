export default function manifest() {
  return {
    name: 'Keenan Farm',
    short_name: 'Keenan Farm',
    description: 'Organically raised beef shares from Caledonia, NY',
    start_url: '/',
    display: 'browser',
    background_color: '#F1ECDF',
    theme_color: '#F1ECDF',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
