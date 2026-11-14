/**
 * Frontend/src/hooks/useActivePromotion.js
 * 
 * Reusable React Hook for fetching the currently active promotion and theme configuration.
 */

import { useState, useEffect, useCallback } from 'react';
import { getThemeConfig } from '../utils/holidayThemes';

let cachedPromotion = null;
let lastFetchedAt = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute client cache

export const useActivePromotion = () => {
  const [promotion, setPromotion] = useState(cachedPromotion);
  const [loading, setLoading] = useState(!cachedPromotion);
  const [error, setError] = useState(null);

  const fetchActivePromotion = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && cachedPromotion && (now - lastFetchedAt < CACHE_TTL_MS)) {
      setPromotion(cachedPromotion);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/public/promotions/active?_t=${now}`);
      if (!res.ok) throw new Error('Failed to fetch promotion');
      const data = await res.json();

      if (data && data.active && data.promotion) {
        cachedPromotion = data.promotion;
        lastFetchedAt = now;
        setPromotion(data.promotion);
      } else {
        cachedPromotion = null;
        lastFetchedAt = now;
        setPromotion(null);
      }
    } catch (err) {
      console.warn('Could not load active promotion:', err.message);
      setError(err.message);
      setPromotion(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivePromotion();
  }, [fetchActivePromotion]);

  const trackInteraction = useCallback(async (type) => {
    if (!promotion || !promotion.id) return;
    try {
      await fetch('/api/public/promotions/track-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promotionId: promotion.id,
          type
        })
      });
    } catch (err) {
      // Non-blocking telemetry
    }
  }, [promotion]);

  const themeConfig = getThemeConfig(promotion?.holidayTheme);

  return {
    promotion,
    isActive: Boolean(promotion),
    themeConfig,
    loading,
    error,
    trackInteraction,
    refetch: () => fetchActivePromotion(true)
  };
};

export default useActivePromotion;

