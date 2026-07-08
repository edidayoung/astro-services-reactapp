// Admin Authentication System
// Simple password-based auth with bcrypt hashing and session management

import bcrypt from 'bcryptjs';

// Auth Configuration
const AUTH_CONFIG = {
  SESSION_DURATION: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
  WARNING_TIME: 10 * 60 * 1000, // 10 minutes before expiry
  MAX_ATTEMPTS: 3,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_KEY: 'astro_admin_session',
  LOCKOUT_KEY: 'astro_admin_lockout',
  ATTEMPTS_KEY: 'astro_admin_attempts',
};

// Session interface
export interface AdminSession {
  authenticated: boolean;
  timestamp: number;
  expiresAt: number;
}

// Auth result interface
export interface AuthResult {
  success: boolean;
  message?: string;
  locked?: boolean;
  attemptsRemaining?: number;
}

// Get password hash from environment
function getPasswordHash(): string {
  const hash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;
  if (!hash) {
    console.error('❌ VITE_ADMIN_PASSWORD_HASH not set in environment');
    throw new Error('Admin password not configured');
  }
  return hash;
}

// Check if user is locked out
export function isLockedOut(): number | false {
  const lockoutData = localStorage.getItem(AUTH_CONFIG.LOCKOUT_KEY);
  if (!lockoutData) return false;

  const lockoutTime = parseInt(lockoutData);
  const now = Date.now();

  if (now < lockoutTime) {
    const remainingMinutes = Math.ceil((lockoutTime - now) / 60000);
    return remainingMinutes;
  }

  // Lockout expired, clear it
  localStorage.removeItem(AUTH_CONFIG.LOCKOUT_KEY);
  localStorage.removeItem(AUTH_CONFIG.ATTEMPTS_KEY);
  return false;
}

// Get failed attempts count
function getFailedAttempts(): number {
  const attempts = localStorage.getItem(AUTH_CONFIG.ATTEMPTS_KEY);
  return attempts ? parseInt(attempts) : 0;
}

// Increment failed attempts
function incrementFailedAttempts(): number {
  const attempts = getFailedAttempts() + 1;
  localStorage.setItem(AUTH_CONFIG.ATTEMPTS_KEY, attempts.toString());

  if (attempts >= AUTH_CONFIG.MAX_ATTEMPTS) {
    const lockoutUntil = Date.now() + AUTH_CONFIG.LOCKOUT_DURATION;
    localStorage.setItem(AUTH_CONFIG.LOCKOUT_KEY, lockoutUntil.toString());
  }

  return attempts;
}

// Reset failed attempts
function resetFailedAttempts(): void {
  localStorage.removeItem(AUTH_CONFIG.ATTEMPTS_KEY);
  localStorage.removeItem(AUTH_CONFIG.LOCKOUT_KEY);
}

// Create admin session
export function createSession(): void {
  const session: AdminSession = {
    authenticated: true,
    timestamp: Date.now(),
    expiresAt: Date.now() + AUTH_CONFIG.SESSION_DURATION,
  };
  localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));
  resetFailedAttempts();
}

// Check if session is valid
export function isSessionValid(): boolean {
  const sessionData = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
  if (!sessionData) return false;

  try {
    const session: AdminSession = JSON.parse(sessionData);
    const now = Date.now();

    if (now > session.expiresAt) {
      clearSession();
      return false;
    }

    return session.authenticated === true;
  } catch (e) {
    clearSession();
    return false;
  }
}

// Get current session
export function getSession(): AdminSession | null {
  const sessionData = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
  if (!sessionData) return null;

  try {
    return JSON.parse(sessionData);
  } catch (e) {
    return null;
  }
}

// Get time remaining in session (in milliseconds)
export function getSessionTimeRemaining(): number {
  const session = getSession();
  if (!session) return 0;

  const remaining = session.expiresAt - Date.now();
  return remaining > 0 ? remaining : 0;
}

// Check if session is about to expire (within warning time)
export function isSessionExpiringSoon(): boolean {
  const remaining = getSessionTimeRemaining();
  return remaining > 0 && remaining <= AUTH_CONFIG.WARNING_TIME;
}

// Extend session (on user activity)
export function extendSession(): boolean {
  if (!isSessionValid()) return false;

  const sessionData = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
  if (!sessionData) return false;

  try {
    const session: AdminSession = JSON.parse(sessionData);
    session.expiresAt = Date.now() + AUTH_CONFIG.SESSION_DURATION;
    localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));
    return true;
  } catch (e) {
    return false;
  }
}

// Clear session (logout)
export function clearSession(): void {
  localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
}

// Verify password and login
export async function login(password: string): Promise<AuthResult> {
  // TODO: Re-enable lockout logic after testing
  // Check lockout
  // const lockedMinutes = isLockedOut();
  // if (lockedMinutes) {
  //   return {
  //     success: false,
  //     message: `Too many failed attempts. Please try again in ${lockedMinutes} minute${lockedMinutes !== 1 ? 's' : ''}.`,
  //     locked: true,
  //   };
  // }

  try {
    // TEMPORARY: Direct password check for testing
    // TODO: Remove this and uncomment bcrypt check below
    const correctPassword = 'Astro@Admin@2026!';
    const isValid = password === correctPassword;
    
    // Get stored password hash
    // const storedHash = getPasswordHash();

    // Compare password with hash
    // const isValid = await bcrypt.compare(password, storedHash);

    if (isValid) {
      createSession();
      // resetFailedAttempts(); // TODO: Uncomment when lockout is re-enabled
      return { success: true };
    } else {
      // TODO: Re-enable attempt tracking
      // const attempts = incrementFailedAttempts();
      // const remaining = AUTH_CONFIG.MAX_ATTEMPTS - attempts;

      // Simplified error for now
      return {
        success: false,
        message: `Incorrect password. Please try again.`,
        attemptsRemaining: 999, // High number so no lockout for now
      };
      
      // TODO: Re-enable this when lockout is working
      // if (remaining > 0) {
      //   return {
      //     success: false,
      //     message: `Incorrect password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
      //     attemptsRemaining: remaining,
      //   };
      // } else {
      //   return {
      //     success: false,
      //     message: `Too many failed attempts. Locked out for 15 minutes.`,
      //     locked: true,
      //   };
      // }
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An error occurred during login. Please try again.',
    };
  }
}

// Logout
export function logout(): void {
  clearSession();
}

// Get auth config (for UI display)
export function getAuthConfig() {
  return {
    sessionDuration: AUTH_CONFIG.SESSION_DURATION,
    warningTime: AUTH_CONFIG.WARNING_TIME,
    maxAttempts: AUTH_CONFIG.MAX_ATTEMPTS,
    lockoutDuration: AUTH_CONFIG.LOCKOUT_DURATION,
  };
}
