import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Users, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import StepIndicator from '../components/StepIndicator';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

// ---- Payment Form (inner Stripe component) ----
function PaymentForm({ bookingId, totalPrice, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/booking/confirm/${bookingId}` },
        redirect: 'if_required',
      });
      if (error) {
        toast.error(error.message);
      } else {
        // Mark booking paid on our end
        await api.get(`/bookings/${bookingId}`);
        onSuccess();
      }
    } catch {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      <button type="submit" disabled={!stripe || loading} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-4">
        {loading ? <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" /> : null}
        {loading ? 'Processing...' : `Pay $${totalPrice}`}
      </button>
      <p className="text-xs text-slate-500 text-center">Test card: 4242 4242 4242 4242 · Any future date · Any CVC</p>
    </form>
  );
}

// ---- Main Booking Page ----
export default function Booking() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookingData, updateBooking } = useBooking();

  const [step, setStep] = useState(1);
  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState(bookingData.checkIn || null);
  const [checkOut, setCheckOut] = useState(bookingData.checkOut || null);
  const [guests, setGuests] = useState(bookingData.guests || 1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [guestDetails, setGuestDetails] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [bookingId, setBookingId] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    api.get(`/rooms/${roomId}`).then(({ data }) => setRoom(data)).catch(() => navigate('/rooms'));
  }, [roomId]);

  const nights = checkIn && checkOut ? Math.ceil((checkOut - checkIn) / 86400000) : 0;
  const subtotal = room ? nights * room.pricePerNight : 0;
  const taxes = +(subtotal * 0.1).toFixed(2);
  const total = +(subtotal + taxes).toFixed(2);

  const handleDateConfirm = async () => {
    if (!checkIn || !checkOut) return toast.error('Select check-in and check-out dates');
    if (nights < 1) return toast.error('Minimum 1 night stay');
    setChecking(true);
    try {
      const { data } = await api.get('/rooms/check-availability', { params: { roomId, checkIn: checkIn.toISOString(), checkOut: checkOut.toISOString() } });
      if (!data.available) return toast.error('Room not available for selected dates');
      updateBooking({ checkIn, checkOut, guests, room });
      setStep(2);
    } catch {
      toast.error('Could not check availability');
    } finally {
      setChecking(false);
    }
  };

  const handleCreateBooking = async () => {
    try {
      const { data: booking } = await api.post('/bookings', {
        roomId, checkIn: checkIn.toISOString(), checkOut: checkOut.toISOString(), guests, specialRequests,
      });
      setBookingId(booking._id);
      updateBooking({ bookingId: booking._id, totalPrice: booking.totalPrice, totalNights: booking.totalNights });

      const { data: intentData } = await api.post('/payments/create-intent', { bookingId: booking._id });
      setClientSecret(intentData.clientSecret);
      setStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    }
  };

  const stripeOptions = clientSecret ? {
    clientSecret,
    appearance: { theme: 'night', variables: { colorPrimary: '#d4a843', colorBackground: '#1e293b', colorText: '#f8fafc', colorDanger: '#ef4444', fontFamily: 'Inter, sans-serif', borderRadius: '8px' } },
  } : null;

  if (!room) return <div className="pt-24 min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="font-serif text-3xl text-white text-center mb-2">Book Your Stay</h1>
        <p className="text-slate-400 text-center mb-8">{room.name}</p>

        <StepIndicator currentStep={step} />

        {/* Step 1: Dates */}
        {step === 1 && (
          <div className="card p-6 space-y-6">
            <h2 className="font-serif text-xl text-white">Select Dates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-1"><CalendarDays size={14} className="text-gold" /> Check-in</label>
                <DatePicker selected={checkIn} onChange={setCheckIn} minDate={new Date()} dateFormat="MMM d, yyyy" placeholderText="Select date" className="input" />
              </div>
              <div>
                <label className="label flex items-center gap-1"><CalendarDays size={14} className="text-gold" /> Check-out</label>
                <DatePicker selected={checkOut} onChange={setCheckOut} minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date(Date.now() + 86400000)} dateFormat="MMM d, yyyy" placeholderText="Select date" className="input" />
              </div>
            </div>
            <div>
              <label className="label flex items-center gap-1"><Users size={14} className="text-gold" /> Guests</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 rounded-full border border-slate-600 hover:border-gold text-slate-300 hover:text-gold transition-colors flex items-center justify-center text-lg">−</button>
                <span className="text-white font-semibold text-xl w-8 text-center">{guests}</span>
                <button onClick={() => setGuests(Math.min(room.capacity, guests + 1))} className="w-10 h-10 rounded-full border border-slate-600 hover:border-gold text-slate-300 hover:text-gold transition-colors flex items-center justify-center text-lg">+</button>
                <span className="text-slate-400 text-sm">Max {room.capacity}</span>
              </div>
            </div>
            {nights > 0 && (
              <div className="bg-navy rounded-xl p-4 flex justify-between items-center">
                <span className="text-slate-400 text-sm">{nights} night{nights > 1 ? 's' : ''} × ${room.pricePerNight}</span>
                <span className="text-gold font-semibold">${subtotal}</span>
              </div>
            )}
            <button onClick={handleDateConfirm} disabled={checking} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {checking ? <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" /> : null}
              {checking ? 'Checking...' : 'Continue'} {!checking && <ChevronRight size={16} />}
            </button>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="card p-6 space-y-5">
            <h2 className="font-serif text-xl text-white">Review Your Booking</h2>
            <div className="flex gap-4">
              <img src={room.images?.[0]} alt={room.name} className="w-24 h-20 rounded-lg object-cover" />
              <div>
                <h3 className="text-white font-semibold">{room.name}</h3>
                <p className="text-slate-400 text-sm capitalize">{room.type} Room · Floor {room.floor}</p>
                <p className="text-slate-400 text-sm">{guests} guest{guests > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="border-t border-navy-lighter pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Check-in</span>
                <span className="text-white">{checkIn?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Check-out</span>
                <span className="text-white">{checkOut?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{nights} nights × ${room.pricePerNight}</span>
                <span className="text-white">${subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Taxes & fees (10%)</span>
                <span className="text-white">${taxes}</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t border-navy-lighter pt-2 mt-2">
                <span className="text-white">Total</span>
                <span className="text-gold">${total}</span>
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
                <input value={guestDetails.name} onChange={(e) => setGuestDetails({ ...guestDetails, name: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={guestDetails.email} onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input value={guestDetails.phone} onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })} className="input" />
              </div>
            </div>
            <div>
              <label className="label">Special Requests (optional)</label>
              <textarea rows={3} value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Late check-in, dietary requirements, anniversary setup..." className="input resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-outline-gold flex items-center gap-1 flex-1"><ChevronLeft size={16} /> Back</button>
              <button onClick={handleCreateBooking} className="btn-gold flex items-center justify-center gap-1 flex-1">Proceed to Payment <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && clientSecret && stripeOptions && (
          <div className="card p-6">
            <h2 className="font-serif text-xl text-white mb-2">Secure Payment</h2>
            <div className="flex justify-between text-sm text-slate-400 mb-6 pb-4 border-b border-navy-lighter">
              <span>{room.name} · {nights} nights</span>
              <span className="text-gold font-semibold">${total}</span>
            </div>
            <Elements stripe={stripePromise} options={stripeOptions}>
              <PaymentForm bookingId={bookingId} totalPrice={total} onSuccess={() => navigate(`/booking/confirm/${bookingId}`)} />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
}
