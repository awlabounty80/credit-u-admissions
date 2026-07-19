'use client';

import { Link } from 'react-router-dom';
import { campusBuildings } from '../data/campusBuildings';
import { trackCampusEvent } from '../lib/campusAnalytics';

export function CampusBuildingGrid() {
  return (
    <section className="bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[.3em] text-yellow-300">The Living Campus</p>
          <h2 className="mt-3 text-4xl font-black md:text-6xl">Every feature becomes a building.</h2>
          <p className="mt-4 text-lg text-slate-300">This creates a full university experience while protecting what is already working.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {campusBuildings.map((building) => (
            <Link
              to={building.route}
              key={building.id}
              onClick={() => trackCampusEvent('campus_building_clicked', { buildingId: building.id })}
              className="group rounded-[2rem] border border-blue-400/20 bg-gradient-to-br from-blue-950 to-slate-900 p-6 shadow-2xl transition hover:-translate-y-1 hover:border-yellow-300/70"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="rounded-2xl bg-yellow-300 px-4 py-2 text-sm font-black text-blue-950">{building.status.toUpperCase()}</span>
                <span className="text-3xl">✦</span>
              </div>
              <h3 className="text-2xl font-black text-white">{building.title}</h3>
              <p className="mt-2 font-bold text-yellow-200">{building.subtitle}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">{building.purpose}</p>
              <div className="mt-6 font-black text-yellow-300 group-hover:text-yellow-200">{building.cta} →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
