import { Injectable, inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private storageService = inject(StorageService);

  private readonly TOKEN_KEY = environment.tokenKey;
  private readonly REFRESH_TOKEN_KEY = `${environment.tokenKey}_refresh`;

  setToken(token: string): void {
    this.storageService.set(this.TOKEN_KEY, token);
  }

  setRefreshToken(token: string): void {
    this.storageService.set(this.REFRESH_TOKEN_KEY, token);
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    this.setToken(accessToken);

    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }
  }

  getToken(): string | null {
    return this.storageService.get<string>(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.storageService.get<string>(this.REFRESH_TOKEN_KEY);
  }

  removeToken(): void {
    this.storageService.remove(this.TOKEN_KEY);
  }

  removeRefreshToken(): void {
    this.storageService.remove(this.REFRESH_TOKEN_KEY);
  }

  clearAuth(): void {
    this.removeToken();
    this.removeRefreshToken();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
