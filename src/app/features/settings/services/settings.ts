import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { PortfolioSettings } from '../models/settings.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends BaseCrudService<PortfolioSettings> {

   protected override endpoint =
       `${environment.apiUrl}/api/v1/admin/about`;
  getSettings(): Observable<PortfolioSettings> {
    return this.http.get<PortfolioSettings>(
      `${environment.apiUrl}/settings`
    );
  }

  updateSettings(
    data: Partial<PortfolioSettings>
  ): Observable<PortfolioSettings> {
    return this.http.put<PortfolioSettings>(
      `${environment.apiUrl}/settings`,
      data
    );
  }

}