export type UserRole = 'CUSTOMER' | 'ADMIN';

const TOKEN_KEY = 'dulce_token';
const USER_KEY = 'dulce_user';
const ROLE_KEY = 'dulce_role';
const NAME_KEY = 'dulce_name';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole(): UserRole | null {
  return localStorage.getItem(ROLE_KEY) as UserRole | null;
}

export function getName(): string | null {
  return localStorage.getItem(NAME_KEY);
}

export function getCustomerId(): number | null {
  return Number(localStorage.getItem(USER_KEY));
}

export function setToken(
  token: string,
  user: string,
  role: UserRole,
  name: string,
): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, user);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(NAME_KEY, name);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(NAME_KEY);
}
