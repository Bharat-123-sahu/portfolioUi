import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';

import { environment } from 'src/environments/environment';
import { Resume } from '../models/resume.models';

@Injectable({
  providedIn: 'root',
})
export class ResumeService extends BaseCrudService<Resume> {

protected override endpoint =
      `${environment.apiUrl}/api/v1/admin/about`;

  getDefaultResume(): Observable<Resume> {
    return this.http.get<Resume>(
      `${environment.apiUrl}/resumes/default`
    );
  }

}