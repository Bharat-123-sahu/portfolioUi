import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export abstract class BaseCrudService<T> {

  protected http = inject(HttpClient);

  protected abstract endpoint: string;

  getAll(params?: any): Observable<T[]> {
    return this.http.get<T[]>(this.endpoint, { params });
  }

  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.endpoint}/${id}`);
  }

  create(data: Partial<T>): Observable<T> {
    return this.http.post<T>(this.endpoint, data);
  }

  update(id: string, data: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.endpoint}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

}