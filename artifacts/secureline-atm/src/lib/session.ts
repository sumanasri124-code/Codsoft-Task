export const SESSION_TOKEN_KEY = 'secureline-atm-session';

export function getSessionToken(): string | null {
  return typeof window === 'undefined'
    ? null
    : window.localStorage.getItem(SESSION_TOKEN_KEY);
}

export function setSessionToken(token: string): void {
  window.localStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function clearSessionToken(): void {
  window.localStorage.removeItem(SESSION_TOKEN_KEY);
}