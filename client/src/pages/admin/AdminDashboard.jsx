import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, CalendarCheck, DollarSign, MessageSquare, TrendingUp, Users } from 'lucide-react';
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

export default function AdminDashboard() {
  const [stats, setStats] = useState({ rooms: 0, bookings: 0, revenue: 0, messages: 0, guests: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/rooms'), api.get('/bookings'), api.get('/messages')])
      .then(([{ data: rooms }, { data: bookings }, { data: messages }]) => {
        const revenue = bookings.filter((b) => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalPrice, 0);
        const guests = new Set(bookings.map((b) => b.user?._id)).size;
        setStats({ rooms: rooms.length, bookings: bookings.length, revenue, messages: messages.length, guests });
        setRecentBookings(bookings.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: BedDouble, label: 'Total Rooms', value: stats.rooms, color: 'text-blue-400', bg: 'bg-blue-900/20' },
    { icon: CalendarCheck, label: 'Total Bookings', value: stats.bookings, color: 'text-green-400', bg: 'bg-green-900/20' },
    { icon: DollarSign, label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, color: 'text-gold', bg: 'bg-gold/10' },
    { icon: MessageSquare, label: 'Messages', value: stats.messages, color: 'text-purple-400', bg: 'bg-purple-900/20' },
    { icon: Users, label: 'Unique Guests', value: stats.guests, color: 'text-cyan-400', bg: 'bg-cyan-900/20' },
    { icon: TrendingUp, label: 'Paid Bookings', value: recentBookings.filter((b) => b.paymentStatus === 'paid').length, color: 'text-emerald-400', bg: 'bg-emerald-900/20' },
  ];

  const STATUS_COLOR = { pending: 'text-yellow-400', confirmed: 'text-green-400', cancelled: 'text-red-400', completed: 'text-blue-400' };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <AdminNav />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Welcome back — here's what's happening at Morika Hotel</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {statCards.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-navy-light rounded-xl p-5 border border-navy-lighter">
              <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <p className="text-slate-400 text-sm mb-1">{label}</p>
              <p className="text-white text-2xl font-bold">{loading ? '—' : value}</p>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="bg-navy-light rounded-xl border border-navy-lighter overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-navy-lighter">
            <h2 className="text-white font-semibold">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-gold text-sm hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-slate-500 text-xs uppercase border-b border-navy-lighter">
                  <th className="px-5 py-3 text-left">Guest</th>
                  <th className="px-5 py-3 text-left">Room</th>
                  <th className="px-5 py-3 text-left">Check-in</th>
                  <th className="px-5 py-3 text-left">Total</th>
                  <th className="px-5 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b border-navy-lighter">
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-5 py-4"><div className="h-4 bg-navy-lighter rounded animate-pulse w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : recentBookings.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-400">No bookings yet</td></tr>
                ) : (
                  recentBookings.map((b) => (
                    <tr key={b._id} className="border-b border-navy-lighter hover:bg-navy-lighter/50 transition-colors">
                      <td className="px-5 py-4 text-slate-300 text-sm">{b.user?.name || '—'}</td>
                      <td className="px-5 py-4 text-slate-300 text-sm">{b.room?.name || '—'}</td>
                      <td className="px-5 py-4 text-slate-300 text-sm">{new Date(b.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                      <td className="px-5 py-4 text-gold text-sm font-medium">${b.totalPrice}</td>
                      <td className="px-5 py-4"><span className={`capitalize text-xs font-medium ${STATUS_COLOR[b.status]}`}>{b.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
