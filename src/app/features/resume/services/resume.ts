import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';

import { apiUrl } from 'src/app/core/utils/url.util';
import { Resume } from '../models/resume.models';

@Injectable({
  providedIn: 'root',
})
export class ResumeService extends BaseCrudService<Resume> {
  protected override endpoint = apiUrl('/api/v1/admin/resumes');

  getDefaultResume(): Observable<Resume> {
    return this.http.get<Resume>(`${this.endpoint}/default`);
  }
}
