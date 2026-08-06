import { environment } from 'src/environments/environment';

const SAFE_ABSOLUTE_URL = /^(https?:|data:|blob:|mailto:|tel:)/i;

export function apiBaseUrl(): string {
  return (environment.apiUrl || '').replace(/\/+$/, '');
}

export function apiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl()}${cleanPath}`;
}

export function assetUrl(path?: string | null, fallback = ''): string {
  if (!path) {
    return fallback;
  }

  if (SAFE_ABSOLUTE_URL.test(path)) {
    return path;
  }

  return apiUrl(path);
}
