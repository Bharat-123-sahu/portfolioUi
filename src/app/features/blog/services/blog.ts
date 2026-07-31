import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { environment } from 'src/environments/environment';
import { Blog } from '../models/blog.models';

@Injectable({
  providedIn: 'root',
})
export class BlogService extends BaseCrudService<Blog> {
  protected override endpoint = `${environment.apiUrl}/api/v1/admin/blogs`;

  getPublished(): Observable<Blog[]> {
    return this.http.get<Blog[]>(
      `${this.endpoint}?isPublished=true&isActive=true`,
    );
  }

  generateSlug(title: string): Observable<{ slug: string }> {
    const slug = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return new Observable((subscriber) => {
      subscriber.next({ slug });
      subscriber.complete();
    });
  }
}
