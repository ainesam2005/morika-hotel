import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Users, CalendarDays, ChevronLeft, ChevronRight,
  CreditCard, Lock, CheckCircle, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import StepIndicator from '../components/StepIndicator';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// ─── Card number formatter: "4242424242424242" → "4242 4242 4242 4242"
function fmtCard(v) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})(?=.)/g, '$1 ');
}
// ─── Expiry formatter: "1225" → "12/25"
function fmtExpiry(v) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
// ─── Detect card brand from first digit
function cardBrand(num) {
  const n = num.replace(/\s/g, '');
  if (n.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  return null;
}

// ─── Payment Form ────────────────────────────────────────────────────────────
function PaymentForm({ bookingId, totalPrice, room, nights, onSuccess }) {
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    const num = card.number.replace(/\s/g, '');
    if (num.length < 16) e.number = 'Enter a valid 16-digit card number';
    if (card.expiry.length < 5) e.expiry = 'Enter expiry MM/YY';
    if (card.cvc.length < 3) e.cvc = 'Enter 3-digit CVC';
    if (!card.name.trim()) e.name = 'Enter cardholder name';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/payments/process', { bookingId });
      toast.success('Payment successful!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed — please try again');
    } finally {
      setLoading(false);
    }
  };

  const brand = cardBrand(card.number);

  return (
    <form onSubmit={handlePay} className="space-y-5">
      {/* Demo notice */}
      <div className="flex items-start gap-3 bg-gold/10 border border-gold/30 rounded-xl p-4">
        <AlertCircle size={16} className="text-gold shrink-0 mt-0.5" />
        <div>
          <p className="text-gold text-xs font-semibold mb-0.5">Test Mode — No real charge</p>
          <p className="text-slate-400 text-xs">
            Use any name, <span className="text-white font-mono">4242 4242 4242 4242</span>, any future MM/YY, any 3-digit CVC.
          </p>
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-navy rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-3 pb-3 border-b border-navy-lighter">
          <img src={room?.images?.[0] || '/img/bed1.jpg'} alt="" className="w-14 h-12 rounded-lg object-cover" />
          <div>
            <p className="text-white text-sm font-medium">{room?.name}</p>
            <p className="text-slate-500 text-xs">{nights} night{nights !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex justify-between text-sm pt-1">
          <span className="text-slate-400">Room rate</span>
          <span className="text-white">${(room?.pricePerNight * nights).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Taxes & fees (10%)</span>
          <span className="text-white">${(room?.pricePerNight * nights * 0.1).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold border-t border-navy-lighter pt-2 mt-1">
          <span className="text-white">Total due today</span>
          <span className="text-gold">${totalPrice}</span>
        </div>
      </div>

      {/* Card fields */}
      <div className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="label flex items-center justify-between">
            <span className="flex items-center gap-1"><CreditCard size={13} className="text-gold" /> Card Number</span>
            {brand && <span className="text-gold text-xs font-semibold">{brand}</span>}
          </label>
          <input
            value={card.number}
            onChange={(e) => setCard({ ...card, number: fmtCard(e.target.value) })}
            placeholder="4242 4242 4242 4242"
            className={`input tracking-widest font-mono ${errors.number ? 'border-red-500' : ''}`}
            inputMode="numeric"
            autoComplete="cc-number"
          />
          {errors.number && <p className="text-red-400 text-xs mt-1">{errors.number}</p>}
        </div>

        {/* Expiry + CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Expiry Date</label>
            <input
              value={card.expiry}
              onChange={(e) => setCard({ ...card, expiry: fmtExpiry(e.target.value) })}
              placeholder="MM/YY"
              className={`input font-mono ${errors.expiry ? 'border-red-500' : ''}`}
              inputMode="numeric"
              autoComplete="cc-exp"
            />
            {errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}
          </div>
          <div>
            <label className="label">CVC / CVV</label>
            <input
              value={card.cvc}
              onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              placeholder="123"
              className={`input font-mono ${errors.cvc ? 'border-red-500' : ''}`}
              inputMode="numeric"
              autoComplete="cc-csc"
            />
            {errors.cvc && <p className="text-red-400 text-xs mt-1">{errors.cvc}</p>}
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="label">Cardholder Name</label>
          <input
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
            placeholder="John Doe"
            className={`input ${errors.name ? 'border-red-500' : ''}`}
            autoComplete="cc-name"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
      </div>

      {/* Pay button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full flex items-center justify-center gap-2 text-base py-4 disabled:opacity-60"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
        ) : (
          <Lock size={16} />
        )}
        {loading ? 'Processing Payment…' : `Pay $${totalPrice} Securely`}
      </button>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-4 text-slate-500 text-xs pt-1">
        <span className="flex items-center gap-1"><Lock size={11} /> SSL Encrypted</span>
        <span>·</span>
        <span>PCI Compliant</span>
        <span>·</span>
        <span>Instant Confirmation</span>
      </div>
    </form>
  );
}

// ─── Main Booking Page ───────────────────────────────────────────────────────
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
      .catch(() => navigate('/rooms'));
  }, [roomId]);

  const nights = checkIn && checkOut ? Math.ceil((checkOut - checkIn) / 86400000) : 0;
  const subtotal = room ? nights * room.pricePerNight : 0;
  const taxes = +(subtotal * 0.1).toFixed(2);
  const total = +(subtotal + taxes).toFixed(2);

  // Step 1 → 2: validate dates & check availability
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

  // Step 3 → 4: create booking record in DB, then show payment
  const handleCreateBooking = async () => {
    setCreatingBooking(true);
    try {
      const { data: booking } = await api.post('/bookings', {
        roomId,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
        specialRequests,
      });
      setBookingId(booking._id);
      updateBooking({
        bookingId: booking._id,
        totalPrice: booking.totalPrice,
        totalNights: booking.totalNights,
      });
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

        {/* ── Step 1: Dates & Guests ── */}
        {step === 1 && (
          <div className="card p-6 space-y-6">
            <h2 className="font-serif text-xl text-white">Select Dates & Guests</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-1">
                  <CalendarDays size={13} className="text-gold" /> Check-in
                </label>
                <DatePicker
                  selected={checkIn}
                  onChange={(d) => { setCheckIn(d); if (checkOut && d >= checkOut) setCheckOut(null); }}
                  minDate={new Date()}
                  dateFormat="MMM d, yyyy"
                  placeholderText="Select date"
                  className="input"
                />
              </div>
              <div>
                <label className="label flex items-center gap-1">
                  <CalendarDays size={13} className="text-gold" /> Check-out
                </label>
                <DatePicker
                  selected={checkOut}
                  onChange={setCheckOut}
                  minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date(Date.now() + 86400000)}
                  dateFormat="MMM d, yyyy"
                  placeholderText="Select date"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label flex items-center gap-1">
                <Users size={13} className="text-gold" /> Guests
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-10 h-10 rounded-full border border-slate-600 hover:border-gold text-slate-300 hover:text-gold transition-colors flex items-center justify-center text-xl leading-none"
                >−</button>
                <span className="text-white font-semibold text-xl w-8 text-center">{guests}</span>
                <button
                  type="button"
                  onClick={() => setGuests(Math.min(room.capacity, guests + 1))}
                  className="w-10 h-10 rounded-full border border-slate-600 hover:border-gold text-slate-300 hover:text-gold transition-colors flex items-center justify-center text-xl leading-none"
                >+</button>
                <span className="text-slate-400 text-sm">Max {room.capacity} guests</span>
              </div>
            </div>

            {nights > 0 && (
              <div className="bg-navy rounded-xl p-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{nights} night{nights > 1 ? 's' : ''} × ${room.pricePerNight}</span>
                  <span className="text-white">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Taxes & fees</span>
                  <span className="text-white">${taxes}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-navy-lighter">
                  <span className="text-white">Estimated total</span>
                  <span className="text-gold">${total}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleDateConfirm}
              disabled={checking || !checkIn || !checkOut}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {checking
                ? <><div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" /> Checking…</>
                : <>Continue <ChevronRight size={16} /></>
              }
            </button>
          </div>
        )}

        {/* ── Step 2: Review ── */}
        {step === 2 && (
          <div className="card p-6 space-y-5">
            <h2 className="font-serif text-xl text-white">Review Your Booking</h2>

            <div className="flex gap-4 bg-navy rounded-xl p-4">
              <img
                src={room.images?.[0] || '/img/bed1.jpg'}
                alt={room.name}
                className="w-24 h-20 rounded-lg object-cover shrink-0"
              />
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
                <div key={label} className="flex justify-between">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white">{value}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-base border-t border-navy-lighter pt-3 mt-1">
                <span className="text-white">Total</span>
                <span className="text-gold text-lg">${total}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline-gold flex items-center gap-1 flex-1">
                <ChevronLeft size={16} /> Back
              </button>
              <button onClick={() => setStep(3)} className="btn-gold flex items-center justify-center gap-1 flex-1">
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Guest Details ── */}
        {step === 3 && (
          <div className="card p-6 space-y-4">
            <h2 className="font-serif text-xl text-white">Guest Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  value={guestDetails.name}
                  onChange={(e) => setGuestDetails({ ...guestDetails, name: e.target.value })}
                  className="input"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={guestDetails.email}
                  onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                  className="input"
                  placeholder="you@example.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Phone (optional)</label>
                <input
                  value={guestDetails.phone}
                  onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                  className="input"
                  placeholder="+1 555 000 0000"
                />
              </div>
            </div>

            <div>
              <label className="label">Special Requests <span className="text-slate-500">(optional)</span></label>
              <textarea
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Late check-in, dietary requirements, anniversary setup…"
                className="input resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-outline-gold flex items-center gap-1 flex-1">
                <ChevronLeft size={16} /> Back
              </button>
              <button
                onClick={handleCreateBooking}
                disabled={creatingBooking}
                className="btn-gold flex items-center justify-center gap-1 flex-1 disabled:opacity-60"
              >
                {creatingBooking
                  ? <><div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" /> Preparing…</>
                  : <>Proceed to Payment <ChevronRight size={16} /></>
                }
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Payment ── */}
        {step === 4 && bookingId && (
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock size={16} className="text-gold" />
              <h2 className="font-serif text-xl text-white">Secure Payment</h2>
            </div>
            <PaymentForm
              bookingId={bookingId}
              totalPrice={total}
              room={room}
              nights={nights}
              onSuccess={() => navigate(`/booking/confirm/${bookingId}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
