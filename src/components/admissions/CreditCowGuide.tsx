'use client';

import { useState } from 'react';

const messages = [
  'Welcome to Campus!',
  'I’ll be your Admissions Guide.',
  'Let’s see what major fits you best.',
  'Complete your assessment to unlock your Admissions Prize Wheel™.',
];

export function CreditCowGuide() {
  const [index, setIndex] = useState(0);
  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-xs rounded-3xl border border-yellow-300/30 bg-blue-950/95 p-4 text-white shadow-2xl backdrop-blur">
      <div className="flex gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-2xl">🐄</div>
        <div>
          <p className="text-xs font-black tracking-[0.18em] text-yellow-300">CREDIT COW™</p>
          <p className="mt-1 text-sm font-bold">{messages[index]}</p>
          <button className="mt-2 text-xs font-black text-yellow-300" onClick={() => setIndex((index + 1) % messages.length)}>
            Next tip →
          </button>
        </div>
      </div>
    </div>
  );
}
