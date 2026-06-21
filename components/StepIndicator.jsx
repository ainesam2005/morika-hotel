'use client';
import { Check } from 'lucide-react';

const STEPS = ['Dates', 'Review', 'Details', 'Payment'];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < currentStep;
        const active = step === currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                done ? 'bg-gold text-navy' : active ? 'bg-gold text-navy' : 'bg-navy-lighter text-slate-400'
              }`}>
                {done ? <Check size={16} /> : step}
              </div>
              <span className={`text-xs mt-1 hidden sm:block ${active ? 'text-gold' : done ? 'text-gold/70' : 'text-slate-500'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 mx-1 transition-colors ${done ? 'bg-gold' : 'bg-navy-lighter'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
