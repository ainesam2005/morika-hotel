'use client';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import { BookingProvider } from '../context/BookingContext';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <BookingProvider>
        <ThemeProvider>
          <Toaster
            position="top-right"
            toastOptions={{ style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #d4a843' } }}
          />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </BookingProvider>
    </AuthProvider>
  );
}
