'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  ['Dashboard', '/admin'],
  ['Rooms', '/admin/rooms'],
  ['Bookings', '/admin/bookings'],
  ['Messages', '/admin/messages'],
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="bg-navy-light border-b border-navy-lighter mb-8 -mx-4 px-4">
      <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto py-2">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              pathname === href ? 'bg-gold/10 text-gold' : 'text-slate-400 hover:text-gold hover:bg-navy-lighter'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
