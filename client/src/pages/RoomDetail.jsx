import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Maximize2, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import BookingWidget from '../components/BookingWidget';
import api from '../utils/api';

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    api.get(`/rooms/${id}`)
      .then(({ data }) => setRoom(data))
      .catch(() => navigate('/rooms'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!room) return null;

  const images = room.images?.length ? room.images : ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'];

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back */}
        <button onClick={() => navigate('/rooms')} className="flex items-center gap-1 text-slate-400 hover:text-gold mb-6 transition-colors text-sm">
          <ChevronLeft size={16} /> Back to Rooms
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: image + details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image carousel */}
            <div className="relative rounded-2xl overflow-hidden h-72 md:h-96">
              <img src={images[imgIdx]} alt={room.name} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx((p) => (p - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-navy/70 rounded-full flex items-center justify-center hover:bg-navy transition-colors">
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <button onClick={() => setImgIdx((p) => (p + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-navy/70 rounded-full flex items-center justify-center hover:bg-navy transition-colors">
                    <ChevronRight size={20} className="text-white" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-gold' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute top-4 left-4">
                <span className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full capitalize">{room.type}</span>
              </div>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-gold' : 'border-transparent'}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Room Info */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="font-serif text-3xl text-white">{room.name}</h1>
                <div className="flex items-center gap-1 shrink-0">
                  <Star size={16} className="text-gold fill-gold" />
                  <span className="text-white font-semibold">4.9</span>
                  <span className="text-slate-400 text-sm">(128)</span>
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <span className="flex items-center gap-1 text-slate-400 text-sm"><Users size={14} className="text-gold" /> Up to {room.capacity} guests</span>
                {room.sizeSqm && <span className="flex items-center gap-1 text-slate-400 text-sm"><Maximize2 size={14} className="text-gold" /> {room.sizeSqm} m²</span>}
                {room.floor && <span className="text-slate-400 text-sm">Floor {room.floor}</span>}
              </div>
              <p className="text-slate-300 leading-relaxed">{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-navy-light rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.amenities?.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-slate-300 text-sm">
                    <Check size={14} className="text-gold shrink-0" /> {a}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: booking widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-navy-light rounded-2xl p-6 border border-navy-lighter mb-4">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-gold text-3xl font-bold">${room.pricePerNight}</span>
                  <span className="text-slate-400">/ night</span>
                </div>
                <p className="text-slate-500 text-xs mb-5">+ 10% taxes & fees</p>
              </div>
              <BookingWidget roomId={room._id} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
