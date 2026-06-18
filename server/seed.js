require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');

const rooms = [
  {
    name: 'Classic Single Room',
    description: 'A cozy and elegantly furnished single room perfect for solo travelers. Features a plush queen bed, warm lighting, and a comfortable sitting area with sweeping city views.',
    type: 'single',
    pricePerNight: 120,
    capacity: 1,
    sizeSqm: 28,
    floor: 3,
    amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'Room Service', 'Safe'],
    images: ['/img/single.jpg', '/img/bed1.jpg'],
    isAvailable: true,
  },
  {
    name: 'Superior Double Room',
    description: 'Spacious double room with an ornate king-size bed and separate sitting area. Ideal for couples seeking comfort and style, with elegant décor and warm ambient lighting.',
    type: 'double',
    pricePerNight: 195,
    capacity: 2,
    sizeSqm: 40,
    floor: 5,
    amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'Room Service', 'Safe', 'Bathtub'],
    images: ['/img/bed5.jpg', '/img/bed14.jpg'],
    isAvailable: true,
  },
  {
    name: 'Deluxe Mountain View Room',
    description: 'Wake up to breathtaking panoramic mountain and forest views through floor-to-ceiling windows. The perfect retreat for nature lovers who refuse to sacrifice luxury.',
    type: 'deluxe',
    pricePerNight: 280,
    capacity: 2,
    sizeSqm: 52,
    floor: 8,
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', '24hr Room Service', 'Safe', 'Private Balcony', 'Rain Shower', 'Espresso Machine', 'Pillow Menu'],
    images: ['/img/bed9.jpg', '/img/bed8.jpg'],
    isAvailable: true,
  },
  {
    name: 'Junior Suite',
    description: 'A generously proportioned junior suite with a separate lounge area, classic European furnishings, and warm lamplight ambience. Perfect for a romantic extended stay.',
    type: 'suite',
    pricePerNight: 380,
    capacity: 2,
    sizeSqm: 70,
    floor: 10,
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Fully Stocked Mini Bar', '24hr Butler Service', 'Safe', 'Private Balcony', 'Jacuzzi', 'Espresso Machine', 'Separate Lounge'],
    images: ['/img/bed12.jpg', '/img/bed5.jpg'],
    isAvailable: true,
  },
  {
    name: 'Family Deluxe Room',
    description: 'Designed with families in mind, this spacious deluxe room features two luxurious queen beds with signature blue accents, a dedicated lounge corner, and all the comforts of home.',
    type: 'deluxe',
    pricePerNight: 320,
    capacity: 4,
    sizeSqm: 65,
    floor: 6,
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Room Service', 'Safe', 'Two Queen Beds', 'Kids Amenities', 'Extra Towels'],
    images: ['/img/doubleroom.jpg', '/img/bed1.jpg'],
    isAvailable: true,
  },
  {
    name: 'Executive Suite',
    description: 'The ultimate business retreat. Features a contemporary dark-blue headboard, pendant gold lighting, a dedicated workspace, and premium amenities designed for the discerning executive.',
    type: 'suite',
    pricePerNight: 520,
    capacity: 2,
    sizeSqm: 90,
    floor: 12,
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Fully Stocked Mini Bar', '24hr Butler Service', 'Safe', 'Private Balcony', 'Jacuzzi', 'Dedicated Workspace', 'Meeting Table', 'Espresso Machine'],
    images: ['/img/bed8.jpg', '/img/bed2.jpg'],
    isAvailable: true,
  },
  {
    name: 'Signature Double Room',
    description: 'A well-appointed signature double room blending contemporary art-piece headboard design with warm amber lighting. Combining timeless elegance with modern convenience.',
    type: 'double',
    pricePerNight: 160,
    capacity: 2,
    sizeSqm: 35,
    floor: 4,
    amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'Room Service', 'Safe', 'Bathrobe & Slippers'],
    images: ['/img/bed14.jpg', '/img/bed1.jpg'],
    isAvailable: true,
  },
  {
    name: 'Presidential Suite',
    description: 'The pinnacle of opulence. Our Presidential Suite features an open-air terrace with a king bed overlooking the mountains and lake, a grand lounge with fine art, and unrivaled 360° panoramic views.',
    type: 'suite',
    pricePerNight: 1200,
    capacity: 4,
    sizeSqm: 200,
    floor: 15,
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TVs', 'Fully Stocked Bar', '24hr Personal Butler', 'Safe', 'Open-air Terrace', 'Private Pool', 'Grand Piano', 'Home Theater', 'Two Master Bedrooms', 'Dining Room'],
    images: ['/img/scenery.jpg', '/img/bed11.jpg'],
    isAvailable: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Room.deleteMany({});
    await User.deleteMany({ role: 'admin' });

    await Room.insertMany(rooms);
    console.log(`Seeded ${rooms.length} rooms`);

    await User.create({
      name: 'Admin',
      email: 'admin@morika.com',
      password: 'Admin@1234',
      role: 'admin',
    });
    console.log('Admin user created: admin@morika.com / Admin@1234');

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
