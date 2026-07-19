'use client';

import { packetItems } from '../../data/admissionsFlowData';
import { trackAdmissionsEvent } from '../../lib/admissionsTracking';

export function AcceptancePacketPreview({ enabled, prize }: { enabled: boolean; prize: string | null }) {
  return (
    <div className={`rounded-3xl border p-8 shadow-2xl ${enabled ? 'border-yellow-300/25 bg-white text-blue-950' : 'border-white/10 bg-white/5 text-white opacity-60'}`}>
      <span className="rounded-full bg-yellow-300 px-4 py-2 text-xs font-black uppercase text-blue-950">Step 5</span>
      <h2 className="mt-6 text-3xl font-black uppercase">Acceptance Packet™ Unlocks</h2>
      <p className="mt-4 opacity-80">The student receives their admissions decision, report preview, and next-step pathway.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {packetItems.map((item) => (
          <div key={item} className="rounded-2xl border border-blue-200/40 bg-blue-50/10 p-4 font-bold">{item}</div>
        ))}
      </div>
      {prize && <p className="mt-5 rounded-2xl bg-yellow-300 p-4 font-black text-blue-950">Prize Included: {prize}</p>}
      <button
        disabled={!enabled}
        onClick={() => {
          trackAdmissionsEvent('dorm_week_cta_clicked');
          window.location.href = '/dorm-week-rush';
        }}
        className="mt-8 w-full rounded-2xl bg-blue-700 px-6 py-4 font-black uppercase text-white disabled:opacity-50"
      >
        Continue to Dorm Week Rush™
      </button>
    </div>
  );
}
