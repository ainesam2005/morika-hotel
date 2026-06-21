'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BedDouble, CalendarCheck, DollarSign, MessageSquare, TrendingUp, Users } from 'lucide-react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import AdminRoute from '../../components/AdminRoute';
import AdminNav from '../../components/AdminNav';
import api from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';

function buildChartData(bookings) {
  const monthMap = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    monthMap[key] = { month: key, revenue: 0, bookings: 0 };
  }
  bookings.forEach((b) => {
    const d = new Date(b.createdAt || b.checkIn);
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (monthMap[key]) {
      monthMap[key].bookings += 1;
      if (b.paymentStatus === 'paid') monthMap[key].revenue += b.totalPrice;
    }
  });
  return Object.values(monthMap);
}

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: isDark ? '#1e293b' : '#ffffff', border: '1px solid #d4a843', borderRadius: 10, padding: '10px 16px', color: isDark ? '#f8fafc' : '#0f172a', fontSize: 13 }}>
      <p style={{ color: '#d4a843', fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === 'Revenue' ? `$${p.value.toLocaleString()}` : `${p.value} bookings`}
        </p>
      ))}
    </div>
  );
};

const STATUS_COLOR = { pending: 'text-yellow-400', confirmed: 'text-green-400', cancelled: 'text-red-400', completed: 'text-blue-400' };

function DashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [stats, setStats] = useState({ rooms: 0, bookings: 0, revenue: 0, messages: 0, guests: 0, paidBookings: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const axisColor = isDark ? '#64748b' : '#94a3b8';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';

  useEffect(() => {
    Promise.all([api.get('/rooms'), api.get('/bookings'), api.get('/messages')])
      .then(([{ data: rooms }, { data: bookings }, { data: messages }]) => {
        const paid = bookings.filter((b) => b.paymentStatus === 'paid');
        const revenue = paid.reduce((sum, b) => sum + b.totalPrice, 0);
        const guests = new Set(bookings.map((b) => b.user?._id)).size;
        setStats({ rooms: rooms.length, bookings: bookings.length, revenue, messages: messages.length, guests, paidBookings: paid.length });
        setRecentBookings(bookings.slice(0, 6));
        setChartData(buildChartData(bookings));
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
    { icon: TrendingUp, label: 'Paid Bookings', value: stats.paidBookings, color: 'text-emerald-400', bg: 'bg-emerald-900/20' },
  ];

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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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

        <div className="bg-navy-light rounded-xl border border-navy-lighter p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-semibold text-lg">Revenue & Bookings</h2>
              <p className="text-slate-400 text-sm mt-0.5">Last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded" style={{ background: '#d4a843' }} /> Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-1 rounded" style={{ background: '#60a5fa' }} /> Bookings
              </span>
            </div>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-500 text-sm">Loading chart…</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="revenue" orientation="left" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                <YAxis yAxisId="bookings" orientation="right" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Bar yAxisId="revenue" dataKey="revenue" name="Revenue" fill="#d4a843" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Line yAxisId="bookings" type="monotone" dataKey="bookings" name="Bookings" stroke="#60a5fa" strokeWidth={2.5} dot={{ fill: '#60a5fa', r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-navy-light rounded-xl border border-navy-lighter overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-navy-lighter">
            <h2 className="text-white font-semibold">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-gold text-sm hover:underline">View all</Link>
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
                      {[...Array(5)].map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-navy-lighter rounded animate-pulse w-20" /></td>)}
                    </tr>
                  ))
                ) : recentBookings.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-400">No bookings yet</td></tr>
                ) : recentBookings.map((b) => (
                  <tr key={b._id} className="border-b border-navy-lighter hover:bg-navy-lighter/50 transition-colors">
                    <td className="px-5 py-4 text-slate-300 text-sm">{b.user?.name || '—'}</td>
                    <td className="px-5 py-4 text-slate-300 text-sm">{b.room?.name || '—'}</td>
                    <td className="px-5 py-4 text-slate-300 text-sm">{new Date(b.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td className="px-5 py-4 text-gold text-sm font-medium">${b.totalPrice}</td>
                    <td className="px-5 py-4"><span className={`capitalize text-xs font-medium ${STATUS_COLOR[b.status]}`}>{b.status}</span></td>
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

export default function AdminDashboardWrapper() {
  return (
    <AdminRoute>
      <DashboardPage />
    </AdminRoute>
  );
}
