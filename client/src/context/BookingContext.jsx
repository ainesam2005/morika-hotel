import { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookingData, setBookingData] = useState({
    room: null,
    checkIn: null,
    checkOut: null,
    guests: 1,
    totalNights: 0,
    totalPrice: 0,
    bookingId: null,
    specialRequests: '',
  });

  const updateBooking = (updates) => setBookingData((prev) => ({ ...prev, ...updates }));
  const resetBooking = () => setBookingData({
    room: null, checkIn: null, checkOut: null, guests: 1,
    totalNights: 0, totalPrice: 0, bookingId: null, specialRequests: '',
  });

  return (
    <BookingContext.Provider value={{ bookingData, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
