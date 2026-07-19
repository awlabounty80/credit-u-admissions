type CampusEventPayload = Record<string, string | number | boolean | null | undefined>;

export async function trackCampusEvent(eventName: string, payload: CampusEventPayload = {}) {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('credit-u-campus-event', { detail: { eventName, payload } }));
    }

    await fetch('/api/campus-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName, payload, occurredAt: new Date().toISOString() })
    }).catch(() => null);
  } catch {
    return null;
  }
}
