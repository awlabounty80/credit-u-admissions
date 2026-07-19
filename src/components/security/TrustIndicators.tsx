import { trustIndicators } from '../../data/admissionsCopy';

export function TrustIndicators() {
  return (
    <div className="flex flex-wrap gap-3" aria-label="Assessment trust indicators">
      {trustIndicators.map((item) => (
        <div key={item} className="rounded-full border border-yellow-300/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur">
          ✓ {item}
        </div>
      ))}
    </div>
  );
}
