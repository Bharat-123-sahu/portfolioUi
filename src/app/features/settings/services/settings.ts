import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { PortfolioSettings } from '../models/settings.model';
import { apiUrl } from 'src/app/core/utils/url.util';

@Injectable({
  providedIn: 'root',
})
export class SettingsService extends BaseCrudService<PortfolioSettings> {
  protected override endpoint = apiUrl('/api/v1/admin/settings');

  getSettings(): Observable<PortfolioSettings> {
    return this.http.get<any>(this.endpoint).pipe(
      map((response) => {
        const settings =
          response?.data?.settings ?? response?.settings ?? response?.data ?? response;

        return Array.isArray(settings) ? settings[0] ?? null : settings;
      }),
    );
  }

  updateSettings(data: Partial<PortfolioSettings>): Observable<PortfolioSettings> {
    return this.http.put<PortfolioSettings>(this.endpoint, this.cleanPayload(data));
  }

  private cleanPayload(data: Partial<PortfolioSettings>): Partial<PortfolioSettings> {
    return Object.keys(data).reduce((payload, key) => {
      const value = data[key as keyof PortfolioSettings];
      const cleanValue = typeof value === 'string' ? value.trim() : value;

      if ((key === 'supportEmail' || key === 'contactEmail') && cleanValue === '') {
        return payload;
      }

      return {
        ...payload,
        [key]: cleanValue,
      };
    }, {} as Partial<PortfolioSettings>);
  }
}
