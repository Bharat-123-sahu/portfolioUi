import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { LoginRequest } from '../model/login-request.model';
import { LoginResponse } from '../model/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = `${environment.apiUrl}/api/v1/admin/auth`;

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, payload);
  }
}
