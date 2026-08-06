import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { Contact } from '../models/contact.model';
import { apiUrl } from 'src/app/core/utils/url.util';

@Injectable({
  providedIn: 'root',
})
export class ContactService extends BaseCrudService<Contact> {
  protected override endpoint = apiUrl('/api/v1/admin/contact');

  getActive(): Observable<Contact> {
    return this.http.get<Contact>(`${this.endpoint}?isActive=true`);
  }
}
