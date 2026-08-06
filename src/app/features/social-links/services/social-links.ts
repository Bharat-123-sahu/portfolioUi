import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { SocialLink } from '../models/social-link.model';
import { apiUrl } from 'src/app/core/utils/url.util';

@Injectable({
  providedIn: 'root',
})
export class SocialLinkService extends BaseCrudService<SocialLink> {
  protected override endpoint = apiUrl('/api/v1/admin/social-links');

  getVisible(): Observable<SocialLink[]> {
    return this.http.get<SocialLink[]>(`${this.endpoint}?isVisible=true`);
  }
}
