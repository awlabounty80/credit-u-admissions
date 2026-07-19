'use client';

import { useState } from 'react';
import { admissionsCeremonySteps } from '../../data/admissionsCopy';
import { trackCreditUEvent } from '../../lib/analytics';

export function AdmissionsCeremony({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState(0);
  const complete = step >= admissionsCeremonySteps.length - 1;
  return (
    <section className="rounded-[2rem] border border-white/10 bg-blue-950 p-7 text-white shadow-xl">
      <p className="text-sm font-black tracking-[0.25em] text-yellow-300">ADMISSIONS CEREMONY</p>
      <h3 className="mt-2 text-3xl font-black">{admissionsCeremonySteps[step]}</h3>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {admissionsCeremonySteps.map((item, index) => (
          <div key={item} className={`rounded-2xl p-4 text-sm font-bold ${index <= step ? 'bg-yellow-300 text-blue-950' : 'bg-white/10 text-white/70'}`}>
            {index + 1}. {item}
          </div>
        ))}
      </div>
      <button
        className="mt-6 rounded-2xl bg-yellow-300 px-7 py-4 font-black text-blue-950 shadow-xl"
        onClick={() => {
          if (complete) {
            trackCreditUEvent('admissions_ceremony_completed');
            onComplete?.();
          } else {
            setStep(step + 1);
          }
        }}
      >
        {complete ? 'Enter Admissions →' : 'Continue Ceremony →'}
      </button>
    </section>
  );
}
