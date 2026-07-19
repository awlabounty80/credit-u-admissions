export const admissionsProgressSteps = [
  'Student Profile',
  'Financial DNA™',
  'Financial GPA™',
  'Campus Placement™',
  'Acceptance Letter™',
];

export function getProgressPercent(currentStepIndex: number) {
  const total = admissionsProgressSteps.length;
  return Math.min(100, Math.max(0, Math.round((currentStepIndex / total) * 100)));
}
