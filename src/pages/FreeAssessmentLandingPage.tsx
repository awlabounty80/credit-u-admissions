import React from 'react';
import CreditUAssessmentFunnelCard from '../components/CreditUAssessmentFunnelCard';

export default function FreeAssessmentLandingPage() {
  return (
    <main className="min-h-screen bg-cream px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <CreditUAssessmentFunnelCard />

        <section className="mx-auto mt-10 max-w-5xl rounded-[2rem] bg-white p-6 shadow-sm md:p-10 text-left">
          <p className="text-sm font-black uppercase tracking-[.18em] text-campusBlue">Why this matters</p>
          <h2 className="mt-2 text-3xl font-black text-creditBlue">This is not a credit quiz. It is your Credit U entrance experience.</h2>
          <p className="mt-4 text-lg leading-8 text-ink/75">
            Students leave with clarity, language, identity, and a recommended path. The goal is to turn curiosity into confidence and confidence into enrollment.
          </p>
        </section>
      </div>
    </main>
  );
}
