import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { Education } from '../models/education.model';
import { apiUrl } from 'src/app/core/utils/url.util';

@Injectable({
  providedIn: 'root',
})
export class EducationService extends BaseCrudService<Education> {

  protected override endpoint =
       apiUrl('/api/v1/admin/education');
 

  /**
   * Get active education records
   */
  getActive(): Observable<Education[]> {
    return this.http.get<Education[]>(
      apiUrl('/api/v1/admin/education/active'),
    );
  }

}
