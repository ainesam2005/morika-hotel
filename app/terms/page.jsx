export const metadata = {
  title: 'Terms of Service',
  description: 'Morika Hotel terms of service — booking policies, cancellation rules, and guest conduct guidelines.',
};

const sections = [
  { title: '1. Acceptance of Terms', body: 'By accessing and using the Morika Hotel website and booking services, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.' },
  { title: '2. Booking & Reservations', body: 'All bookings are subject to room availability. A booking is confirmed only after full payment is received and a confirmation email is sent. Morika Hotel reserves the right to cancel bookings in exceptional circumstances with a full refund.' },
  { title: '3. Cancellation Policy', body: 'Cancellations made more than 48 hours before check-in are eligible for a full refund. Cancellations within 48 hours of check-in are non-refundable. No-shows will be charged the full booking amount.' },
  { title: '4. Check-in & Check-out', body: 'Standard check-in is from 3:00 PM and check-out is by 11:00 AM. Early check-in and late check-out are subject to availability and may incur additional charges. Valid government-issued photo ID is required at check-in.' },
  { title: '5. Guest Conduct', body: 'Guests are expected to behave respectfully toward staff and other guests. Morika Hotel reserves the right to refuse service or ask guests to vacate the premises if their conduct is deemed disruptive or harmful.' },
  { title: '6. Liability', body: 'Morika Hotel is not liable for loss, theft, or damage to personal belongings during your stay. Guests are responsible for any damage caused to hotel property and may be charged accordingly.' },
  { title: '7. Modifications to Terms', body: 'Morika Hotel reserves the right to update these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms.' },
  { title: '8. Contact', body: 'For questions about these Terms, please contact us at legal@morikahotel.com or call +1 (555) 123-4567.' },
];

export default function Terms() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <p className="section-subtitle">Legal</p>
        <h1 className="font-serif text-4xl text-white mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: June 2025</p>
        {sections.map(({ title, body }) => (
          <div key={title} className="mb-8">
            <h2 className="text-white font-semibold text-lg mb-2">{title}</h2>
            <p className="text-slate-400 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
