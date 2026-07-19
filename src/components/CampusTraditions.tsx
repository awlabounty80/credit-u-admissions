export function CampusTraditions() {
  const traditions = [
    ['Ring the Bell', 'Celebrate every acceptance, score breakthrough, and milestone.'],
    ['Financial Oath', 'A short commitment before starting the assessment.'],
    ['Move-In Day', 'Student joins Dorm Week Rush™ and receives first assignment.'],
    ['Mission 800™ Walk', 'Student follows their personalized roadmap.'],
    ['Graduation Ceremony', 'Confetti, certificate, and alumni badge when milestones are completed.']
  ];

  return (
    <section className="bg-yellow-50 px-6 py-20 text-blue-950">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black uppercase tracking-[.3em] text-blue-700">Campus Traditions</p>
        <h2 className="mt-3 text-4xl font-black md:text-6xl">Make the journey unforgettable.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {traditions.map(([title, body]) => (
            <div key={title} className="rounded-[1.5rem] border border-yellow-200 bg-white p-5 shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-950 text-yellow-300">★</div>
              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
