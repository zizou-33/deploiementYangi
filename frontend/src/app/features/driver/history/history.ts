import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RideService } from '../../../core/services/ride';
import { AuthService } from '../../../core/services/auth';
import { Ride } from '../../../core/models/ride.model';

@Component({
  selector: 'app-driver-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class HistoryComponent {
  rides: Ride[] = [];
  loading = true;
  error = '';

  private rideService = inject(RideService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.rideService.getDriverHistory().subscribe({
      next: (rides) => {
        this.rides = rides;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = "Impossible de charger l'historique.";
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  logout() {
    this.auth.logout();
  }
}
