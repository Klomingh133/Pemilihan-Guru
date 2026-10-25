import { useEffect, useRef } from 'react';
import { EVENT_CONFIG } from '../config/event';

export function useInactivityTimeout(
  onTimeout: () => void,
  enabled: boolean = true,
  timeoutMs: number = EVENT_CONFIG.studentInactivityTimeoutMs
) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      return;
    }

    const resetTimer = () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        onTimeout();
      }, timeoutMs);
    };

    // Set initial timer
    resetTimer();

    // Event listeners to detect activity
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    
    const handleActivity = () => {
      resetTimer();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [onTimeout, enabled, timeoutMs]);
}
