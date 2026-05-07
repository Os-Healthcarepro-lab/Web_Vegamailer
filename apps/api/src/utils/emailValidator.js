import { isDisposableEmail } from './disposableEmailList.js';
import { checkEmailTypo } from './emailTypoChecker.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, reason: 'Email is required', suggestions: [] };
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, reason: 'Invalid email format', suggestions: [] };
  }

  if (isDisposableEmail(trimmedEmail)) {
    return { isValid: false, reason: 'Disposable email address not allowed', suggestions: [] };
  }

  // Check for typos
  const { hasSuggestion, suggestion } = checkEmailTypo(trimmedEmail);
  if (hasSuggestion) {
    return { isValid: false, reason: 'Did you mean this domain?', suggestions: [suggestion] };
  }

  return { isValid: true, reason: 'Valid email', suggestions: [] };
}