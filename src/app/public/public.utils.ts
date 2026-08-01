import { environment } from 'src/environments/environment';

type ApiRecord = Record<string, unknown>;

export function unwrapCollection<T>(response: unknown, key: string): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  const root = response as ApiRecord | null;
  const data = root?.['data'] as ApiRecord | T[] | undefined;

  if (Array.isArray(data)) {
    return data as T[];
  }

  const keyed = data?.[key] ?? root?.[key];
  return Array.isArray(keyed) ? keyed as T[] : [];
}

export function unwrapItem<T>(response: unknown, key: string): T | null {
  const root = response as ApiRecord | null;
  const data = root?.['data'] as ApiRecord | T | undefined;
  const item = (data as ApiRecord)?.[key] ?? root?.[key] ?? data ?? response;

  return item && typeof item === 'object' && !Array.isArray(item) ? item as T : null;
}

export function activeOnly<T extends { isActive?: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.isActive !== false);
}

export function sortByDisplayOrder<T extends { displayOrder?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
}

export function assetUrl(path?: string): string {
  if (!path) {
    return '';
  }

  if (/^(https?:|data:|blob:|mailto:|tel:)/i.test(path)) {
    return path;
  }

  const apiUrl = environment.apiUrl?.replace(/\/$/, '') ?? '';
  const assetPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiUrl}${assetPath}`;
}
