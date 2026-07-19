'use client';

import { admissionsHeroCopy } from '../../data/admissionsCopy';
import { TrustIndicators } from '../security/TrustIndicators';
import { EducationalDisclaimer } from '../security/EducationalDisclaimer';
import { trackCreditUEvent } from '../../lib/analytics';

export function EliteAdmissionsHero({ onStart, onPreview }: { onStart?: () => void; onPreview?: () => void }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 p-8 shadow-2xl md:p-12">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,213,79,.35),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,.22),transparent_24%)]" />
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-black tracking-[0.3em] text-yellow-300">{admissionsHeroCopy.eyebrow}</p>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
              {admissionsHeroCopy.headline}
            </h1>
            <h2 className="text-2xl font-extrabold text-yellow-300 md:text-3xl">{admissionsHeroCopy.subheadline}</h2>
            <p className="max-w-2xl text-lg leading-relaxed text-white/85">{admissionsHeroCopy.body}</p>
          </div>
          <TrustIndicators />
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => {
                trackCreditUEvent('elite_admissions_start_clicked', { location: 'hero' });
                onStart?.();
              }}
              className="rounded-2xl bg-yellow-300 px-7 py-4 font-black text-blue-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-yellow-200"
            >
              {admissionsHeroCopy.primaryCta} →
            </button>
            <button
              onClick={() => {
                trackCreditUEvent('elite_admissions_preview_clicked', { location: 'hero' });
                onPreview?.();
              }}
              className="rounded-2xl border border-white/30 bg-white/10 px-7 py-4 font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              {admissionsHeroCopy.secondaryCta}
            </button>
          </div>
          <EducationalDisclaimer />
        </div>
        <div className="rounded-[2rem] border border-yellow-300/20 bg-white/95 p-6 text-blue-950 shadow-2xl">
          <p className="text-xs font-black tracking-[0.25em] text-blue-700">ADMISSIONS OFFICE</p>
          <h3 className="mt-2 text-2xl font-black">No two students receive the same path.</h3>
          <p className="mt-3 text-sm leading-relaxed text-blue-900/75">
            Your recommendations are built from your responses, goals, confidence level, and current financial readiness.
          </p>
          <div className="mt-6 grid gap-3">
            {['Financial GPA™', 'Financial DNA™', 'Campus Placement™', 'Degree Plan™', 'Admissions Decision™'].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <span className="font-black text-blue-900">{index + 1}. {item}</span>
                <span className="text-yellow-600">★</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
