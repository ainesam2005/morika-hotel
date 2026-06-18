import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
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

const EMPTY = { name: '', description: '', type: 'single', pricePerNight: '', capacity: '', sizeSqm: '', floor: '', amenities: '', images: '' };

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | room obj
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = () => {
    api.get('/rooms').then(({ data }) => setRooms(data)).catch(() => {}).finally(() => setLoading(false));
  };

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (room) => {
    setForm({ ...room, amenities: room.amenities?.join(', ') || '', images: room.images?.join('\n') || '' });
    setModal(room);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      pricePerNight: Number(form.pricePerNight),
      capacity: Number(form.capacity),
      sizeSqm: Number(form.sizeSqm) || undefined,
      floor: Number(form.floor) || undefined,
      amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      images: form.images.split('\n').map((u) => u.trim()).filter(Boolean),
    };
    try {
      if (modal === 'add') {
        await api.post('/rooms', payload);
        toast.success('Room created');
      } else {
        await api.put(`/rooms/${modal._id}`, payload);
        toast.success('Room updated');
      }
      setModal(null);
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save room');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this room? This cannot be undone.')) return;
    try {
      await api.delete(`/rooms/${id}`);
      setRooms((prev) => prev.filter((r) => r._id !== id));
      toast.success('Room deleted');
    } catch {
      toast.error('Failed to delete room');
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <AdminNav />
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-white">Manage Rooms</h1>
          <button onClick={openAdd} className="btn-gold flex items-center gap-2 text-sm py-2 px-4"><Plus size={16} /> Add Room</button>
        </div>

        <div className="bg-navy-light rounded-xl border border-navy-lighter overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-slate-500 text-xs uppercase border-b border-navy-lighter">
                  <th className="px-5 py-3 text-left">Room</th>
                  <th className="px-5 py-3 text-left">Type</th>
                  <th className="px-5 py-3 text-left">Price/Night</th>
                  <th className="px-5 py-3 text-left">Capacity</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-navy-lighter">
                      {[...Array(6)].map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-navy-lighter rounded animate-pulse w-24" /></td>)}
                    </tr>
                  ))
                ) : rooms.map((room) => (
                  <tr key={room._id} className="border-b border-navy-lighter hover:bg-navy-lighter/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={room.images?.[0]} alt="" className="w-12 h-10 rounded object-cover" />
                        <span className="text-white text-sm font-medium">{room.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-300 text-sm capitalize">{room.type}</td>
                    <td className="px-5 py-4 text-gold text-sm">${room.pricePerNight}</td>
                    <td className="px-5 py-4 text-slate-300 text-sm">{room.capacity}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${room.isAvailable ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {room.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(room)} className="w-8 h-8 rounded-lg bg-navy hover:bg-navy-lighter flex items-center justify-center text-slate-400 hover:text-gold transition-colors">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(room._id)} className="w-8 h-8 rounded-lg bg-navy hover:bg-red-900/30 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-navy-light border border-navy-lighter rounded-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-5 border-b border-navy-lighter">
              <h2 className="font-serif text-xl text-white">{modal === 'add' ? 'Add New Room' : 'Edit Room'}</h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-gold"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Room Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input">
                    {['single', 'double', 'deluxe', 'suite'].map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Price Per Night ($)</label>
                  <input required type="number" min={0} value={form.pricePerNight} onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label">Capacity (guests)</label>
                  <input required type="number" min={1} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label">Size (m²)</label>
                  <input type="number" value={form.sizeSqm} onChange={(e) => setForm({ ...form, sizeSqm: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label">Floor</label>
                  <input type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label">Available</label>
                  <select value={form.isAvailable ? 'true' : 'false'} onChange={(e) => setForm({ ...form, isAvailable: e.target.value === 'true' })} className="input">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Description</label>
                  <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Amenities (comma separated)</label>
                  <input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="Free WiFi, Air Conditioning, Mini Bar" className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Image URLs (one per line)</label>
                  <textarea rows={3} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." className="input resize-none font-mono text-xs" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="btn-outline-gold flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
                  {saving ? 'Saving...' : 'Save Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
