import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { SocialLink } from '../models/social-link.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocialLinkService extends BaseCrudService<SocialLink> {

 protected override endpoint =
      `${environment.apiUrl}/api/v1/admin/about`;


  getVisible(): Observable<SocialLink[]> {
    return this.http.get<SocialLink[]>(
      `${environment.apiUrl}/social-links/visible`
    );
  }

}