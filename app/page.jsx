'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Utensils, Droplets, Dumbbell, Car, Wifi, Shield, ArrowRight, Quote, ChevronDown } from 'lucide-react';
import BookingWidget from '../components/BookingWidget';
import RoomCard from '../components/RoomCard';
import Reveal from '../components/Reveal';
import api from '../utils/api';

const services = [
  { icon: Utensils, title: 'Restaurant & Room Service', desc: 'Tasty meals and snacks brought to your room, any time of day' },
  { icon: Droplets, title: 'Swimming Pool', desc: 'Take a dip and relax at our on-site swimming pool' },
  { icon: Dumbbell, title: 'Gym', desc: 'Keep up your workout in our on-site fitness room' },
  { icon: Car, title: 'Free Parking', desc: 'Safe, free parking on-site for all our guests' },
  { icon: Wifi, title: 'Fast Free WiFi', desc: 'Strong, free internet in every room and every corner' },
  { icon: Shield, title: '24/7 Help Desk', desc: 'Our friendly team is here to help you day or night' },
];

const testimonials = [
  { name: 'Alexandra M.', role: 'Business Traveler', text: 'The best hotel stay I have ever had. The staff were so kind and helpful, and everything was spotless. I felt right at home.', rating: 5 },
  { name: 'James & Sarah K.', role: 'Honeymoon Couple', text: 'Morika made our honeymoon so special. The room was beautiful and every little detail was just right. We will be back!', rating: 5 },
  { name: 'Robert Chen', role: 'Regular Guest', text: 'I stay here every time I travel for work. Always clean, always friendly. I recommend it to everyone.', rating: 5 },
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
            alt="Morika Hotel, Mbarara"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/75 via-navy/45 to-navy" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <p className="section-subtitle animate-fade-in">Welcome to Morika Hotel</p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-lg animate-fade-up">
            A Beautiful Place<br />to <span className="text-gradient-gold">Rest & Relax</span>
          </h1>
          <p className="text-slate-200 text-lg md:text-xl max-w-2xl mx-auto mb-12 drop-shadow animate-fade-up" style={{ animationDelay: '120ms' }}>
            A warm, comfortable hotel in the heart of Mbarara, Uganda — with cozy rooms, great
            food, and friendly staff. Find your room and book your stay in just a couple of minutes.
          </p>

          <div className="max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '240ms' }}>
            <BookingWidget />
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 animate-fade-up" style={{ animationDelay: '360ms' }}>
            {[['24/7', 'Reception'], ['Free', 'WiFi & Parking'], ['On-site', 'Restaurant & Bar']].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-gold text-3xl font-bold">{n}</div>
                <div className="text-slate-300 text-sm mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll-down hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-gold/70 animate-float">
          <ChevronDown size={28} />
        </div>
      </section>

      {/* ── INTRO STRIP ── */}
      <section className="bg-navy-light border-y border-navy-lighter">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { img: '/img/food.jpg', label: 'Room Service', desc: 'Fresh breakfast brought right to your door' },
            { img: '/img/bed6.jpg', label: 'Grand Lobby', desc: 'A warm, welcoming space to relax and unwind' },
            { img: '/img/finess.jpg', label: 'Gym & Wellness', desc: 'A modern gym you can use any time, day or night' },
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
        <Reveal className="text-center mb-14">
          <p className="section-subtitle">Our Rooms</p>
          <h2 className="section-title">Rooms You'll Love</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Every room is clean, comfortable, and made for a great night's sleep — with lovely views to wake up to.
          </p>
        </Reveal>
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
            : featuredRooms.map((room, i) => (
                <Reveal key={room._id} delay={i * 100}>
                  <RoomCard room={room} />
                </Reveal>
              ))
          }
        </div>
        <div className="text-center">
          <Link href="/rooms" className="btn-outline-gold">
            See All Rooms <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── IMMERSIVE SPLIT SECTION ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        <div className="relative overflow-hidden group">
          <img src="/img/bed9.jpg" alt="Comfortable deluxe room at Morika Hotel" className="w-full h-full object-cover min-h-[340px] transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-navy/30" />
        </div>
        <div className="bg-navy-light flex items-center px-10 py-16 lg:px-16">
          <Reveal>
            <p className="section-subtitle">Rooms & Suites</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-5 leading-snug">
              Comfortable Rooms,<br />Restful Nights
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              Clean, cozy rooms with comfy beds and plenty of natural light. Air conditioning,
              free WiFi, and a quiet space to unwind — everything you need for a good night's sleep.
            </p>
            <Link href="/rooms" className="btn-gold">
              Explore Rooms <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-24 bg-navy-light">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-14">
            <p className="section-subtitle">What We Offer</p>
            <h2 className="section-title">Everything You Need</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We take care of the details so you can just relax and enjoy your stay.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="group h-full p-6 rounded-xl border border-navy-lighter hover:border-gold hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold/20 group-hover:scale-110 transition-all">
                    <Icon size={22} className="text-gold" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DINING HIGHLIGHT ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">
        <div className="bg-navy flex items-center px-10 py-16 lg:px-16 order-2 lg:order-1">
          <Reveal>
            <p className="section-subtitle">Food & Dining</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-5 leading-snug">
              Great Food,<br />Any Time of Day
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              Enjoy a fresh breakfast in bed or eat at our restaurant. We cook tasty meals with good,
              local ingredients — and always serve them with a smile.
            </p>
            <Link href="/services" className="btn-outline-gold">
              See Our Menu <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
        <div className="relative overflow-hidden order-1 lg:order-2 group">
          <img src="/img/food.jpg" alt="Fresh breakfast in bed" className="w-full h-full object-cover object-top min-h-[340px] transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-navy/20" />
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="section-subtitle">Guest Reviews</p>
          <h2 className="section-title">What Our Guests Say</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div className="card h-full p-6 relative hover:-translate-y-1 hover:shadow-xl">
                <Quote size={32} className="text-gold/20 absolute top-4 right-4" />
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} className="text-gold fill-gold" />)}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/img/bed11.jpg" alt="Presidential Suite lounge" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-navy/75" />
        </div>
        <Reveal className="relative z-10 text-center px-4">
          <p className="section-subtitle">Ready When You Are</p>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Book Your Stay Today</h2>
          <p className="text-slate-300 mb-10 max-w-xl mx-auto text-lg">
            Reserve your room in just a couple of minutes. Pay easily by bank transfer or Airtel Money —
            no card needed.
          </p>
          <Link href="/rooms" className="btn-gold text-lg px-8 py-4">
            Find Your Room <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>

    </div>
  );
}
