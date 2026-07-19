'use client';

import { useState } from 'react';

const guideMessages = [
  'Welcome to campus. Your first stop is Admissions Hall.',
  'The Free Credit U Assessment™ helps reveal your Financial GPA™ and next step.',
  'After your results, visit the Registrar’s Office for records and your student path.',
  'Mission 800™ is where your strategy becomes action.'
];

export function CreditCowCampusGuide() {
  const [index, setIndex] = useState(0);
  return (
    <aside className="fixed bottom-5 right-5 z-50 max-w-xs rounded-[1.5rem] border border-yellow-300/50 bg-blue-950/95 p-4 text-white shadow-2xl backdrop-blur">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-300 font-black text-blue-950">CU</div>
        <div>
          <p className="text-xs font-black uppercase tracking-[.2em] text-yellow-200">Credit Cow™ Guide</p>
          <p className="mt-1 text-sm font-semibold leading-relaxed">{guideMessages[index]}</p>
          <button
            onClick={() => setIndex((index + 1) % guideMessages.length)}
            className="mt-3 rounded-full bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/20"
          >
            Next Tip
          </button>
        </div>
      </div>
    </aside>
  );
}
