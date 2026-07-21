import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
     console.log('get dashboard Init');
    return this.http.get(`${environment.apiUrl}/api/v1/admin/dashboard`);
  }

}