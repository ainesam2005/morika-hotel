'use client';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/messages', form);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const info = [
    { icon: MapPin, title: 'Address', lines: ['123 Luxury Boulevard', 'City Center, 10001'] },
    { icon: Phone, title: 'Phone', lines: ['+1 (555) 123-4567', '+1 (555) 123-4568'] },
    { icon: Mail, title: 'Email', lines: ['info@morikahotel.com', 'reservations@morikahotel.com'] },
    { icon: Clock, title: 'Hours', lines: ['Reservations: 24/7', 'Front Desk: 24/7'] },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="section-subtitle">Get in Touch</p>
          <h1 className="section-title">Contact Us</h1>
          <p className="text-slate-400 max-w-xl mx-auto">We're here to make your stay extraordinary. Reach out to us for reservations, inquiries, or any assistance you need.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {info.map(({ icon: Icon, title, lines }) => (
              <div key={title} className="bg-navy-light rounded-xl p-5 flex items-start gap-4 border border-navy-lighter">
                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{title}</p>
                  {lines.map((l) => <p key={l} className="text-slate-400 text-sm">{l}</p>)}
                </div>
              </div>
            ))}
            <div className="rounded-xl overflow-hidden h-48 bg-navy-light border border-navy-lighter flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="text-gold mx-auto mb-2" />
                <p className="text-slate-400 text-sm">123 Luxury Boulevard</p>
                <p className="text-slate-500 text-xs">City Center, 10001</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-navy-light rounded-2xl p-6 md:p-8 border border-navy-lighter">
              <h2 className="font-serif text-2xl text-white mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="input" />
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" className="input" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" className="input" />
                  </div>
                  <div>
                    <label className="label">Subject *</label>
                    <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input">
                      <option value="">Select subject</option>
                      <option>Room Reservation</option>
                      <option>Special Request</option>
                      <option>Event Inquiry</option>
                      <option>Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help you..." className="input resize-none" />
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" /> : <Send size={16} />}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
