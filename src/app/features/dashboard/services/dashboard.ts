import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiUrl } from 'src/app/core/utils/url.util';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);


  getAll(): Observable<any> {
    return this.http.get(apiUrl('/api/v1/admin/dashboard')).pipe(
      map((response: any) => response?.data ?? response),
    );
  }

}
