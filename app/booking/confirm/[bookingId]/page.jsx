'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, CalendarDays, Home, AlertCircle } from 'lucide-react';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import PaymentInstructions from '../../../../components/PaymentInstructions';
import api from '../../../../utils/api';

function ConfirmPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/bookings/${bookingId}`)
      .then(({ data }) => setBooking(data))
      .catch(() => setError(true));
  }, [bookingId]);

  if (error) return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-white mb-2">Could Not Load Booking</h2>
        <p className="text-slate-400 mb-6">Please check “My Bookings” to see your reservation.</p>
        <Link href="/profile" className="btn-gold">My Bookings</Link>
      </div>
    </div>
  );

  if (!booking) return (
    <div className="pt-24 min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isPaid = booking.paymentStatus === 'paid' || booking.status === 'confirmed';
  const reference = booking.reference || booking._id?.slice(-8).toUpperCase();

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
          {isPaid
            ? <CheckCircle size={40} className="text-gold" />
            : <Clock size={40} className="text-gold" />}
        </div>
        <h1 className="font-serif text-4xl text-white mb-3">
          {isPaid ? 'Booking Confirmed!' : 'Reservation Received'}
        </h1>
        <p className="text-slate-400 mb-8">
          {isPaid
            ? 'Thank you for choosing Hotel Morika. Your reservation details are below.'
            : "Thank you! We've saved your room. It becomes fully confirmed as soon as we receive and check your payment."}
        </p>

        <div className="bg-navy-light rounded-2xl p-6 text-left space-y-4 mb-8 border border-navy-lighter">
          <div className="flex items-center gap-3 pb-4 border-b border-navy-lighter">
            <img src={booking.room?.images?.[0] || '/img/bed1.jpg'} alt="" className="w-16 h-14 rounded-lg object-cover" />
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
              <p className="text-slate-500 text-xs mb-1">{isPaid ? 'Total Paid' : 'Amount Due'}</p>
              <p className="text-gold text-sm font-semibold">${booking.totalPrice}</p>
            </div>
          </div>
          <div className="pt-3 border-t border-navy-lighter flex items-center justify-between">
            <span className="text-slate-400 text-sm">Booking Reference</span>
            <span className="text-white font-mono text-xs tracking-wider">{reference}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Status</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isPaid ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
              {isPaid ? 'Confirmed' : 'Awaiting payment'}
            </span>
          </div>
        </div>

        {/* Payment details shown until the booking is paid/confirmed */}
        {!isPaid && (
          <div className="text-left mb-8">
            <h2 className="font-serif text-xl text-white mb-4 text-center">How to Pay</h2>
            <PaymentInstructions amount={booking.totalPrice} reference={reference} />
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/profile" className="btn-outline-gold flex-1 flex items-center justify-center gap-2">
            <CalendarDays size={16} /> My Bookings
          </Link>
          <Link href="/" className="btn-gold flex-1 flex items-center justify-center gap-2">
            <Home size={16} /> Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmWrapper() {
  return (
    <ProtectedRoute>
      <ConfirmPage />
    </ProtectedRoute>
  );
}
