import { rewardItems } from '../../data/admissionsCopy';

export function RewardShowcase() {
  return (
    <section className="rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-blue-950 to-blue-800 p-7 text-white shadow-xl">
      <p className="text-sm font-black tracking-[0.25em] text-yellow-300">YOU’LL GRADUATE WITH</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rewardItems.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-5 font-black backdrop-blur">
            🎓 {item}
          </div>
        ))}
      </div>
    </section>
  );
}
