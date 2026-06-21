'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Phone, Lock, ChevronLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) return toast.error('Name cannot be empty');
    setSavingProfile(true);
    try {
      const { data } = await api.put('/auth/profile', { name: profile.name, phone: profile.phone });
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!passwords.current) return toast.error('Enter your current password');
    if (passwords.new.length < 6) return toast.error('New password must be at least 6 characters');
    if (passwords.new !== passwords.confirm) return toast.error('New passwords do not match');
    setSavingPassword(true);
    try {
      await api.put('/auth/profile', { currentPassword: passwords.current, newPassword: passwords.new });
      setPasswords({ current: '', new: '', confirm: '' });
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/profile" className="flex items-center gap-1 text-slate-400 hover:text-gold mb-8 transition-colors text-sm">
          <ChevronLeft size={16} /> Back to Profile
        </Link>

        <h1 className="font-serif text-3xl text-white mb-8">Edit Profile</h1>

        <form onSubmit={handleProfileSave} className="bg-navy-light rounded-2xl border border-navy-lighter p-6 mb-6 space-y-5">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <User size={16} className="text-gold" /> Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input" placeholder="Your name" />
            </div>
            <div>
              <label className="label">Email</label>
              <input value={user?.email || ''} disabled className="input opacity-50 cursor-not-allowed" />
              <p className="text-slate-500 text-xs mt-1">Email cannot be changed</p>
            </div>
            <div className="sm:col-span-2">
              <label className="label flex items-center gap-1"><Phone size={13} className="text-gold" /> Phone (optional)</label>
              <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="input" placeholder="+1 555 000 0000" />
            </div>
          </div>
          <button type="submit" disabled={savingProfile} className="btn-gold flex items-center gap-2 disabled:opacity-60">
            {savingProfile ? <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
            {savingProfile ? 'Saving…' : 'Save Changes'}
          </button>
        </form>

        <form onSubmit={handlePasswordSave} className="bg-navy-light rounded-2xl border border-navy-lighter p-6 space-y-5">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Lock size={16} className="text-gold" /> Change Password
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="input" placeholder="Your current password" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">New Password</label>
                <input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} className="input" placeholder="Min. 6 characters" />
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="input" placeholder="Repeat new password" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={savingPassword} className="btn-gold flex items-center gap-2 disabled:opacity-60">
            {savingPassword ? <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" /> : <Lock size={16} />}
            {savingPassword ? 'Updating…' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EditProfileWrapper() {
  return (
    <ProtectedRoute>
      <EditProfilePage />
    </ProtectedRoute>
  );
}
