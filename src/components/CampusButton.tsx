'use client';

import { Link } from 'react-router-dom';
import { trackCampusEvent } from '../lib/campusAnalytics';

type CampusButtonProps = {
  href: string;
  children: React.ReactNode;
  eventName?: string;
  className?: string;
};

export function CampusButton({ href, children, eventName = 'campus_cta_clicked', className = '' }: CampusButtonProps) {
  return (
    <Link
      to={href}
      onClick={() => trackCampusEvent(eventName, { href })}
      className={`inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-4 font-black text-blue-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-yellow-300 ${className}`}
    >
      {children}
    </Link>
  );
}
