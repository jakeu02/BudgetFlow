/**
 * Validates password strength.
 * Returns null if valid, or an error message string if invalid.
 */
export function validatePassword(password) {
  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number.';
  }
  return null;
}

/**
 * Maps Supabase auth error messages to user-safe generic messages.
 * Prevents leaking whether an email exists.
 */
export function sanitizeAuthError(error) {
  if (!error) return null;
  const msg = error.message || '';

  if (msg.includes('rate') || msg.includes('too many') || error.status === 429) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (
    msg.includes('Invalid login credentials') ||
    msg.includes('Email not confirmed') ||
    msg.includes('User not found')
  ) {
    return 'Invalid email or password. Please try again.';
  }
  if (msg.includes('already registered') || msg.includes('already been registered')) {
    return 'Unable to create account. Please try a different email or sign in.';
  }
  return 'Something went wrong. Please try again.';
}
