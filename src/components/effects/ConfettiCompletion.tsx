export function ConfettiCompletion({ active = false }: { active?: boolean }) {
  if (!active) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 40 }).map((_, index) => (
        <span
          key={index}
          className="absolute top-0 h-2 w-2 rounded-sm bg-yellow-300 animate-bounce"
          style={{ left: `${(index * 37) % 100}%`, animationDelay: `${(index % 10) * 0.1}s` }}
        />
      ))}
    </div>
  );
}
