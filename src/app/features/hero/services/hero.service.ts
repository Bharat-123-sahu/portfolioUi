// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

import { Injectable } from "@angular/core";
import { BaseCrudService } from "src/app/core/services/base/base-crud.service";
import { Hero } from "../models/hero.model";
import { environment } from "src/environments/environment";

// import { environment } from '../../../../environments/environment';
// import { Hero } from '../models/hero.model';
// import { API } from 'src/app/core/constants/api.constants';

// @Injectable({
//   providedIn: 'root',
// })
// export class HeroService {

//   private readonly http = inject(HttpClient);

//   private readonly apiUrl = `${environment.apiUrl}/api/v1/admin/hero`;

//   /**
//    * Get Hero List
//    */
//   getAll(): Observable<Hero[]> {
   
//     return this.http.get<Hero[]>(this.apiUrl);
//   }

//   /**
//    * Get Hero By Id
//    */
//   getById(id: string): Observable<Hero> {
//     return this.http.get<Hero>(`${this.apiUrl}/${id}`);
//   }

//   /**
//    * Create Hero
//    */
//   create(hero: Hero): Observable<Hero> {
//     return this.http.post<Hero>(this.apiUrl, hero);
//   }

//   /**
//    * Update Hero
//    */
//   update(id: string, hero: Hero): Observable<Hero> {
//     return this.http.patch<Hero>(`${this.apiUrl}/${id}`, hero);
//   }

//   /**
//    * Delete Hero
//    */
//   delete(id: string): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`);
//   }
// }


@Injectable({
  providedIn: 'root'
})
export class HeroService extends BaseCrudService<Hero> {

  protected override endpoint =
    `${environment.apiUrl}/api/v1/admin/hero`;

}