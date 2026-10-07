import './globals.css';

export const metadata = {
  title: 'Sela House — A little closer to quiet',
  description: 'Explore Sela House, a fictional boutique retreat in Ubud. Discover thoughtful rooms, slow rituals, and a softer way to stay.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
