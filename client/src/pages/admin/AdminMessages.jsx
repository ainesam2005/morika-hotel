import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
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

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/messages').then(({ data }) => setMessages(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleRead = async (id) => {
    try {
      await api.patch(`/messages/${id}/read`);
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, isRead: true } : m));
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const toggleExpand = (id) => {
    const msg = messages.find((m) => m._id === id);
    if (!msg.isRead) handleRead(id);
    setExpanded(expanded === id ? null : id);
  };

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <AdminNav />
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-serif text-3xl text-white">Messages</h1>
          {unread > 0 && <span className="bg-gold text-navy text-xs font-bold px-2 py-0.5 rounded-full">{unread} unread</span>}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="card p-5 animate-pulse h-20" />)}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Mail size={48} className="mx-auto mb-4 opacity-30" />
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg._id} className={`card border transition-colors ${!msg.isRead ? 'border-gold/30' : 'border-navy-lighter'}`}>
                <div className="p-5 cursor-pointer" onClick={() => toggleExpand(msg._id)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`mt-1 shrink-0 ${msg.isRead ? 'text-slate-500' : 'text-gold'}`}>
                        {msg.isRead ? <MailOpen size={16} /> : <Mail size={16} />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-medium text-sm ${msg.isRead ? 'text-slate-300' : 'text-white'}`}>{msg.name}</p>
                          <span className="text-slate-500 text-xs">{msg.email}</span>
                          {!msg.isRead && <span className="w-2 h-2 rounded-full bg-gold shrink-0" />}
                        </div>
                        <p className={`text-sm truncate ${msg.isRead ? 'text-slate-500' : 'text-slate-300'}`}>
                          <span className="font-medium text-slate-400">{msg.subject}</span>
                          {' — '}{msg.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-slate-500 text-xs">{new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }} className="w-7 h-7 rounded-lg bg-navy hover:bg-red-900/30 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
                {expanded === msg._id && (
                  <div className="px-5 pb-5 pt-0 border-t border-navy-lighter">
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm mb-3">
                      <span className="text-slate-400">From: <span className="text-slate-300">{msg.name}</span></span>
                      <span className="text-slate-400">Email: <span className="text-gold">{msg.email}</span></span>
                      {msg.phone && <span className="text-slate-400">Phone: <span className="text-slate-300">{msg.phone}</span></span>}
                      <span className="text-slate-400">Subject: <span className="text-slate-300">{msg.subject}</span></span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed bg-navy rounded-lg p-4">{msg.message}</p>
                    <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} className="mt-3 btn-outline-gold text-sm py-1.5 px-4 inline-block">Reply via Email</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
