import { useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import api from '../utils/api';

const TYPES = ['all', 'single', 'double', 'deluxe', 'suite'];

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: 'all', maxPrice: '', capacity: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.type !== 'all') params.type = filters.type;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.capacity) params.capacity = filters.capacity;
    api.get('/rooms', { params })
      .then(({ data }) => setRooms(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters]);

  const hasFilters = filters.type !== 'all' || filters.maxPrice || filters.capacity;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <p className="section-subtitle">Accommodations</p>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="section-title">Our Rooms & Suites</h1>
            <p className="text-slate-400">Discover our collection of {rooms.length} handcrafted accommodations</p>
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 btn-outline-gold text-sm py-2 px-4">
            <SlidersHorizontal size={16} /> Filters {hasFilters && <span className="w-2 h-2 bg-gold rounded-full" />}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-6 p-5 bg-navy-light rounded-xl border border-navy-lighter grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Room Type</label>
              <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="input capitalize">
                {TYPES.map((t) => <option key={t} value={t} className="capitalize">{t === 'all' ? 'All Types' : t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Max Price / Night ($)</label>
              <input type="number" placeholder="e.g. 500" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className="input" min={0} />
            </div>
            <div>
              <label className="label">Min Guests</label>
              <input type="number" placeholder="e.g. 2" value={filters.capacity} onChange={(e) => setFilters({ ...filters, capacity: e.target.value })} className="input" min={1} max={10} />
            </div>
            {hasFilters && (
              <button onClick={() => setFilters({ type: 'all', maxPrice: '', capacity: '' })} className="flex items-center gap-1 text-sm text-slate-400 hover:text-gold transition-colors col-span-full w-fit">
                <X size={14} /> Clear filters
              </button>
            )}
          </div>
        )}

        {/* Type tabs */}
        <div className="flex gap-2 mt-6 flex-wrap">
          {TYPES.map((t) => (
            <button key={t} onClick={() => setFilters({ ...filters, type: t })}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filters.type === t ? 'bg-gold text-navy' : 'bg-navy-light text-slate-400 hover:text-gold border border-navy-lighter'}`}>
              {t === 'all' ? 'All Rooms' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Room Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-52 bg-navy-lighter" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-navy-lighter rounded w-3/4" />
                  <div className="h-4 bg-navy-lighter rounded w-full" />
                  <div className="h-4 bg-navy-lighter rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-4">No rooms match your filters</p>
            <button onClick={() => setFilters({ type: 'all', maxPrice: '', capacity: '' })} className="btn-outline-gold text-sm py-2 px-4">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => <RoomCard key={room._id} room={room} />)}
          </div>
        )}
      </div>
    </div>
  );
}
