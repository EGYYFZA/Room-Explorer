import './globals.css';
import './journey.css';
import './room.css';
import './horizontal.css';
import './refinements.css';
import './polish.css';
import './motion.css';
import PageTransitions from '../components/PageTransitions';

export const metadata = {
  title: 'Sela House — A little closer to quiet',
  description: 'Explore Sela House, a fictional boutique retreat in Ubud. Discover thoughtful rooms, slow rituals, and a softer way to stay.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}<PageTransitions /></body></html>;
}
