import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { Skill } from '../models/skills.model';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SkillsService extends BaseCrudService<Skill> {
  protected override endpoint = `${environment.apiUrl}/api/v1/admin/skills`;

  getFeatured(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.endpoint}?isFeatured=true`);
  }

  /**
   * Get skills by category
   */
  getByCategory(category: string): Observable<Skill[]> {
    return this.http.get<Skill[]>(
      `${this.endpoint}?category=${encodeURIComponent(category)}`,
    );
  }
}

