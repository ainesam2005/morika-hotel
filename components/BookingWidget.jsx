'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarDays, Users, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import toast from 'react-hot-toast';

export default function BookingWidget({ roomId, compact = false }) {
  const { user } = useAuth();
  const { updateBooking } = useBooking();
  const router = useRouter();

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    if (!checkIn || !checkOut) return toast.error('Please select check-in and check-out dates');
    if (checkOut <= checkIn) return toast.error('Check-out must be after check-in');

    updateBooking({ checkIn, checkOut, guests });

    if (roomId) {
      if (!user) return router.push('/login');
      router.push(`/booking/${roomId}`);
    } else {
      router.push('/rooms');
    }
  };

  const minCheckOut = checkIn ? new Date(checkIn.getTime() + 86400000) : new Date(Date.now() + 86400000);

  if (compact) {
    return (
      <div className="bg-navy-light border border-navy-lighter rounded-xl p-5 space-y-4">
        <h3 className="font-serif text-lg text-white">Check Availability</h3>
        <div>
          <label className="label">Check-in</label>
          <DatePicker selected={checkIn} onChange={setCheckIn} minDate={new Date()} dateFormat="MMM d, yyyy"
            placeholderText="Select date" className="input" />
        </div>
        <div>
          <label className="label">Check-out</label>
          <DatePicker selected={checkOut} onChange={setCheckOut} minDate={minCheckOut} dateFormat="MMM d, yyyy"
            placeholderText="Select date" className="input" />
        </div>
        <div>
          <label className="label">Guests</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-9 h-9 rounded-full border border-slate-600 text-slate-300 hover:border-gold hover:text-gold transition-colors flex items-center justify-center text-lg">−</button>
            <span className="text-white font-medium w-6 text-center">{guests}</span>
            <button onClick={() => setGuests(Math.min(10, guests + 1))} className="w-9 h-9 rounded-full border border-slate-600 text-slate-300 hover:border-gold hover:text-gold transition-colors flex items-center justify-center text-lg">+</button>
          </div>
        </div>
        <button onClick={handleSearch} className="btn-gold w-full flex items-center justify-center gap-2">
          <Search size={16} /> Check Availability
        </button>
      </div>
    );
  }

  return (
    <div className="bg-navy-light/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-2xl border border-navy-lighter">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="label flex items-center gap-1"><CalendarDays size={14} className="text-gold" /> Check-in</label>
          <DatePicker selected={checkIn} onChange={setCheckIn} minDate={new Date()} dateFormat="MMM d, yyyy"
            placeholderText="Select date" className="input" />
        </div>
        <div>
          <label className="label flex items-center gap-1"><CalendarDays size={14} className="text-gold" /> Check-out</label>
          <DatePicker selected={checkOut} onChange={setCheckOut} minDate={minCheckOut} dateFormat="MMM d, yyyy"
            placeholderText="Select date" className="input" />
        </div>
        <div>
          <label className="label flex items-center gap-1"><Users size={14} className="text-gold" /> Guests</label>
          <div className="flex items-center gap-2 bg-navy-lighter border border-slate-600 rounded-lg px-3 py-3">
            <button onClick={() => setGuests(Math.max(1, guests - 1))} className="text-slate-400 hover:text-gold w-5 text-lg leading-none">−</button>
            <span className="text-white font-medium flex-1 text-center">{guests}</span>
            <button onClick={() => setGuests(Math.min(10, guests + 1))} className="text-slate-400 hover:text-gold w-5 text-lg leading-none">+</button>
          </div>
        </div>
        <button onClick={handleSearch} className="btn-gold flex items-center justify-center gap-2 w-full">
          <Search size={16} /> Search
        </button>
      </div>
    </div>
  );
}
