'use client';
import Link from 'next/link';
import { Utensils, Droplets, Dumbbell, Car, Heart, Coffee, Wifi, Clock, Star, Phone } from 'lucide-react';

const services = [
  {
    icon: Utensils,
    title: 'Restaurant, Bar & Room Service',
    description: 'Enjoy tasty local and international meals at our restaurant and bar, or have them brought straight to your room. A fresh breakfast is served every morning.',
    features: ['Restaurant & bar on-site', 'Local & international dishes', 'Fresh breakfast daily', 'Room service', 'Drinks & cocktails'],
    image: '/img/food.jpg',
    imgPosition: 'object-top',
  },
  {
    icon: Droplets,
    title: 'Spa, Sauna & Steam Bath',
    description: 'Relax and recharge with a spa treatment, a warm sauna, or a steam bath — a great way to unwind after a busy day in Mbarara.',
    features: ['Spa treatments', 'Sauna', 'Steam bath', 'A calm, relaxing space'],
    image: '/img/morika-cottage.jpeg',
    imgPosition: 'object-center',
  },
  {
    icon: Dumbbell,
    title: 'Gym & Fitness Room',
    description: 'Keep up your routine in our fitness room, with equipment for a good workout whenever it suits you during your stay.',
    features: ['On-site gym', 'Cardio & weights', 'Open to all guests'],
    image: '/img/finess.jpg',
    imgPosition: 'object-center',
  },
  {
    icon: Coffee,
    title: 'Meetings & Events',
    description: 'Planning a meeting, workshop, or celebration? Our conference hall is ready for business events and functions of all sizes.',
    features: ['Conference hall', 'Meetings & workshops', 'Weddings & functions', 'Space for large groups'],
    image: '/img/bed6.jpg',
    imgPosition: 'object-center',
  },
  {
    icon: Wifi,
    title: 'Free WiFi & Parking',
    description: 'Stay connected with fast, free WiFi throughout the hotel, and park safely on-site at no extra cost — with 24/7 security.',
    features: ['Free WiFi everywhere', 'Free on-site parking', '24/7 security & CCTV'],
    image: '/img/bed8.jpg',
    imgPosition: 'object-center',
  },
  {
    icon: Clock,
    title: '24/7 Reception & Help',
    description: 'Our friendly team is at the front desk any time of day or night — ready to help with check-in, bookings, laundry, and tips for getting around Mbarara.',
    features: ['Front desk open 24/7', 'Laundry service', 'Local tour help', 'Friendly, helpful staff'],
    image: '/img/bed11.jpg',
    imgPosition: 'object-center',
  },
];

const highlights = [
  { icon: Wifi,  label: 'Free WiFi' },
  { icon: Clock, label: '24/7 Reception' },
  { icon: Utensils, label: 'On-site Restaurant' },
  { icon: Car,   label: 'Free Parking' },
];

export default function Services() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="relative h-72 mb-16 overflow-hidden">
        <img src="/img/morika-lawn.jpeg" alt="Hotel Morika, Mbarara" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-navy/65 flex flex-col items-center justify-center text-center px-4">
          <p className="section-subtitle">What We Offer</p>
          <h1 className="section-title mb-2">Hotel Services</h1>
          <p className="text-slate-300 max-w-lg">
            Everything you need for a comfortable, easy stay — good food, a pool, a gym, meeting spaces, and friendly service.
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
            <h3 className="font-serif text-3xl text-white mb-3">Ready to Stay with Us?</h3>
            <p className="text-slate-300 mb-6">Book your room today and enjoy everything Morika Hotel has to offer.</p>
            <Link href="/rooms" className="btn-gold inline-block">Browse Rooms</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
