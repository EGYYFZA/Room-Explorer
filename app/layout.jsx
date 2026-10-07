// Keep the cascade ordered: base, pages, layout, transitions, interactions, motion.
import '../styles/base.css';
import '../styles/home.css';
import '../styles/rooms.css';
import '../styles/horizontal.css';
import '../styles/transitions.css';
import '../styles/interactions.css';
import '../styles/motion.css';
import PageTransitions from '../components/PageTransitions';

export const metadata = {
  title: 'Sela House — A little closer to quiet',
  description: 'Explore Sela House, a fictional boutique retreat in Ubud. Discover thoughtful rooms, slow rituals, and a softer way to stay.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}<PageTransitions /></body></html>;
}
