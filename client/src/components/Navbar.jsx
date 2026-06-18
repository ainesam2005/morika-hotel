import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
              <span className="text-navy font-bold text-sm">M</span>
            </div>
            <span className="font-serif text-xl text-white">Morika <span className="text-gold">Hotel</span></span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-gold' : 'text-slate-300 hover:text-gold'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Auth section */}
          <div className="hidden md:flex items-center gap-3">
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
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-gold hover:bg-navy-lighter transition-colors">
                      <User size={14} /> My Bookings
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-gold hover:bg-navy-lighter transition-colors">
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
                <Link to="/login" className="text-sm text-slate-300 hover:text-gold transition-colors">Login</Link>
                <Link to="/register" className="btn-gold text-sm py-2 px-4">Book Now</Link>
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
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `block text-sm font-medium py-2 ${isActive ? 'text-gold' : 'text-slate-300'}`}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="border-t border-navy-lighter pt-3 space-y-2">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block text-sm text-slate-300 py-2">My Bookings</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block text-sm text-slate-300 py-2">Admin Panel</Link>}
                <button onClick={handleLogout} className="block text-sm text-slate-300 py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm text-slate-300 py-2">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-gold inline-block text-sm py-2 px-4">Book Now</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
