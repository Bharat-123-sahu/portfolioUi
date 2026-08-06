import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { apiUrl } from 'src/app/core/utils/url.util';
import { Certificate } from '../models/certificate.models';

@Injectable({
  providedIn: 'root',
})
export class CertificateService extends BaseCrudService<Certificate> {
  protected override endpoint = apiUrl('/api/v1/admin/certificates');

  /**
   * Get active certificates
   */
  getActive(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.endpoint}?isActive=true`);
  }
}
