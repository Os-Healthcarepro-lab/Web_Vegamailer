import { useState, useEffect } from 'react';
import apiServerClient from '@/lib/apiServerClient';

export function useEmailValidation(email, delay = 500) {
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState({ isValid: null, reason: null, suggestions: [] });

  useEffect(() => {
    if (!email || !email.includes('@')) {
      setResult({ isValid: null, reason: null, suggestions: [] });
      return;
    }

    const handler = setTimeout(async () => {
      setIsValidating(true);
      try {
        const response = await apiServerClient.fetch('/validation/validate-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
          throw new Error('Validation request failed');
        }
        
        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error('Email validation error:', error);
        setResult({ isValid: false, reason: 'Could not validate email at this time.', suggestions: [] });
      } finally {
        setIsValidating(false);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [email, delay]);

  return { isValidating, ...result };
}