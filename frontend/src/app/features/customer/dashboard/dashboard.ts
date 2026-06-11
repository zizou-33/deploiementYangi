import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { RideService } from '../../../core/services/ride';
import { Ride } from '../../../core/models/ride.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  user: User | null = null;
  recentRides: Ride[] = [];
  loading = true;

  private auth = inject(AuthService);
  private rideService = inject(RideService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.user = this.auth.currentUser;
    this.cdr.detectChanges();

    this.rideService.getCustomerHistory().subscribe({
      next: (rides) => {
        this.recentRides = rides.slice(0, 3);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.recentRides = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get completedRides(): number {
    return this.recentRides.filter(r => r.status === 'completed').length;
  }

  get pendingRides(): number {
    return this.recentRides.filter(r => r.status === 'pending').length;
  }

  logout() { this.auth.logout(); }
}
