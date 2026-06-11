import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  stats = { users: 0, rides: 0, requests: 0, drivers: 0 };
  loading = true;

  private admin = inject(AdminService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.admin.getUsers().subscribe({
      next: (u) => {
        this.stats.users = u.length;
        this.stats.drivers = u.filter((x) => x.role === 'driver').length;
        this.cdr.detectChanges();
      },
    });
    this.admin.getRides().subscribe({
      next: (r) => {
        this.stats.rides = r.length;
        this.cdr.detectChanges();
      },
    });
    this.admin.getRequests().subscribe({
      next: (r) => {
        this.stats.requests = r.filter((x) => x.status === 'pending').length;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  logout() {
    this.auth.logout();
  }
}
