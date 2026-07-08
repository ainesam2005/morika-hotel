'use client';
import Link from 'next/link';
import { Users, Maximize2, Star } from 'lucide-react';

const TYPE_COLORS = {
  single: 'bg-blue-900/40 text-blue-300',
  double: 'bg-purple-900/40 text-purple-300',
  deluxe: 'bg-gold/20 text-gold',
  suite: 'bg-amber-900/40 text-amber-300',
};

export default function RoomCard({ room }) {
  return (
    <div className="card group h-full flex flex-col hover:ring-1 hover:ring-gold hover:-translate-y-1.5 hover:shadow-gold-lg transition-all duration-300">
      <div className="relative overflow-hidden h-52">
        <img
          src={room.images?.[0] || '/img/bed1.jpg'}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${TYPE_COLORS[room.type] || 'bg-slate-700 text-slate-300'}`}>
            {room.type}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-navy/80 backdrop-blur-sm rounded-full px-2 py-1">
          <Star size={12} className="text-gold fill-gold" />
          <span className="text-xs text-white">4.9</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg text-white mb-1 group-hover:text-gold transition-colors">{room.name}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{room.description}</p>

        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-1 text-slate-400 text-sm">
            <Users size={14} className="text-gold" /> Sleeps {room.capacity}
          </span>
          {room.sizeSqm && (
            <span className="flex items-center gap-1 text-slate-400 text-sm">
              <Maximize2 size={14} className="text-gold" /> {room.sizeSqm} m²
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div>
            <span className="text-gold text-2xl font-semibold">${room.pricePerNight}</span>
            <span className="text-slate-400 text-sm"> per night</span>
          </div>
          <Link href={`/rooms/${room._id}`} className="btn-gold text-sm py-2 px-4">View &amp; Book</Link>
        </div>
      </div>
    </div>
  );
}
