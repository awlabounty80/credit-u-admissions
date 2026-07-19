export function DeanAshleyWelcome() {
  return (
    <section className="rounded-[2rem] border border-yellow-300/20 bg-blue-950 p-6 text-white shadow-xl md:p-8">
      <div className="grid gap-6 md:grid-cols-[120px_1fr] md:items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-yellow-300 bg-blue-800 text-center text-sm font-black shadow-lg">
          DEAN<br />ASHLEY
        </div>
        <div>
          <p className="text-sm font-black tracking-[0.25em] text-yellow-300">WELCOME FUTURE STUDENT</p>
          <h2 className="mt-2 text-3xl font-black">Every student starts somewhere. Today is your first step.</h2>
          <p className="mt-3 max-w-3xl text-white/80">
            Credit U™ was built to make financial education feel personal, powerful, and possible. This assessment is not here to judge you. It is here to help you see where you are, what is holding you back, and the next aligned step for your future.
          </p>
        </div>
      </div>
    </section>
  );
}
