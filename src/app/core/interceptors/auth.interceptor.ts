import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { TokenService } from '../services/token.service';

let refreshRequest$: Observable<any> | null = null;

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = tokenService.getToken();
  const isPublicAuthEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/forgot-password') ||
    req.url.includes('/auth/verify-otp') ||
    req.url.includes('/auth/reset-password') ||
    req.url.includes('/auth/refresh-token');

  if (!token || isPublicAuthEndpoint) {
    return next(req);
  }

  const authRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authRequest).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        const refreshToken = tokenService.getRefreshToken();

        if (!refreshToken) {
          tokenService.clearAuth();
          router.navigate(['/login']);

          return throwError(() => error);
        }

        refreshRequest$ ??= authService.refreshToken({ refreshToken }).pipe(
          shareReplay({ bufferSize: 1, refCount: false }),
          finalize(() => {
            refreshRequest$ = null;
          }),
        );

        return refreshRequest$.pipe(
          switchMap((response) => {
            const accessToken = response.data?.accessToken;
            const nextRefreshToken = response.data?.refreshToken;

            if (!accessToken) {
              tokenService.clearAuth();
              router.navigate(['/login']);

              return throwError(() => error);
            }

            tokenService.setTokens(accessToken, nextRefreshToken);

            return next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }),
            );
          }),
          catchError((refreshError) => {
            tokenService.clearAuth();
            router.navigate(['/login']);

            return throwError(() => refreshError);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
