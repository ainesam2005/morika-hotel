export const metadata = {
  title: 'Privacy Policy',
  description: 'Morika Hotel privacy policy — how we collect, use, and protect your personal information.',
};

const sections = [
  { title: '1. Information We Collect', body: 'We collect information you provide directly — such as your name, email address, phone number, and payment details when you create an account or make a booking. We also collect usage data such as IP address, browser type, and pages visited.' },
  { title: '2. How We Use Your Information', body: 'Your information is used to process reservations, send booking confirmations, provide customer support, improve our services, and send promotional communications (with your consent).' },
  { title: '3. Payment Security', body: 'All payment transactions are encrypted using SSL technology. We do not store full credit card numbers on our servers. Payments are processed through a PCI-DSS compliant payment processor.' },
  { title: '4. Data Sharing', body: 'We do not sell, trade, or rent your personal information to third parties. We may share data with service providers who assist in operating our website and services, subject to confidentiality agreements.' },
  { title: '5. Cookies', body: 'We use cookies to enhance your experience, maintain your session, and analyze site traffic. You can disable cookies through your browser settings, though some features may not function correctly.' },
  { title: '6. Data Retention', body: 'We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your data by contacting us at privacy@morikahotel.com.' },
  { title: '7. Your Rights', body: 'You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time by clicking "unsubscribe" in any email or contacting us directly.' },
  { title: '8. Contact Us', body: 'For privacy-related inquiries, please contact our Data Protection Officer at privacy@morikahotel.com or write to us at 123 Luxury Boulevard, City Center, 10001.' },
];

export default function Privacy() {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <p className="section-subtitle">Legal</p>
        <h1 className="font-serif text-4xl text-white mb-2">Privacy Policy</h1>
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
