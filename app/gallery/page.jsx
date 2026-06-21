'use client';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const GALLERY = [
  { src: '/img/scenery.jpg',    cat: 'Rooms',    title: 'Presidential Suite — Open-Air Terrace' },
  { src: '/img/bed9.jpg',       cat: 'Rooms',    title: 'Deluxe Mountain View Room' },
  { src: '/img/bed12.jpg',      cat: 'Rooms',    title: 'Junior Suite' },
  { src: '/img/bed8.jpg',       cat: 'Rooms',    title: 'Executive Suite' },
  { src: '/img/bed11.jpg',      cat: 'Rooms',    title: 'Presidential Suite — Grand Lounge' },
  { src: '/img/bed14.jpg',      cat: 'Rooms',    title: 'Signature Double Room' },
  { src: '/img/bed5.jpg',       cat: 'Rooms',    title: 'Superior Double Room' },
  { src: '/img/single.jpg',     cat: 'Rooms',    title: 'Classic Single Room' },
  { src: '/img/bed1.jpg',       cat: 'Rooms',    title: 'Classic King Bed' },
  { src: '/img/bed2.jpg',       cat: 'Rooms',    title: 'Business Room' },
  { src: '/img/doubleroom.jpg', cat: 'Rooms',    title: 'Family Deluxe Room' },
  { src: '/img/food.jpg',       cat: 'Dining',   title: 'Gourmet Breakfast in Bed' },
  { src: '/img/finess.jpg',     cat: 'Wellness', title: 'Fitness & Wellness Center' },
  { src: '/img/bed6.jpg',       cat: 'Lobby',    title: 'Grand Lobby Lounge' },
  { src: '/img/bed13.jpg',      cat: 'Rooms',    title: 'Premiere King Room' },
  { src: '/img/bed10.jpg',      cat: 'Rooms',    title: 'Deluxe Room Details' },
  { src: '/img/bed7.jpg',       cat: 'Rooms',    title: 'Comfort Double Room' },
  { src: '/img/bed4.jpg',       cat: 'Rooms',    title: 'Standard Room' },
];

const CATEGORIES = ['All', 'Rooms', 'Dining', 'Wellness', 'Lobby'];

export default function Gallery() {
  const [active, setActive] = useState('All');
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const filtered = active === 'All' ? GALLERY : GALLERY.filter((g) => g.cat === active);

  const closeLightbox = () => setLightboxIdx(null);
  const prev = () => setLightboxIdx((i) => (i - 1 + filtered.length) % filtered.length);
  const next = () => setLightboxIdx((i) => (i + 1) % filtered.length);

  const handleKey = (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') closeLightbox();
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="relative h-56 mb-12 overflow-hidden">
        <img src="/img/bed11.jpg" alt="Gallery" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-navy/70 flex flex-col items-center justify-center text-center px-4">
          <p className="section-subtitle">Visual Tour</p>
          <h1 className="section-title mb-0">Photo Gallery</h1>
          <p className="text-slate-300 mt-2 max-w-lg">
            Explore the beauty of Morika Hotel through our curated collection of photographs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                active === c
                  ? 'bg-gold text-navy shadow-lg shadow-gold/20 scale-105'
                  : 'bg-navy-light text-slate-400 hover:text-gold border border-navy-lighter'
              }`}
            >
              {c}
              <span className="ml-1.5 text-xs opacity-60">
                ({c === 'All' ? GALLERY.length : GALLERY.filter(g => g.cat === c).length})
              </span>
            </button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
          {filtered.map((img, i) => (
            <div
              key={img.src + i}
              onClick={() => setLightboxIdx(i)}
              className="break-inside-avoid rounded-xl overflow-hidden cursor-zoom-in group relative block"
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <span className="text-xs font-medium text-gold uppercase tracking-wider">{img.cat}</span>
                  <p className="text-white text-sm font-medium leading-tight">{img.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onKeyDown={handleKey}
          tabIndex={0}
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-navy-light rounded-full flex items-center justify-center text-white hover:text-gold transition-colors z-10"
            onClick={closeLightbox}
          >
            <X size={20} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-navy-light/80 rounded-full flex items-center justify-center text-white hover:text-gold transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft size={24} />
          </button>
          <div className="max-w-5xl w-full px-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[lightboxIdx].src}
              alt={filtered[lightboxIdx].title}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="text-center mt-4">
              <span className="text-gold text-xs uppercase tracking-widest">{filtered[lightboxIdx].cat}</span>
              <p className="text-slate-200 mt-1">{filtered[lightboxIdx].title}</p>
              <p className="text-slate-500 text-xs mt-1">{lightboxIdx + 1} / {filtered.length}</p>
            </div>
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-navy-light/80 rounded-full flex items-center justify-center text-white hover:text-gold transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
