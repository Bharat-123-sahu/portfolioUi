import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { apiUrl } from 'src/app/core/utils/url.util';
import { Project } from '../models/project.models';

export type ProjectPreview = Pick<
  Project,
  'previewTitle' | 'previewDescription' | 'previewImage' | 'favicon' | 'domain'
>;

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseCrudService<Project> {
  protected override endpoint = apiUrl('/api/v1/admin/projects');

  /**
   * Get featured projects
   */
  getFeatured(): Observable<Project[]> {
    return this.http.get<Project[]>(
      apiUrl('/api/v1/admin/projects/featured'),
    );
  }

  /**
   * Get active projects
   */
  getActive(): Observable<Project[]> {
    return this.http.get<Project[]>(
      apiUrl('/api/v1/admin/projects/active'),
    );
  }

  previewLiveUrl(url: string): Observable<unknown> {
    return this.http.get<unknown>(
      `${this.endpoint}/preview?url=${encodeURIComponent(url)}`,
    );
  }
}
