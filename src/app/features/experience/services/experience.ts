import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { Experience } from '../models/experience.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService extends BaseCrudService<Experience> {

  protected override endpoint =
      `${environment.apiUrl}/api/v1/admin/experience`;

  /**
   * Get current experience
   */
  getCurrent(): Observable<Experience[]> {
    return this.http.get<Experience[]>(
      `${environment.apiUrl}/api/v1/admin/experience/current`,
    );
  }

  /**
   * Get active experiences
   */
  getActive(): Observable<Experience[]> {
    return this.http.get<Experience[]>(
      `${environment.apiUrl}/api/v1/admin/experience/active`,
    );
  }

}
