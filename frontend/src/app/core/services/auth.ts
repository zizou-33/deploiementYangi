import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API } from '../constants/api';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    try {
      const raw = localStorage.getItem('user');
      if (raw && raw !== 'undefined' && raw !== 'null') {
        this.currentUserSubject.next(JSON.parse(raw));
      }
    } catch (e) {
      localStorage.removeItem('user');
    }
  }

  register(data: {
    username: string;
    email: string;
    password: string;
    phone: string;
  }): Observable<any> {
    return this.http.post(API.auth.register, data);
  }

  login(data: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(API.auth.login, data).pipe(
      tap((res) => {
        if (res.access) {
          localStorage.setItem('token', res.access);
          localStorage.setItem('refresh', res.refresh);
        }
      }),
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(API.auth.profile).pipe(
      tap((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
    );
  }

  // Rafraîchit le profil et redirige si le rôle a changé
  refreshAndRedirect(): void {
    this.getProfile().subscribe({
      next: (user) => {
        if (user.role === 'driver') this.router.navigate(['/driver/dashboard']);
        else if (user.role === 'admin') this.router.navigate(['/admin/dashboard']);
        else this.router.navigate(['/customer/dashboard']);
      },
    });
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.patch<User>(API.auth.profile, data).pipe(
      tap((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
    );
  }

  changePassword(data: { old_password: string; new_password: string }): Observable<any> {
    return this.http.patch(API.auth.changePassword, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  get role(): string {
    return this.currentUser?.role || '';
  }
}
