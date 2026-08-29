/**
 * serviceSync.js
 * 
 * Provides real-time synchronization of services and pricing across tabs and components
 * via BroadcastChannel, CustomEvents, window focus, and visibility revalidation.
 */

const CHANNEL_NAME = 'sla_services_sync_channel';

/**
 * Broadcasts a service modification event to all open tabs and local listeners.
 */
export const broadcastServiceUpdate = (serviceId = null) => {
  const payload = { type: 'SERVICE_UPDATED', serviceId, timestamp: Date.now() };

  // Broadcast to other browser tabs
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage(payload);
      channel.close();
    }
  } catch (e) {
    // Ignore BroadcastChannel errors if restricted in some environments
  }

  // Dispatch to current window/tab
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sla_services_updated', { detail: payload }));
  }
};

/**
 * Subscribes to real-time service update events across tabs, window focus, and tab visibility.
 * Returns an unsubscribe function.
 */
export const subscribeToServiceUpdates = (callback) => {
  if (typeof window === 'undefined') return () => {};

  let channel = null;
  try {
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === 'SERVICE_UPDATED') {
          callback(event.data);
        }
      };
    }
  } catch (e) {}

  const handleCustomEvent = (event) => {
    callback(event.detail || {});
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      callback({ reason: 'visibility' });
    }
  };

  const handleFocus = () => {
    callback({ reason: 'focus' });
  };

  window.addEventListener('sla_services_updated', handleCustomEvent);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', handleFocus);

  // Also set up a background polling fallback every 15s to catch remote updates
  const pollInterval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      callback({ reason: 'poll' });
    }
  }, 15000);

  return () => {
    if (channel) {
      try { channel.close(); } catch (e) {}
    }
    window.removeEventListener('sla_services_updated', handleCustomEvent);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', handleFocus);
    clearInterval(pollInterval);
  };
};

/**
 * Safely parses any price representation (e.g. "$1", "$35", "$175.50", "4900", 4900, "Custom Quote")
 * into integer cents for the order calculation pipeline.
 */
export const parsePriceToCents = (priceVal) => {
  if (priceVal === undefined || priceVal === null || priceVal === '') return 0;
  
  if (typeof priceVal === 'number') {
    // If it's already represented in cents (e.g. 4900 for $49) vs dollar integer (1 or 35)
    return priceVal >= 1000 ? Math.round(priceVal) : Math.round(priceVal * 100);
  }

  if (typeof priceVal === 'string') {
    const trimmed = priceVal.trim();
    if (trimmed.toLowerCase().includes('custom') || trimmed.toLowerCase().includes('quote')) {
      return 0;
    }
    const cleaned = trimmed.replace(/[^0-9.]/g, '');
    if (!cleaned) return 0;
    const num = parseFloat(cleaned);
    if (isNaN(num)) return 0;
    return Math.round(num * 100);
  }

  return 0;
};

/**
 * Helper to normalize slug matching
 */
const normalizeSlug = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

/**
 * Merges raw API service objects with the base SERVICES_WITH_PACKAGES map
 */
export const mergeServicesWithPackages = (apiServicesList, baseMap, slugToServiceNameMap = {}) => {
  if (!Array.isArray(apiServicesList) || apiServicesList.length === 0) return baseMap;

  const updated = { ...baseMap };

  apiServicesList.forEach((service) => {
    if (!service) return;

    // Find key in baseMap that matches this service
    const targetKey = Object.keys(updated).find((k) => {
      const kSlug = normalizeSlug(k);
      const sSlug = normalizeSlug(service.slug);
      const mappedName = slugToServiceNameMap[service.slug];
      return (
        k.toLowerCase() === (service.title || '').toLowerCase() ||
        kSlug === sSlug ||
        (mappedName && mappedName.toLowerCase() === k.toLowerCase()) ||
        k.toLowerCase().includes((service.title || '').toLowerCase()) ||
        (service.title || '').toLowerCase().includes(k.toLowerCase())
      );
    }) || service.title;

    if (service.packages && typeof service.packages === 'object' && Object.keys(service.packages).length > 0) {
      const existing = updated[targetKey] || { packages: {} };
      const newPackages = { ...existing.packages };

      Object.entries(service.packages).forEach(([pkgKey, pkgData]) => {
        if (!pkgData) return;
        const oldPkg = newPackages[pkgKey] || {};
        const parsedPriceCents = parsePriceToCents(pkgData.price !== undefined ? pkgData.price : oldPkg.price);

        newPackages[pkgKey] = {
          name: pkgData.name || oldPkg.name || (pkgKey === 'starter' ? 'Starter Package' : pkgKey === 'growth' ? 'Standard Package' : 'Premium Package'),
          price: parsedPriceCents,
          description: pkgData.description || oldPkg.description || '',
          includes: Array.isArray(pkgData.includes) ? pkgData.includes : (oldPkg.includes || [])
        };
      });

      updated[targetKey] = {
        ...existing,
        packages: newPackages
      };
    }
  });

  return updated;
};
