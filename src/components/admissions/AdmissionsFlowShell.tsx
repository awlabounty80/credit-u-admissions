'use client';

import { useEffect, useState } from 'react';
import { admissionsSteps } from '../../data/admissionsFlowData';
import { trackAdmissionsEvent } from '../../lib/admissionsTracking';
import { AdmissionsPrizeWheel } from './AdmissionsPrizeWheel';
import { AIAdmissionsReview } from './AIAdmissionsReview';
import { AcceptancePacketPreview } from './AcceptancePacketPreview';

export function AdmissionsFlowShell() {
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);

  useEffect(() => {
    trackAdmissionsEvent('admissions_flow_viewed');
  }, []);

  return (
    <main className="min-h-screen bg-[#061851] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm uppercase tracking-[0.35em] text-yellow-300">Credit U Admissions™</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-tight md:text-7xl">
          Begin With The Free Credit U Assessment™
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-blue-100">
          Your existing Entrance Exam stays protected. This flow enhances the student journey with admissions, AI review, prize wheel rewards, and an acceptance packet.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {admissionsSteps.map((step, index) => {
            const unlocked = index < 2 || assessmentComplete || reviewComplete || prize;
            return (
              <div key={step.id} className="rounded-2xl border border-white/15 bg-white/8 p-4 shadow-2xl backdrop-blur">
                <div className="text-xs uppercase tracking-widest text-yellow-300">Step {index + 1}</div>
                <div className="mt-2 font-bold">{step.label}</div>
                <div className="mt-3 text-xs text-blue-100">{unlocked ? 'Available' : 'Locked'}</div>
              </div>
            );
          })}
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-yellow-300/25 bg-gradient-to-br from-blue-950 to-blue-800 p-8 shadow-2xl">
            <span className="rounded-full bg-yellow-300 px-4 py-2 text-xs font-black uppercase text-blue-950">Step 2</span>
            <h2 className="mt-6 text-3xl font-black uppercase">Take The Free Credit U Assessment™</h2>
            <p className="mt-4 text-blue-100">
              Public-facing enhancement of the current Entrance Exam. Keep the current logic untouched, but present it as a premium admissions assessment.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-blue-50">
              <li>✓ Calculate Financial GPA™</li>
              <li>✓ Unlock Campus Placement™</li>
              <li>✓ Receive personalized Degree Plan™</li>
            </ul>
            <button
              onClick={() => {
                trackAdmissionsEvent('assessment_start_clicked');
                window.location.href = '/free-assessment/start';
              }}
              className="mt-8 w-full rounded-2xl bg-yellow-300 px-6 py-4 font-black uppercase text-blue-950 shadow-xl transition hover:scale-[1.01]"
            >
              Start My Free Assessment
            </button>
            <button
              onClick={() => setAssessmentComplete(true)}
              className="mt-3 w-full rounded-2xl border border-white/30 px-6 py-4 font-black uppercase text-white"
            >
              Demo: Mark Assessment Complete
            </button>
          </div>

          <AIAdmissionsReview enabled={assessmentComplete} onComplete={() => setReviewComplete(true)} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <AdmissionsPrizeWheel enabled={reviewComplete} onPrize={(selected) => setPrize(selected.value)} />
          <AcceptancePacketPreview enabled={Boolean(prize)} prize={prize} />
        </section>
      </section>
    </main>
  );
}
