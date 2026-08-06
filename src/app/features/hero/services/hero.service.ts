import { Injectable } from '@angular/core';
import { BaseCrudService } from 'src/app/core/services/base/base-crud.service';
import { apiUrl } from 'src/app/core/utils/url.util';
import { Hero } from '../models/hero.model';

@Injectable({
  providedIn: 'root',
})
export class HeroService extends BaseCrudService<Hero> {
  protected override endpoint = apiUrl('/api/v1/admin/hero');
}
