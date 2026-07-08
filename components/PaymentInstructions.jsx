'use client';
import { useState } from 'react';
import { Landmark, Smartphone, Copy, Check, Phone } from 'lucide-react';
import { HOTEL } from '../utils/hotelInfo';

function CopyRow({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard not available */ }
  };
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-slate-400 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-white text-sm font-medium">{value}</span>
        <button
          type="button"
          onClick={copy}
          title={`Copy ${label}`}
          className="text-slate-500 hover:text-gold transition-colors"
        >
          {copied ? <Check size={14} className="text-gold" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}

/**
 * Shows how to pay for a booking: bank transfer or Airtel Money,
 * the amount due, and the booking reference to quote.
 */
export default function PaymentInstructions({ amount, reference }) {
  return (
    <div className="space-y-4">
      {/* Amount + reference */}
      <div className="bg-navy rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs mb-0.5">Amount to pay</p>
          <p className="text-gold text-2xl font-semibold">${amount}</p>
        </div>
        {reference && (
          <div className="text-right">
            <p className="text-slate-400 text-xs mb-0.5">Use this reference</p>
            <p className="text-white font-mono text-sm tracking-wider">{reference}</p>
          </div>
        )}
      </div>

      {/* Bank transfer */}
      <div className="bg-navy rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Landmark size={16} className="text-gold" />
          <h3 className="text-white font-semibold text-sm">Pay by Bank Transfer</h3>
        </div>
        <div className="divide-y divide-navy-lighter">
          <CopyRow label="Bank" value={HOTEL.bank.name} />
          <CopyRow label="Account name" value={HOTEL.bank.accountName} />
          <CopyRow label="Account number" value={HOTEL.bank.accountNumber} />
        </div>
      </div>

      {/* Airtel Money */}
      <div className="bg-navy rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone size={16} className="text-gold" />
          <h3 className="text-white font-semibold text-sm">Pay by Airtel Money</h3>
        </div>
        <div className="divide-y divide-navy-lighter">
          <CopyRow label="Merchant code" value={HOTEL.airtel.merchantCode} />
          <CopyRow label="Merchant name" value={HOTEL.airtel.name} />
        </div>
        <p className="text-slate-500 text-xs mt-2">
          On your phone: Airtel Money → Pay Merchant → enter merchant code {HOTEL.airtel.merchantCode}.
        </p>
      </div>

      {/* Confirmation note */}
      <div className="flex items-start gap-3 bg-gold/10 border border-gold/30 rounded-xl p-4">
        <Phone size={16} className="text-gold shrink-0 mt-0.5" />
        <p className="text-slate-300 text-xs leading-relaxed">
          After you pay, your room is reserved and becomes fully confirmed once we check the payment.
          You can send your payment screenshot or reference to us on call or WhatsApp at{' '}
          <a href={HOTEL.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-gold font-medium">{HOTEL.phone}</a>.
        </p>
      </div>
    </div>
  );
}
