import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../constants/api';
import { User } from '../models/user.model';
import { DriverRequest } from '../models/driver-request.model';
import { Ride } from '../models/ride.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getRequests(): Observable<DriverRequest[]> {
    return this.http.get<DriverRequest[]>(API.admin.requests);
  }

  approveRequest(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(API.admin.approveRequest(id), {});
  }

  declineRequest(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(API.admin.declineRequest(id), {});
  }

  getRides(): Observable<Ride[]> {
    return this.http.get<Ride[]>(API.admin.rides);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(API.admin.users);
  }

  blockUser(id: number): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(API.admin.blockUser(id), {});
  }

  unblockUser(id: number): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(API.admin.unblockUser(id), {});
  }
}
