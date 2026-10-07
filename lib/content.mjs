export const rooms = [
  { id: 'garden', name: 'Garden Studio', type: 'Studio', price: 1850000, area: 38, guests: 2, image: 'garden.jpg', label: 'A pocket of green', description: 'Wake to the rustle of palms. A warm, light-filled studio with a private garden terrace, soft linen, and room to simply be.', amenities: ['King bed', 'Garden terrace', 'Rain shower', 'Breakfast for two'] },
  { id: 'canopy', name: 'Canopy Suite', type: 'Suite', price: 2750000, area: 64, guests: 3, image: 'canopy.jpg', label: 'Above the everyday', description: 'A generous hideaway with a separate lounge and leafy views. Open the doors, pour something warm, and let the afternoon unfold.', amenities: ['King bed + daybed', 'Separate lounge', 'Deep soaking tub', 'Breakfast included'] },
  { id: 'pool', name: 'Pool House', type: 'Villa', price: 4200000, area: 110, guests: 4, image: 'pool.jpg', label: 'Your own little world', description: 'A private villa made for unhurried days. Two bedrooms, a sun-dappled courtyard, and a pool that is yours alone.', amenities: ['Two king bedrooms', 'Private pool', 'Courtyard dining', 'Breakfast included'] },
];
export const rituals = [
  { title: 'A slower morning', category: '01 / AT THE TABLE', image: 'breakfast.jpg', description: 'Seasonal fruit, freshly brewed coffee, and a table in the garden. Our favourite way to begin again.' },
  { title: 'Time, just for you', category: '02 / BY THE WATER', image: 'retreat.jpg', description: 'A good book. A quiet swim. An afternoon with nowhere else to be. Make a little space for yourself.' },
  { title: 'Live a little locally', category: '03 / BEYOND THE HOUSE', image: 'ubud.jpg', description: 'Discover the landscapes and culture of Bali at your own pace. The best moments rarely need a plan.' },
];
export const money = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const details = {
  garden: { mood: 'Let the outside in.', story: 'Earthy textures, gentle light, and a little green at the threshold. This intimate space is imagined for two people who would rather wake slowly than set an alarm.', photos: [['garden.jpg', 'Warm timber and soft linen'], ['bathroom.jpg', 'A bright, restorative bathing space'], ['garden-pool.jpg', 'Tropical gardens and shared pool moments'], ['breakfast.jpg', 'Breakfast, at your own pace']], note: 'An intimate escape for two', beds: 'One king bed', highlight: 'Private garden terrace' },
  canopy: { mood: 'Room to linger.', story: 'A suite with space for the in-between moments. Sink into the lounge, draw a bath, or share an afternoon with a book. Thoughtful proportions make staying in feel like a destination.', photos: [['canopy.jpg', 'A softly lit bedroom'], ['lounge.jpg', 'A lounge for long afternoons'], ['bathroom.jpg', 'An imagined soaking ritual'], ['dining.jpg', 'An evening at the table']], note: 'A generous space to settle in', beds: 'King bed and daybed', highlight: 'Separate living room' },
  pool: { mood: 'A world of your own.', story: 'Designed around the pleasure of being together, with room to find your own quiet corner. Indoor living flows into a private courtyard, and every day can begin with a swim.', photos: [['pool.jpg', 'Your imagined private pool house'], ['interior.jpg', 'Open living, natural light'], ['garden.jpg', 'A warm bedroom inspiration'], ['dining.jpg', 'Gather around the table'], ['spa.jpg', 'Small rituals of restoration']], note: 'A private retreat for four', beds: 'Two king bedrooms', highlight: 'Your own swimming pool' },
};
rooms.forEach(room => Object.assign(room, details[room.id]));
export const houseGallery = [
  { image: 'retreat.jpg', caption: 'A softer pace, by the pool' },
  ...rooms.map(r => ({ image: r.image, caption: r.name })),
  { image: 'lounge.jpg', caption: 'Space to linger' },
  { image: 'bathroom.jpg', caption: 'The art of unwinding' },
  { image: 'interior.jpg', caption: 'Light, texture, and quiet' },
  { image: 'dining.jpg', caption: 'An evening at the table' },
  { image: 'garden-pool.jpg', caption: 'A tropical state of mind' },
  { image: 'spa.jpg', caption: 'Little restorative rituals' },
  { image: 'bali-landscape.jpg', caption: 'A glimpse of coastal Bali' },
  { image: 'ubud.jpg', caption: 'Discover the landscapes of Bali' },
];
