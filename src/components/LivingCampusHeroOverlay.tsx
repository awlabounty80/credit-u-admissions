'use client';

import { motion } from 'framer-motion';
import { CampusButton } from './CampusButton';

export function LivingCampusHeroOverlay() {
  return (
    <section className="relative overflow-hidden rounded-b-[3rem] bg-blue-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1d4ed8,transparent_35%),linear-gradient(180deg,rgba(2,6,23,.15),rgba(2,6,23,.92))]" />
      <motion.div
        aria-hidden
        className="absolute left-10 top-10 h-72 w-8 rotate-12 rounded-full bg-blue-400/35 blur-2xl"
        animate={{ x: [0, 40, 0], opacity: [0.45, 0.85, 0.45] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        aria-hidden
        className="absolute right-16 top-8 h-72 w-8 -rotate-12 rounded-full bg-yellow-300/35 blur-2xl"
        animate={{ x: [0, -35, 0], opacity: [0.35, 0.75, 0.35] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-28">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-yellow-300/40 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[.28em] text-yellow-200">
            Welcome Future Student
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-[.95] tracking-tight md:text-7xl">
            Enter the world’s first Credit U™ admissions experience.
          </h1>
          <p className="mt-6 max-w-2xl text-xl font-semibold leading-relaxed text-blue-100">
            Keep your current campus exactly as built. This layer adds living campus energy, admissions storytelling, and modular buildings that expand the university without interrupting the existing foundation.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <CampusButton href="/admissions" eventName="hero_enter_admissions_clicked">Enter Admissions Hall</CampusButton>
            <CampusButton href="/free-assessment" eventName="hero_assessment_clicked" className="bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20">Take Free Assessment™</CampusButton>
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
          <p className="text-sm font-black uppercase tracking-[.24em] text-yellow-200">Campus Opens In Layers</p>
          <div className="mt-5 grid gap-3">
            {['Admissions Hall', 'Registrar’s Office', 'Financial Lab', 'Student Union', 'Mission 800™ Center', 'Graduation Hall'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-blue-900/45 px-5 py-4"
              >
                <span className="font-bold">{item}</span>
                <span className="rounded-full bg-yellow-300 px-3 py-1 text-xs font-black text-blue-950">OPEN</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
