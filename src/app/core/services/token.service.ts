import { Injectable, inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private storageService = inject(StorageService);

  private readonly TOKEN_KEY = environment.tokenKey;

  setToken(token: string): void {
    this.storageService.set(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return this.storageService.get<string>(this.TOKEN_KEY);
  }

  removeToken(): void {
    this.storageService.remove(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}