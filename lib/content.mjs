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
