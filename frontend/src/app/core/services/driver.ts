import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../constants/api';
import { DriverRequest } from '../models/driver-request.model';

@Injectable({ providedIn: 'root' })
export class DriverService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(API.driver.me);
  }

  submitRequest(data: Omit<DriverRequest, 'id' | 'status'>): Observable<any> {
    return this.http.post(API.driver.request, data);
  }
}
