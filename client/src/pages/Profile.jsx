import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const STATUS_CONFIG = {
  pending: { color: 'text-yellow-400 bg-yellow-900/30', icon: Clock, label: 'Pending Payment' },
  confirmed: { color: 'text-green-400 bg-green-900/30', icon: CheckCircle, label: 'Confirmed' },
  cancelled: { color: 'text-red-400 bg-red-900/30', icon: XCircle, label: 'Cancelled' },
  completed: { color: 'text-blue-400 bg-blue-900/30', icon: CheckCircle, label: 'Completed' },
};

export default function Profile() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my')
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-navy text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-serif text-3xl text-white">{user?.name}</h1>
            <p className="text-slate-400">{user?.email}</p>
          </div>
        </div>

        {/* Bookings */}
        <div>
          <h2 className="font-serif text-2xl text-white mb-6">My Reservations</h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-24 h-20 bg-navy-lighter rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-navy-lighter rounded w-1/3" />
                      <div className="h-4 bg-navy-lighter rounded w-1/2" />
                      <div className="h-4 bg-navy-lighter rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 bg-navy-light rounded-2xl border border-navy-lighter">
              <CalendarDays size={48} className="text-slate-600 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No bookings yet</h3>
              <p className="text-slate-400 mb-6">Explore our rooms and make your first reservation</p>
              <Link to="/rooms" className="btn-gold">Browse Rooms</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => {
                const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                return (
                  <div key={b._id} className="card p-5">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img src={b.room?.images?.[0]} alt={b.room?.name} className="w-full sm:w-28 h-24 rounded-lg object-cover shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-white font-semibold">{b.room?.name}</h3>
                          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shrink-0 ${cfg.color}`}>
                            <Icon size={11} /> {cfg.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
                          <div>
                            <p className="text-slate-500 text-xs">Check-in</p>
                            <p className="text-slate-300">{new Date(b.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Check-out</p>
                            <p className="text-slate-300">{new Date(b.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Nights</p>
                            <p className="text-slate-300">{b.totalNights}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Total</p>
                            <p className="text-gold font-semibold">${b.totalPrice}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 text-xs">Ref: {b._id.slice(-8).toUpperCase()}</span>
                          {b.status === 'pending' && (
                            <button onClick={() => handleCancel(b._id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Cancel</button>
                          )}
                          {b.status === 'pending' && (
                            <Link to={`/booking/${b.room?._id}`} className="text-xs text-gold hover:underline">Complete Payment</Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
