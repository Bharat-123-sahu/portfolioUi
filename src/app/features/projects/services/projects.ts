import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
// import { Project } from '../models/project.model';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project.models';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseCrudService<Project> {

   protected override endpoint =
       `${environment.apiUrl}/api/v1/admin/experience`;
 

  /**
   * Get featured projects
   */
  getFeatured(): Observable<Project[]> {
    return this.http.get<Project[]>(
      `${environment.apiUrl}/api/v1/admin/projects/featured`
    );
  }

  /**
   * Get active projects
   */
  getActive(): Observable<Project[]> {
    return this.http.get<Project[]>(
      `${environment.apiUrl}/api/v1/admin/projects/active`
    );
  }

}