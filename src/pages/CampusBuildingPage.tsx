import React from 'react';
import { CampusBuildingGrid } from '../components/CampusBuildingGrid';
import { CampusButton } from '../components/CampusButton';

type BuildingInfo = {
  title: string;
  purpose: string;
};

const buildingsMap: Record<string, BuildingInfo> = {
  '/campus': {
    title: 'Campus',
    purpose: 'This modular campus building is additive. It can be expanded without changing your existing homepage, assessment logic, funnel card, or working routes.'
  },
  '/admissions': {
    title: 'Admissions Hall',
    purpose: 'Entrance assessment, welcome sequence, admissions decision, and next steps. Expandable without altering the core database structure.'
  },
  '/registrar': {
    title: 'Registrar Office',
    purpose: 'This modular campus building is additive. It can be expanded without changing your existing homepage, assessment logic, funnel card, or working routes.'
  },
  '/financial-lab': {
    title: 'Financial Lab',
    purpose: 'Credit simulators, scenarios, and lab exercises designed to improve score targets securely.'
  },
  '/library': {
    title: 'Credit U Library',
    purpose: 'Courses, study guides, textbooks, and lessons to guide student learning paths.'
  },
  '/student-union': {
    title: 'Student Union',
    purpose: 'Live announcements, accountability groups, and community discussions for active students.'
  },
  '/mission-800': {
    title: 'Mission 800 Center',
    purpose: 'Custom target goals, milestone badges, and step-by-step progress towards 800+ credit scores.'
  },
  '/graduation-hall': {
    title: 'Graduation Hall',
    purpose: 'Commencement ceremonies, certificates, alumni recognition, and celebration badges.'
  },
  '/business-school': {
    title: 'Business School',
    purpose: 'Business credit, funding readiness, entrepreneurship, and wealth-building education.'
  }
};

export default function CampusBuildingPage() {
  const path = window.location.pathname;
  const info = buildingsMap[path] || {
    title: 'Campus',
    purpose: 'This modular campus building is additive. It can be expanded without changing your existing homepage, assessment logic, funnel card, or working routes.'
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white text-left">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[.3em] text-yellow-300">Credit U™ Campus</p>
        <h1 className="mt-4 text-5xl font-black md:text-7xl">{info.title}</h1>
        <p className="mt-6 text-xl leading-relaxed text-slate-300">
          {info.purpose}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <CampusButton href="/free-assessment">Start Free Assessment™</CampusButton>
          <CampusButton href="/campus" className="bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20">Back to Campus</CampusButton>
        </div>
      </section>
      <CampusBuildingGrid />
    </main>
  );
}
