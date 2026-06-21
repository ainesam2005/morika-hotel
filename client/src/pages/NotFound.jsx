import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-gold text-8xl font-bold font-serif mb-4">404</p>
        <h1 className="font-serif text-3xl text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-10 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-gold flex items-center gap-2">
            <Home size={16} /> Back Home
          </Link>
          <Link to="/rooms" className="btn-outline-gold flex items-center gap-2">
            <Search size={16} /> Browse Rooms
          </Link>
        </div>
      </div>
    </div>
  );
}
