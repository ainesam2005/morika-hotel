import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.phone);
      toast.success(`Welcome to Morika Hotel, ${user.name.split(' ')[0]}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="/img/scenery.jpg" alt="Morika Hotel Presidential Suite" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-navy/60 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mb-4">
            <span className="text-navy text-2xl font-bold font-serif">M</span>
          </div>
          <h2 className="font-serif text-4xl text-white mb-3">Join Us</h2>
          <p className="text-slate-300 text-lg">Create your account and unlock exclusive member rates, early check-in, and premium perks.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-navy">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
                <span className="text-navy font-bold text-sm">M</span>
              </div>
              <span className="font-serif text-xl text-white">Morika <span className="text-gold">Hotel</span></span>
            </Link>
            <h1 className="font-serif text-3xl text-white mb-2">Create Account</h1>
            <p className="text-slate-400">Already have an account? <Link to="/login" className="text-gold hover:underline">Sign in</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="input" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" className="input" />
              </div>
            </div>
            <div>
              <label className="label">Email Address</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="input" />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input required type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" className="input pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-gold transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input required type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••" className="input" />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
