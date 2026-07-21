import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { environment } from 'src/environments/environment';
import { Certificate } from '../models/certificate.models';

@Injectable({
  providedIn: 'root',
})
export class CertificateService extends BaseCrudService<Certificate> {

    protected override endpoint =
        `${environment.apiUrl}/api/v1/admin/about`;
  

  /**
   * Get active certificates
   */
  getActive(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(
      `${environment.apiUrl}/certificates/active`
    );
  }

}