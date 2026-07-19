export function DeanAshleyWelcome() {
  return (
    <section className="bg-white px-6 py-16 text-blue-950">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-8 shadow-xl md:grid-cols-[.85fr_1.15fr]">
        <div className="flex min-h-72 items-center justify-center rounded-[1.5rem] bg-blue-950 text-center text-white">
          <div>
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-300 text-4xl font-black text-blue-950">DA</div>
            <p className="text-sm font-black uppercase tracking-[.25em] text-yellow-200">Dean Ashley</p>
            <p className="mt-2 text-lg font-bold">Credit U Admissions</p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm font-black uppercase tracking-[.28em] text-blue-600">A Message From The Dean</p>
          <h2 className="mt-3 text-4xl font-black">Every student starts somewhere. Today is your first step.</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-700">
            The Free Credit U Assessment™ is not here to judge you. It is here to locate you, guide you, and give you a real starting path. This is where faith meets FICO, strategy meets action, and your next level gets built with clarity.
          </p>
          <div className="mt-6 rounded-2xl bg-blue-950 p-5 text-white">
            <p className="font-bold">Dean’s Promise: You are more than a score. Credit U helps you understand the system, organize the work, and move with wisdom.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
