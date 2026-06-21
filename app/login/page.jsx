'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      router.push(user.role === 'admin' ? '/admin' : from);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
            <span className="text-navy font-bold text-sm">M</span>
          </div>
          <span className="font-serif text-xl text-white">Morika <span className="text-gold">Hotel</span></span>
        </Link>
        <h1 className="font-serif text-3xl text-white mb-2">Sign In</h1>
        <p className="text-slate-400">Don't have an account? <Link href="/register" className="text-gold hover:underline">Create one</Link></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">Email Address</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="input" />
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input required type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="input pr-10" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-gold transition-colors">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-navy-light rounded-xl border border-navy-lighter text-sm">
        <p className="text-slate-400 mb-1">Demo Admin:</p>
        <p className="text-gold font-mono text-xs">admin@morika.com / Admin@1234</p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="/img/bed12.jpg" alt="Morika Hotel Junior Suite" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-navy/60 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mb-4">
            <span className="text-navy text-2xl font-bold font-serif">M</span>
          </div>
          <h2 className="font-serif text-4xl text-white mb-3">Welcome Back</h2>
          <p className="text-slate-300 text-lg">Sign in to manage your reservations and enjoy exclusive member benefits.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-navy">
        <Suspense fallback={<div className="text-slate-400">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
