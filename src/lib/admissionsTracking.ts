export type AdmissionsEventName =
  | 'admissions_flow_viewed'
  | 'assessment_start_clicked'
  | 'assessment_completed'
  | 'ai_review_started'
  | 'ai_review_completed'
  | 'wheel_unlocked'
  | 'wheel_spun'
  | 'acceptance_packet_viewed'
  | 'dorm_week_cta_clicked';

export async function trackAdmissionsEvent(event_name: AdmissionsEventName, payload: Record<string, unknown> = {}) {
  try {
    await fetch('/api/admissions/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_name, payload }),
    });
  } catch (error) {
    console.warn('Admissions tracking failed', error);
  }
}
