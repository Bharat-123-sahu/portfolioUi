import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { PortfolioSettings } from '../models/settings.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService extends BaseCrudService<PortfolioSettings> {
  protected override endpoint = `${environment.apiUrl}/api/v1/admin/settings`;

  getSettings(): Observable<PortfolioSettings> {
    return this.http.get<PortfolioSettings>(this.endpoint);
  }

  updateSettings(data: Partial<PortfolioSettings>): Observable<PortfolioSettings> {
    return this.http.put<PortfolioSettings>(this.endpoint, data);
  }
}
