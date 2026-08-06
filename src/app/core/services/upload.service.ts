import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { apiUrl } from '../utils/url.util';

export interface UploadResponse {
  success: boolean;
  fileName: string;
  fileUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {

  private http = inject(HttpClient);

  private apiUrl = apiUrl('/api/v1/admin/upload');

  upload(file: File, folder: string): Observable<UploadResponse> {

    const formData = new FormData();

    formData.append('file', file);
    formData.append('folder', folder);

    return this.http.post<UploadResponse>(
      this.apiUrl,
      formData
    );

  }

}
