'use client';
import Link from 'next/link';
import { Utensils, Droplets, Dumbbell, Car, Heart, Coffee, Wifi, Clock, Star, Phone } from 'lucide-react';

const services = [
  {
    icon: Utensils,
    title: 'The Grand Restaurant & Room Dining',
    description: 'Indulge in an extraordinary culinary journey. Our chef crafts seasonal menus using the finest locally sourced ingredients — or let us bring the experience directly to your room with our signature in-bed breakfast service.',
    features: ['Open 7am – 11pm daily', 'International cuisine', 'In-room breakfast service', 'Private dining rooms', 'Sommelier on request'],
    image: '/img/food.jpg',
    imgPosition: 'object-top',
  },
  {
    icon: Heart,
    title: 'Serenity Spa & Wellness',
    description: 'Escape to our award-winning spa sanctuary. Our expert therapists offer a comprehensive menu of treatments designed to rejuvenate body, mind and soul in surroundings of quiet luxury.',
    features: ['15 treatment rooms', 'Hammam & steam room', 'Hydrotherapy pool', 'Couples packages', 'In-room treatments available'],
    image: '/img/bed12.jpg',
    imgPosition: 'object-center',
  },
  {
    icon: Dumbbell,
    title: 'Fitness & Recreation Center',
    description: 'Our state-of-the-art fitness center is open around the clock, equipped with the latest cardiovascular and strength training equipment. Personal trainers are available on request.',
    features: ['Open 24 hours', 'Latest Technogym equipment', 'Personal trainers', 'Group fitness classes', 'Yoga & Pilates studio'],
    image: '/img/finess.jpg',
    imgPosition: 'object-center',
  },
  {
    icon: Droplets,
    title: 'Outdoor Terrace & Mountain Views',
    description: 'Our crown jewel: an open-air terrace where the mountains meet the sky. Enjoy sunrise cocktails or a late-night soak under the stars with panoramic views that stretch for miles.',
    features: ['Heated year-round', 'Panoramic mountain views', 'Poolside butler service', 'Private cabana rentals', 'Signature cocktail menu'],
    image: '/img/scenery.jpg',
    imgPosition: 'object-center',
  },
  {
    icon: Car,
    title: 'Airport Transfer & Limousine',
    description: 'Arrive and depart in style with our premium chauffeur service. Our fleet of luxury vehicles is available 24/7 to ensure a seamless and comfortable transfer experience from door to door.',
    features: ['24/7 availability', 'Luxury vehicle fleet', 'Flight tracking', 'Meet & greet service', 'City tours available'],
    image: '/img/bed9.jpg',
    imgPosition: 'object-center',
  },
  {
    icon: Coffee,
    title: 'Grand Lobby & Concierge Services',
    description: 'Step into our contemporary grand lobby — a welcoming space of warmth and elegance. Our dedicated concierge team is at your service 24 hours a day.',
    features: ['24/7 concierge desk', 'Restaurant reservations', 'Event & theatre tickets', 'Sightseeing tours', 'Business services'],
    image: '/img/bed6.jpg',
    imgPosition: 'object-center',
  },
];

const highlights = [
  { icon: Wifi,  label: 'Complimentary WiFi' },
  { icon: Clock, label: '24/7 Room Service' },
  { icon: Star,  label: '5-Star Rated' },
  { icon: Phone, label: 'Dedicated Butler' },
];

export default function Services() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="relative h-72 mb-16 overflow-hidden">
        <img src="/img/bed11.jpg" alt="Morika Hotel Services" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-navy/65 flex flex-col items-center justify-center text-center px-4">
          <p className="section-subtitle">What We Offer</p>
          <h1 className="section-title mb-2">Hotel Services</h1>
          <p className="text-slate-300 max-w-lg">
            A full spectrum of premium amenities crafted to make every moment of your stay extraordinary.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map(({ icon: Icon, label }) => (
            <div key={label} className="bg-navy-light rounded-xl p-5 flex items-center gap-3 border border-navy-lighter">
              <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center shrink-0">
                <Icon size={18} className="text-gold" />
              </div>
              <span className="text-slate-300 text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-24">
        {services.map((svc, i) => {
          const Icon = svc.icon;
          const imageLeft = i % 2 === 0;
          return (
            <div
              key={svc.title}
              className={`grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-navy-lighter ${!imageLeft ? 'md:flex md:flex-row-reverse' : ''}`}
            >
              <div className="relative h-72 md:h-auto min-h-[300px] overflow-hidden">
                <img src={svc.image} alt={svc.title} className={`w-full h-full object-cover ${svc.imgPosition} hover:scale-105 transition-transform duration-700`} />
                <div className="absolute inset-0 bg-navy/20" />
              </div>
              <div className="bg-navy-light p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-gold" />
                  </div>
                  <h2 className="font-serif text-xl md:text-2xl text-white leading-tight">{svc.title}</h2>
                </div>
                <p className="text-slate-400 leading-relaxed mb-6 text-sm">{svc.description}</p>
                <ul className="space-y-2">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-24">
        <div className="relative rounded-2xl overflow-hidden">
          <img src="/img/bed8.jpg" alt="" className="w-full h-56 object-cover object-center" />
          <div className="absolute inset-0 bg-navy/75 flex flex-col items-center justify-center text-center px-6">
            <h3 className="font-serif text-3xl text-white mb-3">Ready to Experience Morika?</h3>
            <p className="text-slate-300 mb-6">Book your stay today and enjoy all our world-class amenities</p>
            <Link href="/rooms" className="btn-gold inline-block">Browse Rooms</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
