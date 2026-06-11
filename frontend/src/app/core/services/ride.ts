import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../constants/api';
import { Ride, CreateRidePayload } from '../models/ride.model';
import { Review } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class RideService {
  constructor(private http: HttpClient) {}

  createRide(payload: CreateRidePayload): Observable<Ride> {
    return this.http.post<Ride>(API.ride.create, payload);
  }

  getCustomerHistory(): Observable<Ride[]> {
    return this.http.get<Ride[]>(API.ride.customerHistory);
  }

  getDriverHistory(): Observable<Ride[]> {
    return this.http.get<Ride[]>(API.ride.driverHistory);
  }

  getAvailableRides(): Observable<Ride[]> {
    return this.http.get<Ride[]>(API.ride.available);
  }

  getRideDetail(id: number): Observable<Ride> {
    return this.http.get<Ride>(API.ride.detail(id));
  }

  cancelRide(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(API.ride.cancel(id), {});
  }

  acceptRide(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(API.ride.accept(id), {});
  }

  startRide(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(API.ride.start(id), {});
  }

  completeRide(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(API.ride.complete(id), {});
  }

  reviewRide(id: number, data: Review): Observable<any> {
    return this.http.post(API.ride.review(id), data);
  }
}
