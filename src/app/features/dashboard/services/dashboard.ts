import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);


  getAll(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/admin/dashboard`).pipe(
      map((response: any) => response?.data ?? response),
    );
  }

}
