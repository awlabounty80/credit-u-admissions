export type CampusBuilding = {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  purpose: string;
  status: 'open' | 'coming-soon' | 'locked';
  icon: string;
  cta: string;
};

export const campusBuildings: CampusBuilding[] = [
  {
    id: 'admissions-hall',
    title: 'Admissions Hall',
    subtitle: 'Start with your Free Credit U Assessment™',
    route: '/admissions',
    purpose: 'Entrance assessment, welcome sequence, admissions decision, and next steps.',
    status: 'open',
    icon: 'GraduationCap',
    cta: 'Enter Admissions'
  },
  {
    id: 'registrar-office',
    title: 'Registrar’s Office',
    subtitle: 'Transcript, GPA, records, and student status',
    route: '/registrar',
    purpose: 'Student profile, Financial GPA™, transcript package, completion records, and certificates.',
    status: 'open',
    icon: 'ScrollText',
    cta: 'Visit Registrar'
  },
  {
    id: 'financial-lab',
    title: 'Financial Lab',
    subtitle: 'Tools, simulations, and credit strategy',
    route: '/financial-lab',
    purpose: 'Credit simulators, utilization calculators, dispute organization, and score scenario planning.',
    status: 'open',
    icon: 'FlaskConical',
    cta: 'Open Lab'
  },
  {
    id: 'library',
    title: 'Credit U Library',
    subtitle: 'Courses, study guides, and financial dictionary',
    route: '/library',
    purpose: 'E-books, Webster Financial Dictionary™, lesson vault, replays, and study guides.',
    status: 'open',
    icon: 'LibraryBig',
    cta: 'Study Now'
  },
  {
    id: 'student-union',
    title: 'Student Union',
    subtitle: 'Community, events, and announcements',
    route: '/student-union',
    purpose: 'Live classes, accountability, announcements, polls, office hours, and campus conversations.',
    status: 'open',
    icon: 'UsersRound',
    cta: 'Join Union'
  },
  {
    id: 'mission-800-center',
    title: 'Mission 800™ Center',
    subtitle: 'Your personalized score-building mission',
    route: '/mission-800',
    purpose: 'Roadmap, goals, milestone tracking, badge progress, and action plan execution.',
    status: 'open',
    icon: 'Target',
    cta: 'Start Mission'
  },
  {
    id: 'graduation-hall',
    title: 'Graduation Hall',
    subtitle: 'Celebrate milestones and unlock alumni status',
    route: '/graduation-hall',
    purpose: 'Certificates, confetti ceremonies, testimonials, alumni badges, and completion rituals.',
    status: 'open',
    icon: 'Trophy',
    cta: 'View Graduation'
  },
  {
    id: 'admin-building',
    title: 'Dean’s Admin Office',
    subtitle: 'Manage and customize assessment settings',
    route: '/admin',
    purpose: 'View enrollment funnels, monitor student leads, and continue building/customizing the Free Assessment.',
    status: 'open',
    icon: 'Sliders',
    cta: 'Open Admin Building'
  }
];
