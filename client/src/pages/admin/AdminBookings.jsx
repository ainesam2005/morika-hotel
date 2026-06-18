import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const AdminNav = () => (
  <nav className="bg-navy-light border-b border-navy-lighter mb-8 -mx-4 px-4">
    <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto py-2">
      {[['Dashboard', '/admin'], ['Rooms', '/admin/rooms'], ['Bookings', '/admin/bookings'], ['Messages', '/admin/messages']].map(([label, to]) => (
        <Link key={to} to={to} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-gold hover:bg-navy-lighter transition-colors whitespace-nowrap">{label}</Link>
      ))}
    </div>
  </nav>
);

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-900/20',
  confirmed: 'text-green-400 bg-green-900/20',
  cancelled: 'text-red-400 bg-red-900/20',
  completed: 'text-blue-400 bg-blue-900/20',
};
const PAYMENT_COLORS = {
  pending: 'text-orange-400',
  paid: 'text-green-400',
  refunded: 'text-blue-400',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = () => {
    api.get('/bookings').then(({ data }) => setBookings(data)).catch(() => {}).finally(() => setLoading(false));
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.put(`/bookings/${id}/status`, { status });
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: data.status } : b));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this booking permanently?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.success('Booking deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = filter ? bookings.filter((b) => b.status === filter) : bookings;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <AdminNav />
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <h1 className="font-serif text-3xl text-white">Manage Bookings</h1>
          <div className="flex gap-2">
            {['', 'pending', 'confirmed', 'cancelled', 'completed'].map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === s ? 'bg-gold text-navy' : 'bg-navy-light text-slate-400 hover:text-gold border border-navy-lighter'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-navy-light rounded-xl border border-navy-lighter overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-slate-500 text-xs uppercase border-b border-navy-lighter">
                  <th className="px-4 py-3 text-left">Ref</th>
                  <th className="px-4 py-3 text-left">Guest</th>
                  <th className="px-4 py-3 text-left">Room</th>
                  <th className="px-4 py-3 text-left">Dates</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-navy-lighter">
                      {[...Array(8)].map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-navy-lighter rounded animate-pulse w-16" /></td>)}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-10 text-slate-400">No bookings found</td></tr>
                ) : filtered.map((b) => (
                  <tr key={b._id} className="border-b border-navy-lighter hover:bg-navy-lighter/30 transition-colors">
                    <td className="px-4 py-4 text-slate-500 font-mono text-xs">{b._id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-4">
                      <p className="text-slate-300 text-sm">{b.user?.name}</p>
                      <p className="text-slate-500 text-xs">{b.user?.email}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-300 text-sm">{b.room?.name}</td>
                    <td className="px-4 py-4 text-xs text-slate-400">
                      {new Date(b.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {' → '}
                      {new Date(b.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-4 text-gold text-sm">${b.totalPrice}</td>
                    <td className="px-4 py-4">
                      <span className={`capitalize text-xs font-medium ${PAYMENT_COLORS[b.paymentStatus]}`}>{b.paymentStatus}</span>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        className={`text-xs font-medium bg-transparent border border-navy-lighter rounded px-2 py-1 capitalize ${STATUS_COLORS[b.status]?.split(' ')[0]}`}
                      >
                        {['pending', 'confirmed', 'cancelled', 'completed'].map((s) => <option key={s} value={s} className="bg-navy-light text-slate-300">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => handleDelete(b._id)} className="w-8 h-8 rounded-lg bg-navy hover:bg-red-900/30 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
