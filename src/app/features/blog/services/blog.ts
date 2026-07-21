import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { environment } from 'src/environments/environment';
import { Blog } from '../models/blog.models';

@Injectable({
  providedIn: 'root',
})
export class BlogService extends BaseCrudService<Blog> {
  protected override endpoint = `${environment.apiUrl}/api/v1/admin/about`;

  getPublished(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${environment.apiUrl}/blogs/published`);
  }

  generateSlug(title: string): Observable<{ slug: string }> {
    return this.http.post<{ slug: string }>(
      `${environment.apiUrl}/blogs/generate-slug`,
      { title },
    );
  }
}
