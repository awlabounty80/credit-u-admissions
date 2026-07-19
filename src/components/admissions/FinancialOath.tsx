export function FinancialOath({ onAgree }: { onAgree?: () => void }) {
  return (
    <section className="rounded-[2rem] border border-yellow-300/30 bg-blue-950 p-7 text-white shadow-xl">
      <p className="text-sm font-black tracking-[0.25em] text-yellow-300">THE CREDIT U FINANCIAL OATH™</p>
      <h3 className="mt-2 text-3xl font-black">Before I begin, I choose awareness over avoidance.</h3>
      <p className="mt-4 max-w-3xl text-white/80">
        I will not be ashamed of where I start. I will learn what I was never taught. I will take aligned action, build with wisdom, and honor the future God is helping me create.
      </p>
      <button onClick={onAgree} className="mt-6 rounded-2xl bg-yellow-300 px-7 py-4 font-black text-blue-950 shadow-xl">
        I’m Ready to Begin →
      </button>
    </section>
  );
}
