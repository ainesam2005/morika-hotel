'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Users, CalendarDays, ChevronLeft, ChevronRight, Wallet,
} from 'lucide-react';
import toast from 'react-hot-toast';
import StepIndicator from '../../../components/StepIndicator';
import ProtectedRoute from '../../../components/ProtectedRoute';
import PaymentInstructions from '../../../components/PaymentInstructions';
import { useBooking } from '../../../context/BookingContext';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

function BookingPage() {
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const resumeBookingId = searchParams.get('resume');
  const router = useRouter();
  const { user } = useAuth();
  const { bookingData, updateBooking } = useBooking();

  const [step, setStep] = useState(1);
  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState(bookingData.checkIn || null);
  const [checkOut, setCheckOut] = useState(bookingData.checkOut || null);
  const [guests, setGuests] = useState(bookingData.guests || 1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [guestDetails, setGuestDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [bookingId, setBookingId] = useState(null);
  const [checking, setChecking] = useState(false);
  const [creatingBooking, setCreatingBooking] = useState(false);

  useEffect(() => {
    api.get(`/rooms/${roomId}`)
      .then(({ data }) => setRoom(data))
      .catch(() => router.push('/rooms'));
  }, [roomId]);

  useEffect(() => {
    if (!resumeBookingId) return;
    api.get(`/bookings/${resumeBookingId}`)
      .then(({ data }) => {
        setCheckIn(new Date(data.checkIn));
        setCheckOut(new Date(data.checkOut));
        setGuests(data.guests);
        setBookingId(data._id);
        setStep(4);
      })
      .catch(() => {});
  }, [resumeBookingId]);

  const nights = checkIn && checkOut ? Math.ceil((checkOut - checkIn) / 86400000) : 0;
  const subtotal = room ? nights * room.pricePerNight : 0;
  const taxes = +(subtotal * 0.1).toFixed(2);
  const total = +(subtotal + taxes).toFixed(2);

  const handleDateConfirm = async () => {
    if (!checkIn || !checkOut) return toast.error('Please select check-in and check-out dates');
    if (nights < 1) return toast.error('Minimum stay is 1 night');
    setChecking(true);
    try {
      const { data } = await api.get('/rooms/check-availability', {
        params: { roomId, checkIn: checkIn.toISOString(), checkOut: checkOut.toISOString() },
      });
      if (!data.available) return toast.error('Room is not available for the selected dates');
      updateBooking({ checkIn, checkOut, guests, room });
      setStep(2);
    } catch {
      toast.error('Could not check availability — please try again');
    } finally {
      setChecking(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!guestDetails.name.trim()) return toast.error('Full name is required');
    if (!guestDetails.email.trim()) return toast.error('Email is required');
    setCreatingBooking(true);
    try {
      const { data: booking } = await api.post('/bookings', {
        roomId,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
        specialRequests,
        guestName: guestDetails.name,
        guestPhone: guestDetails.phone,
      });
      setBookingId(booking._id);
      updateBooking({ bookingId: booking._id, totalPrice: booking.totalPrice, totalNights: booking.totalNights });
      setStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking — please try again');
    } finally {
      setCreatingBooking(false);
    }
  };

  if (!room) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="font-serif text-3xl text-white text-center mb-1">Book Your Stay</h1>
        <p className="text-slate-400 text-center mb-8 text-sm">{room.name}</p>

        <StepIndicator currentStep={step} />

        {/* Step 1: Dates */}
        {step === 1 && (
          <div className="card p-6 space-y-6">
            <h2 className="font-serif text-xl text-white">Select Dates & Guests</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-1"><CalendarDays size={13} className="text-gold" /> Check-in</label>
                <DatePicker
                  selected={checkIn}
                  onChange={(d) => { setCheckIn(d); if (checkOut && d >= checkOut) setCheckOut(null); }}
                  minDate={new Date()} dateFormat="MMM d, yyyy" placeholderText="Select date" className="input"
                />
              </div>
              <div>
                <label className="label flex items-center gap-1"><CalendarDays size={13} className="text-gold" /> Check-out</label>
                <DatePicker
                  selected={checkOut} onChange={setCheckOut}
                  minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date(Date.now() + 86400000)}
                  dateFormat="MMM d, yyyy" placeholderText="Select date" className="input"
                />
              </div>
            </div>
            <div>
              <label className="label flex items-center gap-1"><Users size={13} className="text-gold" /> Guests</label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 rounded-full border border-slate-600 hover:border-gold text-slate-300 hover:text-gold transition-colors flex items-center justify-center text-xl leading-none">−</button>
                <span className="text-white font-semibold text-xl w-8 text-center">{guests}</span>
                <button type="button" onClick={() => setGuests(Math.min(room.capacity, guests + 1))} className="w-10 h-10 rounded-full border border-slate-600 hover:border-gold text-slate-300 hover:text-gold transition-colors flex items-center justify-center text-xl leading-none">+</button>
                <span className="text-slate-400 text-sm">Max {room.capacity} guests</span>
              </div>
            </div>
            {nights > 0 && (
              <div className="bg-navy rounded-xl p-4 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-slate-400">{nights} night{nights > 1 ? 's' : ''} × ${room.pricePerNight}</span><span className="text-white">${subtotal}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Taxes & fees</span><span className="text-white">${taxes}</span></div>
                <div className="flex justify-between font-semibold pt-2 border-t border-navy-lighter"><span className="text-white">Estimated total</span><span className="text-gold">${total}</span></div>
              </div>
            )}
            <button onClick={handleDateConfirm} disabled={checking || !checkIn || !checkOut} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {checking ? <><div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" /> Checking…</> : <>Continue <ChevronRight size={16} /></>}
            </button>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="card p-6 space-y-5">
            <h2 className="font-serif text-xl text-white">Review Your Booking</h2>
            <div className="flex gap-4 bg-navy rounded-xl p-4">
              <img src={room.images?.[0] || '/img/bed1.jpg'} alt={room.name} className="w-24 h-20 rounded-lg object-cover shrink-0" />
              <div>
                <h3 className="text-white font-semibold">{room.name}</h3>
                <p className="text-slate-400 text-sm capitalize">{room.type} Room · Floor {room.floor}</p>
                <p className="text-slate-400 text-sm">{guests} guest{guests > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ['Check-in', checkIn?.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })],
                ['Check-out', checkOut?.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })],
                [`${nights} night${nights > 1 ? 's' : ''} × $${room.pricePerNight}`, `$${subtotal}`],
                ['Taxes & fees (10%)', `$${taxes}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between"><span className="text-slate-400">{label}</span><span className="text-white">{value}</span></div>
              ))}
              <div className="flex justify-between font-semibold text-base border-t border-navy-lighter pt-3 mt-1">
                <span className="text-white">Total</span><span className="text-gold text-lg">${total}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline-gold flex items-center gap-1 flex-1"><ChevronLeft size={16} /> Back</button>
              <button onClick={() => setStep(3)} className="btn-gold flex items-center justify-center gap-1 flex-1">Continue <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 3: Guest Details */}
        {step === 3 && (
          <div className="card p-6 space-y-4">
            <h2 className="font-serif text-xl text-white">Guest Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input value={guestDetails.name} onChange={(e) => setGuestDetails({ ...guestDetails, name: e.target.value })} className="input" placeholder="John Doe" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={guestDetails.email} onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })} className="input" placeholder="you@example.com" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Phone (optional)</label>
                <input value={guestDetails.phone} onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })} className="input" placeholder="+256 700 000 000" />
              </div>
            </div>
            <div>
              <label className="label">Special Requests <span className="text-slate-500">(optional)</span></label>
              <textarea rows={3} value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Late check-in, dietary requirements…" className="input resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-outline-gold flex items-center gap-1 flex-1"><ChevronLeft size={16} /> Back</button>
              <button onClick={handleCreateBooking} disabled={creatingBooking} className="btn-gold flex items-center justify-center gap-1 flex-1 disabled:opacity-60">
                {creatingBooking ? <><div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" /> Preparing…</> : <>Continue to Payment <ChevronRight size={16} /></>}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && bookingId && (
          <div className="card p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Wallet size={18} className="text-gold" />
              <h2 className="font-serif text-xl text-white">Pay & Confirm Your Booking</h2>
            </div>
            <p className="text-slate-400 text-sm -mt-3">
              Your room is reserved. Pay with either option below to confirm it — you'll pay directly, with no card needed.
            </p>

            <PaymentInstructions amount={total} reference={bookingId.slice(-8).toUpperCase()} />

            <button
              onClick={() => router.push(`/booking/confirm/${bookingId}`)}
              className="btn-gold w-full text-base py-4"
            >
              I've Made the Payment
            </button>
            <p className="text-center text-slate-500 text-xs -mt-3">
              Not ready yet? You can finish paying anytime from “My Bookings”.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingPageWrapper() {
  return (
    <ProtectedRoute>
      <BookingPage />
    </ProtectedRoute>
  );
}
