import { admissionsProgressSteps, getProgressPercent } from '../../lib/admissionsProgress';

export function AdmissionsProgressPreview({ currentStepIndex = 0 }: { currentStepIndex?: number }) {
  const percent = getProgressPercent(currentStepIndex);
  return (
    <section className="rounded-[2rem] border border-white/10 bg-blue-950 p-6 text-white shadow-xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black tracking-[0.25em] text-yellow-300">ADMISSIONS PROGRESS</p>
          <h3 className="mt-2 text-2xl font-black">Your journey is about to begin.</h3>
        </div>
        <p className="text-3xl font-black text-yellow-300">{percent}%</p>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-yellow-300 transition-all" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {admissionsProgressSteps.map((step, index) => (
          <div key={step} className={`rounded-2xl p-4 text-sm font-bold ${index <= currentStepIndex ? 'bg-yellow-300 text-blue-950' : 'bg-white/10 text-white/80'}`}>
            {index <= currentStepIndex ? '✓' : '□'} {step}
          </div>
        ))}
      </div>
    </section>
  );
}
