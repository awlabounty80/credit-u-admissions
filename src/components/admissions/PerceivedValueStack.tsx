import { estimatedValue } from '../../data/admissionsCopy';

export function PerceivedValueStack() {
  const total = estimatedValue.reduce((sum, item) => sum + Number(item.value.replace('$', '')), 0);
  return (
    <section className="rounded-[2rem] border border-yellow-300/20 bg-white p-7 text-blue-950 shadow-xl">
      <p className="text-sm font-black tracking-[0.25em] text-blue-700">ESTIMATED VALUE</p>
      <div className="mt-5 divide-y divide-blue-100">
        {estimatedValue.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-3 font-bold">
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl bg-yellow-300 p-5 text-center">
        <p className="text-sm font-black tracking-[0.2em]">TODAY’S COST</p>
        <p className="text-4xl font-black">FREE</p>
        <p className="text-xs font-bold opacity-70">Estimated combined value: ${total}</p>
      </div>
    </section>
  );
}
