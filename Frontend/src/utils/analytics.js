export function trackEvent(name, params = {}) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export function trackPurchaseOnce(orderId, params = {}) {
  const key = `purchase_tracked_${orderId}`;
  if (sessionStorage.getItem(key)) return;
  trackEvent("conversion_event_purchase", {
    transaction_id: orderId,
    ...params,
  });
  sessionStorage.setItem(key, "1");
}