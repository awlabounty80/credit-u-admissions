'use client';

import { useEffect, useState } from 'react';
import { trackAdmissionsEvent } from '../../lib/admissionsTracking';

export function AIAdmissionsReview({ enabled, onComplete }: { enabled: boolean; onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    trackAdmissionsEvent('ai_review_started');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          clearInterval(interval);
          trackAdmissionsEvent('ai_review_completed');
          onComplete();
          return 100;
        }
        return current + 10;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [enabled, onComplete]);

  return (
    <div className={`rounded-3xl border p-8 shadow-2xl ${enabled ? 'border-yellow-300/25 bg-blue-900' : 'border-white/10 bg-white/5 opacity-60'}`}>
      <span className="rounded-full bg-yellow-300 px-4 py-2 text-xs font-black uppercase text-blue-950">Step 3</span>
      <h2 className="mt-6 text-3xl font-black uppercase">AI Admissions Review</h2>
      <p className="mt-4 text-blue-100">Credit U Admissions is reviewing the student profile, GPA, goals, and recommended path.</p>
      <div className="mt-8 h-4 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-yellow-300 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-4 text-sm text-blue-100">{enabled ? `${progress}% reviewed` : 'Locked until assessment is complete.'}</p>
    </div>
  );
}
