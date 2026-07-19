'use client';

import { useState } from 'react';
import { selectWeightedPrize } from '../../lib/prizeWheel';
import { trackAdmissionsEvent } from '../../lib/admissionsTracking';

export function AdmissionsPrizeWheel({ enabled, onPrize }: { enabled: boolean; onPrize: (prize: any) => void }) {
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  async function spin() {
    if (!enabled || spinning || selected) return;
    setSpinning(true);
    const prize = selectWeightedPrize();
    setTimeout(() => {
      setSelected(prize.value);
      setSpinning(false);
      onPrize(prize);
      trackAdmissionsEvent('wheel_spun', { prize_id: prize.id, prize_value: prize.value });
    }, 1400);
  }

  return (
    <div className={`rounded-3xl border p-8 shadow-2xl ${enabled ? 'border-yellow-300/25 bg-gradient-to-br from-blue-900 to-blue-950' : 'border-white/10 bg-white/5 opacity-60'}`}>
      <span className="rounded-full bg-yellow-300 px-4 py-2 text-xs font-black uppercase text-blue-950">Step 4</span>
      <h2 className="mt-6 text-3xl font-black uppercase">Spin The Admissions Prize Wheel™</h2>
      <p className="mt-4 text-blue-100">Unlocked after the Free Credit U Assessment™ and AI Admissions Review.</p>
      <div className={`mx-auto mt-8 flex h-52 w-52 items-center justify-center rounded-full border-8 border-yellow-300 bg-blue-800 text-center font-black shadow-2xl ${spinning ? 'animate-spin' : ''}`}>
        <span className="px-6 text-yellow-200">CREDIT U™ WHEEL</span>
      </div>
      <button
        onClick={spin}
        disabled={!enabled || spinning || Boolean(selected)}
        className="mt-8 w-full rounded-2xl bg-yellow-300 px-6 py-4 font-black uppercase text-blue-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {!enabled ? 'Locked Until Review Complete' : selected ? 'Prize Unlocked' : spinning ? 'Spinning...' : 'Spin My Admissions Wheel'}
      </button>
      {selected && <p className="mt-5 rounded-2xl bg-white/10 p-4 text-center font-bold text-yellow-200">You unlocked: {selected}</p>}
    </div>
  );
}
