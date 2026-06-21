'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Utensils, Droplets, Dumbbell, Car, Wifi, Shield, ArrowRight, Quote } from 'lucide-react';
import BookingWidget from '../components/BookingWidget';
import RoomCard from '../components/RoomCard';
import api from '../utils/api';

const services = [
  { icon: Utensils, title: 'Fine Dining', desc: 'Award-winning in-room and restaurant dining experiences' },
  { icon: Droplets, title: 'Infinity Pool', desc: 'Rooftop pool with panoramic mountain views' },
  { icon: Dumbbell, title: 'Fitness Center', desc: '24/7 gym with personal trainers available' },
  { icon: Car, title: 'Airport Transfer', desc: 'Complimentary luxury car service' },
  { icon: Wifi, title: 'High-Speed WiFi', desc: 'Complimentary high-speed internet throughout' },
  { icon: Shield, title: 'Concierge', desc: '24-hour personalized concierge service' },
];

const testimonials = [
  { name: 'Alexandra M.', role: 'Business Traveler', text: 'The most luxurious stay I have ever experienced. The staff went above and beyond to make me feel at home. Absolutely impeccable service.', rating: 5 },
  { name: 'James & Sarah K.', role: 'Honeymoon Couple', text: 'Morika Hotel made our honeymoon truly unforgettable. The suite was breathtaking and every detail was perfect. We will definitely return!', rating: 5 },
  { name: 'Robert Chen', role: 'Frequent Guest', text: 'I stay here every time I visit. The consistency of quality and the warmth of the staff keeps me coming back. Highly recommended!', rating: 5 },
];

export default function Home() {
  const [featuredRooms, setFeaturedRooms] = useState([]);

  useEffect(() => {
    api.get('/rooms').then(({ data }) => setFeaturedRooms(data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="pt-16">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/img/scenery.jpg"
            alt="Morika Hotel — mountain terrace suite"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/75 via-navy/45 to-navy" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <p className="section-subtitle">Welcome to Morika Hotel</p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-lg">
            Experience <span className="text-gold">Luxury</span><br />Like Never Before
          </h1>
          <p className="text-slate-200 text-lg md:text-xl max-w-2xl mx-auto mb-12 drop-shadow">
            Where timeless elegance meets breathtaking nature. Discover a world of unparalleled hospitality perched among the mountains.
          </p>

          <div className="max-w-4xl mx-auto">
            <BookingWidget />
          </div>

          <div className="mt-14 flex items-center justify-center gap-10">
            {[['500+', 'Happy Guests'], ['50+', 'Luxury Rooms'], ['15+', 'Years of Excellence']].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-gold text-3xl font-bold">{n}</div>
                <div className="text-slate-300 text-sm mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO STRIP ── */}
      <section className="bg-navy-light border-y border-navy-lighter">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { img: '/img/food.jpg', label: 'Room Service', desc: 'Gourmet breakfast delivered to your door' },
            { img: '/img/bed6.jpg', label: 'Grand Lobby', desc: 'Contemporary design meets warm hospitality' },
            { img: '/img/finess.jpg', label: 'Fitness & Wellness', desc: 'State-of-the-art gym, open around the clock' },
          ].map(({ img, label, desc }) => (
            <div key={label} className="group flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <img src={img} alt={label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{label}</p>
                <p className="text-slate-400 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED ROOMS ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-subtitle">Accommodations</p>
          <h2 className="section-title">Our Featured Rooms</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Each room is meticulously designed to provide the ultimate in comfort and luxury, featuring premium furnishings and stunning views.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {featuredRooms.length === 0
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-52 bg-navy-lighter" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-navy-lighter rounded w-3/4" />
                    <div className="h-4 bg-navy-lighter rounded w-full" />
                    <div className="h-4 bg-navy-lighter rounded w-1/2" />
                  </div>
                </div>
              ))
            : featuredRooms.map((room) => <RoomCard key={room._id} room={room} />)
          }
        </div>
        <div className="text-center">
          <Link href="/rooms" className="btn-outline-gold inline-flex items-center gap-2">
            View All Rooms <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── IMMERSIVE SPLIT SECTION ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        <div className="relative overflow-hidden">
          <img src="/img/bed9.jpg" alt="Mountain view deluxe room" className="w-full h-full object-cover min-h-[340px]" />
          <div className="absolute inset-0 bg-navy/30" />
        </div>
        <div className="bg-navy-light flex items-center px-10 py-16 lg:px-16">
          <div>
            <p className="section-subtitle">Rooms & Suites</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-5 leading-snug">
              Rooms with Views<br />That Take Your Breath Away
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              Every window frames a masterpiece. From floor-to-ceiling panoramas of alpine forests at golden hour to open-air terraces above mountain lakes — Morika rooms turn the natural world into your personal backdrop.
            </p>
            <Link href="/rooms" className="btn-gold inline-flex items-center gap-2">
              Explore Rooms <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-24 bg-navy-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="section-subtitle">Amenities</p>
            <h2 className="section-title">World-Class Services</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Every aspect of your stay is crafted to perfection, offering premium services designed for your ultimate comfort.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group p-6 rounded-xl border border-navy-lighter hover:border-gold transition-colors cursor-default">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <Icon size={22} className="text-gold" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DINING HIGHLIGHT ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">
        <div className="bg-navy flex items-center px-10 py-16 lg:px-16 order-2 lg:order-1">
          <div>
            <p className="section-subtitle">Dining</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-5 leading-snug">
              Breakfast in Bed,<br />Elevated to an Art Form
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              Start your morning with a curated gourmet breakfast — freshly baked croissants, seasonal eggs, artisan juice — delivered to your room with quiet elegance. Because every detail of your stay matters.
            </p>
            <Link href="/services" className="btn-outline-gold inline-flex items-center gap-2">
              Discover Dining <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden order-1 lg:order-2">
          <img src="/img/food.jpg" alt="Gourmet breakfast in bed" className="w-full h-full object-cover object-top min-h-[340px]" />
          <div className="absolute inset-0 bg-navy/20" />
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-subtitle">Guest Reviews</p>
          <h2 className="section-title">What Our Guests Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6 relative">
              <Quote size={32} className="text-gold/20 absolute top-4 right-4" />
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="text-gold fill-gold" />)}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div>
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <p className="text-slate-500 text-xs">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/img/bed11.jpg" alt="Presidential Suite lounge" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-navy/75" />
        </div>
        <div className="relative z-10 text-center px-4">
          <p className="section-subtitle">Exclusive Offer</p>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Book Direct & Save 15%</h2>
          <p className="text-slate-300 mb-10 max-w-xl mx-auto text-lg">
            Enjoy exclusive rates when you book directly through our website. No hidden fees, best price guaranteed.
          </p>
          <Link href="/rooms" className="btn-gold inline-flex items-center gap-2 text-lg px-8 py-4">
            Explore Rooms <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
