import { campusBuildings } from '../../data/campusBuildingsElite';

export function LivingCampusBuildings() {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-950 to-blue-800 p-7 text-white shadow-xl">
      <p className="text-sm font-black tracking-[0.25em] text-yellow-300">LIVING CAMPUS MAP</p>
      <h2 className="mt-2 text-3xl font-black">Every feature becomes a building on campus.</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {campusBuildings.map((building) => (
          <a key={building.id} href={building.route} className="group rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-yellow-300/50">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-black text-yellow-300">{building.name}</h3>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">{building.status}</span>
            </div>
            <p className="mt-2 font-bold">{building.purpose}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">{building.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
