import './globals.css';
import Providers from '../components/Providers';

export const metadata = {
  title: {
    default: 'Morika Hotel — Comfortable Hotel in Mbarara, Uganda',
    template: '%s | Morika Hotel',
  },
  description:
    'Morika Hotel is a warm, comfortable hotel on Katete Road, Mbarara, Uganda. Clean, cozy rooms, an on-site restaurant and bar, swimming pool, gym, conference hall, free WiFi and parking. Book your stay in a couple of minutes.',
  keywords: [
    'Morika Hotel', 'Hotel Morika', 'Mbarara hotel', 'hotel in Mbarara', 'Uganda hotel',
    'Katete Road Mbarara', 'hotel booking Mbarara', 'accommodation Mbarara', 'conference hotel Mbarara',
  ],
  openGraph: {
    title: 'Morika Hotel — Comfortable Hotel in Mbarara, Uganda',
    description:
      'A warm, comfortable hotel in Mbarara, Uganda. Cozy rooms, on-site restaurant and bar, pool, gym, conference facilities, free WiFi and parking.',
    type: 'website',
    siteName: 'Morika Hotel',
    images: [{ url: '/img/morika-front.jpeg', width: 1200, height: 630, alt: 'Morika Hotel, Mbarara' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Morika Hotel — Comfortable Hotel in Mbarara, Uganda',
    description: 'A warm, comfortable hotel in Mbarara, Uganda. Book your stay directly in a couple of minutes.',
    images: ['/img/morika-front.jpeg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
