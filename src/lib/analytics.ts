export type FunnelEventName =
  | "funnel_card_view"
  | "funnel_card_cta_click"
  | "funnel_card_secondary_click"
  | "funnel_card_scroll";

export async function trackFunnelEvent(eventName: FunnelEventName, metadata: Record<string, unknown> = {}) {
  try {
    if (typeof window === "undefined") return;
    await fetch("/api/funnel-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName, metadata, path: window.location.pathname })
    });
  } catch {
    // Never block the student experience because analytics failed.
  }
}

export async function trackCreditUEvent(eventName: string, metadata: Record<string, unknown> = {}) {
  try {
    if (typeof window === "undefined") return;
    await fetch("/api/analytics/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName, metadata, path: window.location.pathname })
    }).catch(() => null);
  } catch {
    // Never block the student experience because analytics failed.
  }
}
