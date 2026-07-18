import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  set(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get<T>(key: string): T | null {
    const data = localStorage.getItem(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as T;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}