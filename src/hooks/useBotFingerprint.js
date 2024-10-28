import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const useBotFingerprint = () => {
  const [fingerprint, setFingerprint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeFingerprint() {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setFingerprint('12');
      } catch (error) {
        console.error('Error initializing fingerprint:', error);
      } finally {
        setLoading(false);
      }
    }
    
    initializeFingerprint();
  }, []);

  return { fingerprint, loading };
};