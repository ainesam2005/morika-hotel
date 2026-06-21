'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, Settings, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const links = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (href) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  const handleLogout = () => {
    logout();
    router.push('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
              <span className="text-navy font-bold text-sm">M</span>
            </div>
            <span className="font-serif text-xl text-white">Morika <span className="text-gold">Hotel</span></span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${isActive(l.href) ? 'text-gold' : 'text-slate-300 hover:text-gold'}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Theme toggle + Auth */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-gold hover:bg-navy-lighter transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-slate-300 hover:text-gold transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy font-semibold text-sm">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-navy-light border border-navy-lighter rounded-xl shadow-xl py-2 z-50">
                    <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-gold hover:bg-navy-lighter transition-colors">
                      <User size={14} /> My Bookings
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-gold hover:bg-navy-lighter transition-colors">
                        <Settings size={14} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-gold hover:bg-navy-lighter transition-colors">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm text-slate-300 hover:text-gold transition-colors">Login</Link>
                <Link href="/register" className="btn-gold text-sm py-2 px-4">Book Now</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-slate-300" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-light border-t border-navy-lighter px-4 py-4 space-y-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 ${isActive(l.href) ? 'text-gold' : 'text-slate-300'}`}
            >
              {l.label}
            </Link>
          ))}
          <div className="border-t border-navy-lighter pt-3 space-y-2">
            <button onClick={toggleTheme} className="flex items-center gap-2 text-sm text-slate-300 py-2 w-full">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="block text-sm text-slate-300 py-2">My Bookings</Link>
                {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="block text-sm text-slate-300 py-2">Admin Panel</Link>}
                <button onClick={handleLogout} className="block text-sm text-slate-300 py-2">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-sm text-slate-300 py-2">Login</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-gold inline-block text-sm py-2 px-4">Book Now</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
