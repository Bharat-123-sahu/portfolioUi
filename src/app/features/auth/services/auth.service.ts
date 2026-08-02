import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  ApiResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '../model/auth-flows.model';
import { LoginRequest } from '../model/login-request.model';
import { LoginResponse } from '../model/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly API = `${environment.apiUrl}/api/v1/admin/auth`;

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, payload);
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API}/forgot-password`, payload);
  }

  verifyOtp(
    payload: VerifyOtpRequest,
  ): Observable<ApiResponse<VerifyOtpResponse>> {
    return this.http.post<ApiResponse<VerifyOtpResponse>>(
      `${this.API}/verify-otp`,
      payload,
    );
  }

  resetPassword(payload: ResetPasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API}/reset-password`, payload);
  }

  changePassword(payload: ChangePasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API}/change-password`, payload);
  }

  refreshToken(
    payload: RefreshTokenRequest,
  ): Observable<ApiResponse<RefreshTokenResponse>> {
    return this.http.post<ApiResponse<RefreshTokenResponse>>(
      `${this.API}/refresh-token`,
      payload,
    );
  }

  logout(refreshToken?: string | null): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API}/logout`, {
      refreshToken,
    });
  }
}
