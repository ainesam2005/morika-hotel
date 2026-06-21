import './globals.css';
import Providers from '../components/Providers';

export const metadata = {
  title: {
    default: 'Morika Hotel — Luxury Mountain Retreat',
    template: '%s | Morika Hotel',
  },
  description:
    'Experience world-class luxury at Morika Hotel. Nestled among breathtaking mountain scenery, we offer elegant rooms, fine dining, a serene spa, and 24/7 concierge service. Book your dream getaway directly and save 15%.',
  keywords: [
    'Morika Hotel', 'luxury hotel', 'mountain resort', 'hotel booking', 'spa hotel',
    'fine dining hotel', 'luxury accommodation', 'hotel rooms', 'five star hotel',
  ],
  openGraph: {
    title: 'Morika Hotel — Luxury Mountain Retreat',
    description:
      'Discover unparalleled hospitality at Morika Hotel. Stunning mountain views, award-winning dining, a world-class spa, and meticulously designed rooms await you.',
    type: 'website',
    siteName: 'Morika Hotel',
    images: [{ url: '/img/scenery.jpg', width: 1200, height: 630, alt: 'Morika Hotel mountain terrace suite' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Morika Hotel — Luxury Mountain Retreat',
    description: 'Experience world-class luxury at Morika Hotel. Book direct and save 15%.',
    images: ['/img/scenery.jpg'],
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
