// Waitlist Validation Utility
export interface WaitlistSubmission {
  email: string;
  role?: string;
  tier?: string;
  honeypot?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitizedEmail?: string;
}

const RFC5322_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function validateWaitlistSubmission(data: WaitlistSubmission): ValidationResult {
  // 1. Anti-spam honeypot detection
  if (data.honeypot && data.honeypot.trim() !== '') {
    return { valid: false, error: 'Spam submission detected by honeypot.' };
  }

  // 2. Email presence check
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: 'A valid email address is required.' };
  }

  const cleanEmail = data.email.trim().toLowerCase();

  // 3. Length checks
  if (cleanEmail.length < 5 || cleanEmail.length > 254) {
    return { valid: false, error: 'Email length is invalid.' };
  }

  // 4. RFC-5322 format validation
  if (!RFC5322_EMAIL_REGEX.test(cleanEmail)) {
    return { valid: false, error: 'Please enter a valid email format.' };
  }

  // 5. Disposable domain filtering (lightweight heuristic)
  const domain = cleanEmail.split('@')[1];
  const blockedDisposable = ['mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com'];
  if (blockedDisposable.includes(domain)) {
    return { valid: false, error: 'Disposable email addresses are not accepted for early access.' };
  }

  return {
    valid: true,
    sanitizedEmail: cleanEmail
  };
}
