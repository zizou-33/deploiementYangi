import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../constants/api';
import { Notification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(API.notifications.list);
  }

  getDetail(id: number): Observable<Notification> {
    return this.http.get<Notification>(API.notifications.detail(id));
  }

  markAsRead(id: number): Observable<any> {
    return this.http.patch(API.notifications.detail(id), { is_read: true });
  }
}
