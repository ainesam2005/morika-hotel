'use client';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, Link2, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-light border-t border-navy-lighter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
                <span className="text-navy font-bold text-sm">M</span>
              </div>
              <span className="font-serif text-xl text-white">Morika <span className="text-gold">Hotel</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Where luxury meets elegance. Experience world-class hospitality in the heart of the city.
            </p>
            <div className="flex gap-3">
              {[Globe, Link2, Share2].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-navy-lighter flex items-center justify-center text-slate-400 hover:border-gold hover:text-gold transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/rooms', 'Our Rooms'], ['/services', 'Services'], ['/gallery', 'Gallery'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-gold text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {['Restaurant & Bar', 'Spa & Wellness', 'Swimming Pool', 'Fitness Center', 'Concierge', 'Airport Transfer'].map((s) => (
                <li key={s} className="text-slate-400 text-sm">{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-slate-400 text-sm">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                123 Luxury Boulevard, City Center, 10001
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone size={16} className="text-gold shrink-0" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail size={16} className="text-gold shrink-0" />
                info@morikahotel.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-lighter mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Morika Hotel. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-slate-500 hover:text-gold text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-500 hover:text-gold text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
