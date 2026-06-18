import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, CalendarDays, Users, Home } from 'lucide-react';
import api from '../utils/api';

export default function BookingConfirm() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    api.get(`/bookings/${bookingId}`).then(({ data }) => setBooking(data)).catch(() => {});
  }, [bookingId]);

  if (!booking) return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-gold" />
        </div>
        <h1 className="font-serif text-4xl text-white mb-3">Booking Confirmed!</h1>
        <p className="text-slate-400 mb-8">Thank you for choosing Morika Hotel. Your reservation details are below.</p>

        <div className="bg-navy-light rounded-2xl p-6 text-left space-y-4 mb-8 border border-navy-lighter">
          <div className="flex items-center gap-3 pb-4 border-b border-navy-lighter">
            <img src={booking.room?.images?.[0]} alt="" className="w-16 h-14 rounded-lg object-cover" />
            <div>
              <p className="text-white font-semibold">{booking.room?.name}</p>
              <p className="text-slate-400 text-sm capitalize">{booking.room?.type} Room</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-slate-500 text-xs mb-1">Check-in</p>
              <p className="text-white text-sm font-medium">{new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">Check-out</p>
              <p className="text-white text-sm font-medium">{new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">Guests</p>
              <p className="text-white text-sm font-medium">{booking.guests}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">Total Paid</p>
              <p className="text-gold text-sm font-semibold">${booking.totalPrice}</p>
            </div>
          </div>
          <div className="pt-3 border-t border-navy-lighter flex items-center justify-between">
            <span className="text-slate-400 text-sm">Booking Reference</span>
            <span className="text-white font-mono text-xs">{booking._id?.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Status</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${booking.status === 'confirmed' ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
              {booking.status}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/profile" className="btn-outline-gold flex-1 flex items-center justify-center gap-2"><CalendarDays size={16} /> My Bookings</Link>
          <Link to="/" className="btn-gold flex-1 flex items-center justify-center gap-2"><Home size={16} /> Back Home</Link>
        </div>
      </div>
    </div>
  );
}
