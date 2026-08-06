import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { Experience } from '../models/experience.model';
import { apiUrl } from 'src/app/core/utils/url.util';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService extends BaseCrudService<Experience> {

  protected override endpoint =
      apiUrl('/api/v1/admin/experience');

  /**
   * Get current experience
   */
  getCurrent(): Observable<Experience[]> {
    return this.http.get<Experience[]>(
      apiUrl('/api/v1/admin/experience/current'),
    );
  }

  /**
   * Get active experiences
   */
  getActive(): Observable<Experience[]> {
    return this.http.get<Experience[]>(
      apiUrl('/api/v1/admin/experience/active'),
    );
  }

}
