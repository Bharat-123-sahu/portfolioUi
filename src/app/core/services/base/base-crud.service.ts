import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export abstract class BaseCrudService<T> {

  protected http = inject(HttpClient);

  protected abstract endpoint: string;

  getAll(params?: Record<string, string | number | boolean | null | undefined>): Observable<T[]> {
    return this.http.get<unknown>(this.endpoint, { params: this.cleanParams(params) }).pipe(
      map((response) => this.unwrapCollection(response)),
    );
  }

  getById(id: string): Observable<T> {
    return this.http.get<unknown>(`${this.endpoint}/${encodeURIComponent(id)}`).pipe(
      map((response) => this.unwrapItem(response)),
    );
  }

  create(data: Partial<T>): Observable<T> {
    return this.http.post<unknown>(this.endpoint, data).pipe(
      map((response) => this.unwrapItem(response)),
    );
  }

  update(id: string, data: Partial<T>): Observable<T> {
    return this.http.patch<unknown>(`${this.endpoint}/${encodeURIComponent(id)}`, data).pipe(
      map((response) => this.unwrapItem(response)),
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${encodeURIComponent(id)}`);
  }

  private cleanParams(params?: Record<string, string | number | boolean | null | undefined>): Record<string, string | number | boolean> | undefined {
    if (!params) {
      return undefined;
    }

    return Object.entries(params).reduce(
      (clean, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          clean[key] = value;
        }

        return clean;
      },
      {} as Record<string, string | number | boolean>,
    );
  }

  private unwrapCollection(response: unknown): T[] {
    if (Array.isArray(response)) {
      return response as T[];
    }

    const root = response as Record<string, unknown> | null;
    const data = root?.['data'];

    if (Array.isArray(data)) {
      return data as T[];
    }

    if (data && typeof data === 'object') {
      const arrayValue = Object.values(data as Record<string, unknown>).find(Array.isArray);
      return Array.isArray(arrayValue) ? arrayValue as T[] : [];
    }

    if (root && typeof root === 'object') {
      const arrayValue = Object.values(root).find(Array.isArray);
      return Array.isArray(arrayValue) ? arrayValue as T[] : [];
    }

    return [];
  }

  private unwrapItem(response: unknown): T {
    const root = response as Record<string, unknown> | null;
    const data = root?.['data'];

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const nestedItem = Object.values(data as Record<string, unknown>).find(
        (value) => value && typeof value === 'object' && !Array.isArray(value),
      );

      return (nestedItem ?? data) as T;
    }

    return (data ?? response) as T;
  }

}
