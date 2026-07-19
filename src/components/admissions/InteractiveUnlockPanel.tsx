'use client';

import { useState } from 'react';
import { previewPanels } from '../../data/admissionsCopy';
import { trackCreditUEvent } from '../../lib/analytics';

export function InteractiveUnlockPanel() {
  const [active, setActive] = useState(previewPanels[0]);
  return (
    <section className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <div className="rounded-[2rem] border border-white/10 bg-blue-950 p-5 shadow-xl">
        <p className="text-sm font-black tracking-[0.25em] text-yellow-300">ASSESSMENT UNLOCKS</p>
        <div className="mt-5 grid gap-3">
          {previewPanels.map((panel, index) => (
            <button
              key={panel.id}
              onClick={() => {
                setActive(panel);
                trackCreditUEvent('preview_panel_opened', { panel: panel.id });
              }}
              className={`rounded-2xl border p-4 text-left transition ${active.id === panel.id ? 'border-yellow-300 bg-yellow-300 text-blue-950' : 'border-white/10 bg-white/10 text-white hover:bg-white/15'}`}
            >
              <span className="text-xs font-black opacity-70">{index + 1}</span>
              <span className="ml-3 font-black">{panel.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-[2rem] border border-yellow-300/20 bg-white p-7 text-blue-950 shadow-xl">
        <p className="text-xs font-black tracking-[0.25em] text-blue-700">PREVIEW CARD</p>
        <h3 className="mt-2 text-3xl font-black">{active.title}</h3>
        <p className="mt-3 text-blue-900/75">{active.summary}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {active.bullets.map((bullet) => (
            <div key={bullet} className="rounded-2xl bg-blue-50 p-4 font-bold text-blue-900">
              ✓ {bullet}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
