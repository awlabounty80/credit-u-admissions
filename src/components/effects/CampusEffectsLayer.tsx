export function CampusEffectsLayer() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute left-1/4 top-0 h-[70vh] w-16 origin-top rotate-12 bg-blue-300/10 blur-2xl animate-pulse" />
      <div className="absolute right-1/4 top-0 h-[70vh] w-16 origin-top -rotate-12 bg-yellow-200/10 blur-2xl animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,218,80,.12),transparent_28%)]" />
    </div>
  );
}
