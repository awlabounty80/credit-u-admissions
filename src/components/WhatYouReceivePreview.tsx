'use client';

import { whatYouReceivePreviewData } from '../data/whatYouReceivePreviewData';
import { CampusButton } from './CampusButton';

export function WhatYouReceivePreview() {
  return (
    <section className="bg-blue-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[.3em] text-yellow-300">Assessment Unlocks</p>
          <h2 className="mt-3 text-4xl font-black md:text-6xl">Here’s what you’ll receive.</h2>
          <p className="mt-4 text-lg text-blue-100">Show the reward before the work. This raises curiosity, trust, and completion.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {whatYouReceivePreviewData.map((item) => (
            <article key={item.title} className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
              <h3 className="text-2xl font-black">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-blue-100">{item.description}</p>
              <div className="mt-5 space-y-2">
                {item.preview.map((line) => (
                  <div key={line} className="rounded-2xl bg-blue-900/60 px-4 py-3 text-sm font-bold text-white">{line}</div>
                ))}
              </div>
              <CampusButton href="/assessment-preview" eventName="preview_card_cta_clicked" className="mt-6 w-full">{item.cta}</CampusButton>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
